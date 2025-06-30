from django.shortcuts import get_object_or_404
from rest_framework import viewsets, status, permissions, filters, serializers
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from django_filters.rest_framework import DjangoFilterBackend
from .models import BookCategory, Book, BookReview, BookBookmark
from .serializers import (
    BookCategorySerializer, BookSerializer, BookListSerializer,
    BookReviewSerializer, BookBookmarkSerializer
)

class BookCategoryViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing book categories.
    Provides CRUD operations for book categories.
    """
    queryset = BookCategory.objects.all()
    serializer_class = BookCategorySerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'created_at']
    ordering = ['name']

class BookViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing books.
    Provides CRUD operations for books with filtering and search capabilities.
    """
    queryset = Book.objects.all()
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'book_type', 'language', 'is_available']
    search_fields = ['title', 'author', 'description', 'publisher']
    ordering_fields = ['title', 'author', 'publication_date', 'created_at']
    ordering = ['title']
    
    def get_serializer_class(self):
        if self.action == 'list':
            return BookListSerializer
        return BookSerializer
    
    def get_queryset(self):
        queryset = Book.objects.all()
        
        # Filter by author if provided
        author = self.request.query_params.get('author', None)
        if author:
            queryset = queryset.filter(author__icontains=author)
        
        # Filter by publication year if provided
        year = self.request.query_params.get('year', None)
        if year:
            queryset = queryset.filter(publication_date__year=year)
            
        return queryset
    
    @action(detail=True, methods=['post', 'delete'], permission_classes=[IsAuthenticated])
    def bookmark(self, request, pk=None):
        """
        Bookmark or unbookmark a book.
        POST: Add bookmark
        DELETE: Remove bookmark
        """
        book = self.get_object()
        
        if request.method == 'POST':
            bookmark, created = BookBookmark.objects.get_or_create(
                book=book, user=request.user
            )
            if created:
                return Response({'message': 'Book bookmarked successfully'}, 
                              status=status.HTTP_201_CREATED)
            else:
                return Response({'message': 'Book already bookmarked'}, 
                              status=status.HTTP_200_OK)
        
        elif request.method == 'DELETE':
            try:
                bookmark = BookBookmark.objects.get(book=book, user=request.user)
                bookmark.delete()
                return Response({'message': 'Bookmark removed successfully'}, 
                              status=status.HTTP_204_NO_CONTENT)
            except BookBookmark.DoesNotExist:
                return Response({'error': 'Bookmark not found'}, 
                              status=status.HTTP_404_NOT_FOUND)
    
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def review(self, request, pk=None):
        """
        Add a review for a book.
        """
        book = self.get_object()
        
        # Check if user already reviewed this book
        if BookReview.objects.filter(book=book, user=request.user).exists():
            return Response({'error': 'You have already reviewed this book'}, 
                          status=status.HTTP_400_BAD_REQUEST)
        
        serializer = BookReviewSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(book=book, user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['get'])
    def reviews(self, request, pk=None):
        """
        Get all reviews for a book.
        """
        book = self.get_object()
        reviews = book.reviews.all()
        serializer = BookReviewSerializer(reviews, many=True)
        return Response(serializer.data)

class BookReviewViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing book reviews.
    Users can only manage their own reviews.
    """
    serializer_class = BookReviewSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return BookReview.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        # Check if user already reviewed this book
        book = serializer.validated_data['book']
        if BookReview.objects.filter(book=book, user=self.request.user).exists():
            raise serializers.ValidationError("You have already reviewed this book")
        serializer.save(user=self.request.user)

class BookBookmarkViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for viewing user's bookmarked books.
    """
    serializer_class = BookBookmarkSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return BookBookmark.objects.filter(user=self.request.user)
