from django.shortcuts import get_object_or_404
from rest_framework import status, permissions, generics
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from .models import Appointment, AppointmentFeedback
from .serializers import (
    AppointmentSerializer, AppointmentCreateSerializer,
    AppointmentUpdateSerializer, AppointmentFeedbackSerializer
)

class AppointmentListCreateView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        user = request.user
        
        if user.user_type == 'patient':
            appointments = Appointment.objects.filter(patient=user)
        elif user.user_type == 'physiotherapist':
            appointments = Appointment.objects.filter(physiotherapist=user)
        else:
            appointments = Appointment.objects.all()
            
        # Filter by status if provided
        status_filter = request.query_params.get('status', None)
        if status_filter:
            appointments = appointments.filter(status=status_filter)
            
        # Filter by date if provided
        date_filter = request.query_params.get('date', None)
        if date_filter:
            appointments = appointments.filter(date=date_filter)
            
        serializer = AppointmentSerializer(appointments, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        serializer = AppointmentCreateSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            appointment = serializer.save()
            return Response(AppointmentSerializer(appointment).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class AppointmentDetailView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get_appointment(self, pk, user):
        appointment = get_object_or_404(Appointment, pk=pk)
        
        # Check if user has permission to access this appointment
        if user.user_type == 'patient' and appointment.patient != user:
            self.permission_denied(self.request)
        elif user.user_type == 'physiotherapist' and appointment.physiotherapist != user:
            self.permission_denied(self.request)
            
        return appointment
    
    def get(self, request, pk):
        appointment = self.get_appointment(pk, request.user)
        serializer = AppointmentSerializer(appointment)
        return Response(serializer.data)
    
    def put(self, request, pk):
        appointment = self.get_appointment(pk, request.user)
        serializer = AppointmentUpdateSerializer(appointment, data=request.data, partial=True)
        if serializer.is_valid():
            updated_appointment = serializer.save()
            return Response(AppointmentSerializer(updated_appointment).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, pk):
        appointment = self.get_appointment(pk, request.user)
        appointment.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class AppointmentFeedbackView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request, appointment_id):
        # Ensure the appointment exists and belongs to the user
        appointment = get_object_or_404(Appointment, pk=appointment_id, patient=request.user)
        
        # Check if feedback already exists
        if hasattr(appointment, 'feedback'):
            return Response({'error': 'Feedback already submitted for this appointment'}, 
                           status=status.HTTP_400_BAD_REQUEST)
        
        # Create feedback
        serializer = AppointmentFeedbackSerializer(data={
            **request.data,
            'appointment': appointment.id
        })
        
        if serializer.is_valid():
            feedback = serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def get(self, request, appointment_id):
        # Ensure the appointment exists and belongs to the user or physiotherapist
        appointment = get_object_or_404(
            Appointment, 
            pk=appointment_id,
            patient=request.user if request.user.user_type == 'patient' else None,
            physiotherapist=request.user if request.user.user_type == 'physiotherapist' else None
        )
        
        try:
            feedback = appointment.feedback
            serializer = AppointmentFeedbackSerializer(feedback)
            return Response(serializer.data)
        except AppointmentFeedback.DoesNotExist:
            return Response({'error': 'No feedback found for this appointment'}, 
                           status=status.HTTP_404_NOT_FOUND)
