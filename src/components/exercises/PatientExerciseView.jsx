import React, { useState } from 'react';
import { 
  Play, 
  Pause, 
  CheckCircle, 
  Clock, 
  Target, 
  Calendar,
  AlertCircle,
  RotateCcw,
  ChevronRight,
  Timer,
  Award,
  TrendingUp
} from 'lucide-react';

const PatientExerciseView = () => {
  const [activeTab, setActiveTab] = useState('today');
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [exerciseInProgress, setExerciseInProgress] = useState(null);
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Mock assigned exercises data
  const assignedExercises = {
    today: [
      {
        id: 1,
        name: 'Knee Flexion Stretch',
        category: 'Flexibility',
        difficulty: 'Beginner',
        duration: '2 minutes',
        sets: 3,
        reps: 10,
        description: 'Gentle knee flexion to improve range of motion',
        instructions: [
          'Sit on the edge of your bed with feet flat on floor',
          'Slowly bend your affected knee as far as comfortable',
          'Hold the position for 30 seconds',
          'Slowly straighten your leg',
          'Repeat for prescribed repetitions'
        ],
        assignedBy: 'Dr. Sarah Johnson',
        dueDate: '2024-01-15',
        status: 'pending',
        completedSets: 0,
        totalSets: 3,
        notes: 'Focus on gentle movement, stop if pain increases'
      },
      {
        id: 2,
        name: 'Ankle Circles',
        category: 'Mobility',
        difficulty: 'Beginner',
        duration: '1 minute',
        sets: 2,
        reps: 20,
        description: 'Improve ankle mobility and circulation',
        instructions: [
          'Sit comfortably in a chair',
          'Lift one foot slightly off the ground',
          'Make slow, controlled circles with your ankle',
          'Complete circles in both directions',
          'Switch to the other foot'
        ],
        assignedBy: 'Dr. Sarah Johnson',
        dueDate: '2024-01-15',
        status: 'completed',
        completedSets: 2,
        totalSets: 2,
        notes: 'Great for morning routine'
      }
    ],
    upcoming: [
      {
        id: 3,
        name: 'Shoulder Blade Squeeze',
        category: 'Strength',
        difficulty: 'Intermediate',
        duration: '3 minutes',
        sets: 2,
        reps: 15,
        description: 'Strengthen upper back and improve posture',
        instructions: [
          'Stand with arms at your sides',
          'Squeeze shoulder blades together',
          'Hold for 5 seconds',
          'Slowly release',
          'Repeat for prescribed repetitions'
        ],
        assignedBy: 'Dr. Sarah Johnson',
        dueDate: '2024-01-16',
        status: 'scheduled',
        completedSets: 0,
        totalSets: 2,
        notes: 'Start tomorrow after completing today\'s exercises'
      }
    ],
    completed: [
      {
        id: 4,
        name: 'Gentle Walking',
        category: 'Cardio',
        difficulty: 'Beginner',
        duration: '10 minutes',
        sets: 1,
        reps: 1,
        description: 'Low-impact cardiovascular exercise',
        assignedBy: 'Dr. Sarah Johnson',
        completedDate: '2024-01-14',
        status: 'completed',
        completedSets: 1,
        totalSets: 1,
        feedback: 'Felt good, no pain during exercise'
      }
    ]
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-blue-100 text-blue-800';
      case 'scheduled': return 'bg-purple-100 text-purple-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const startExercise = (exercise) => {
    setExerciseInProgress(exercise);
    setSelectedExercise(null);
    setTimer(0);
    setIsTimerRunning(true);
  };

  const completeSet = () => {
    if (exerciseInProgress) {
      const updatedExercise = {
        ...exerciseInProgress,
        completedSets: exerciseInProgress.completedSets + 1
      };
      setExerciseInProgress(updatedExercise);
      
      if (updatedExercise.completedSets >= updatedExercise.totalSets) {
        // Exercise completed
        setExerciseInProgress(null);
        setIsTimerRunning(false);
        setTimer(0);
        alert('Exercise completed! Great job! 🎉');
      }
    }
  };

  const ExerciseCard = ({ exercise, showActions = true }) => (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-1">{exercise.name}</h3>
          <p className="text-sm text-gray-600 mb-2">{exercise.description}</p>
          <div className="flex items-center gap-2 mb-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(exercise.difficulty)}`}>
              {exercise.difficulty}
            </span>
            <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
              {exercise.category}
            </span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(exercise.status)}`}>
              {exercise.status}
            </span>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-4 mb-3 text-sm">
        <div className="flex items-center gap-1">
          <Clock className="h-3 w-3 text-gray-400" />
          <span className="text-gray-600">{exercise.duration}</span>
        </div>
        <div className="flex items-center gap-1">
          <Target className="h-3 w-3 text-gray-400" />
          <span className="text-gray-600">{exercise.sets} sets</span>
        </div>
        <div className="text-gray-600">{exercise.reps} reps</div>
      </div>

      {/* Progress Bar */}
      <div className="mb-3">
        <div className="flex items-center justify-between text-sm mb-1">
          <span className="text-gray-600">Progress</span>
          <span className="text-gray-900 font-medium">
            {exercise.completedSets}/{exercise.totalSets} sets
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${
              exercise.status === 'completed' ? 'bg-green-500' : 'bg-blue-500'
            }`}
            style={{ width: `${(exercise.completedSets / exercise.totalSets) * 100}%` }}
          ></div>
        </div>
      </div>

      {exercise.notes && (
        <div className="bg-blue-50 p-3 rounded-lg mb-3">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> {exercise.notes}
          </p>
        </div>
      )}

      {showActions && (
        <div className="flex gap-2">
          <button
            onClick={() => setSelectedExercise(exercise)}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <ChevronRight className="h-4 w-4" />
            View Details
          </button>
          {exercise.status !== 'completed' && (
            <button
              onClick={() => startExercise(exercise)}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Play className="h-4 w-4" />
              Start Exercise
            </button>
          )}
        </div>
      )}
    </div>
  );

  const ExerciseDetailModal = () => (
    selectedExercise && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">{selectedExercise.name}</h3>
            <button
              onClick={() => setSelectedExercise(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>
          
          <div className="space-y-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Description</h4>
              <p className="text-gray-600">{selectedExercise.description}</p>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Instructions</h4>
              <ol className="space-y-2">
                {selectedExercise.instructions.map((instruction, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </span>
                    <span className="text-gray-700">{instruction}</span>
                  </li>
                ))}
              </ol>
            </div>
            
            <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <div className="text-sm text-gray-600">Sets × Reps</div>
                <div className="font-semibold text-gray-900">{selectedExercise.sets} × {selectedExercise.reps}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Duration</div>
                <div className="font-semibold text-gray-900">{selectedExercise.duration}</div>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setSelectedExercise(null)}
                className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
              {selectedExercise.status !== 'completed' && (
                <button
                  onClick={() => startExercise(selectedExercise)}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Play className="h-4 w-4" />
                  Start Exercise
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  );

  const ExerciseInProgressModal = () => (
    exerciseInProgress && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 w-full max-w-md">
          <div className="text-center mb-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{exerciseInProgress.name}</h3>
            <p className="text-gray-600">Set {exerciseInProgress.completedSets + 1} of {exerciseInProgress.totalSets}</p>
          </div>
          
          <div className="text-center mb-6">
            <div className="text-4xl font-bold text-blue-600 mb-2">
              {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}
            </div>
            <div className="text-sm text-gray-600">Exercise Timer</div>
          </div>
          
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Current Set Instructions:</h4>
              <p className="text-blue-800 text-sm">{exerciseInProgress.reps} repetitions</p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setExerciseInProgress(null);
                  setIsTimerRunning(false);
                  setTimer(0);
                }}
                className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Stop Exercise
              </button>
              <button
                onClick={completeSet}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
              >
                <CheckCircle className="h-4 w-4" />
                Complete Set
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  );

  // Timer effect
  React.useEffect(() => {
    let interval;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimer(timer => timer + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">My Exercises</h2>
            <p className="text-gray-600 text-sm">Complete your assigned exercises</p>
          </div>
          <div className="flex items-center gap-2">
            <Award className="h-5 w-5 text-yellow-500" />
            <span className="text-sm font-medium text-gray-700">5 Day Streak!</span>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <div className="flex">
          {[
            { key: 'today', label: 'Today', count: assignedExercises.today.length },
            { key: 'upcoming', label: 'Upcoming', count: assignedExercises.upcoming.length },
            { key: 'completed', label: 'Completed', count: assignedExercises.completed.length }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.key
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
              {tab.count > 0 && (
                <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                  activeTab === tab.key ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6">
        {/* Today's Progress Summary */}
        {activeTab === 'today' && (
          <div className="bg-gradient-to-r from-blue-50 to-green-50 p-4 rounded-lg mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900">Today's Progress</h3>
                <p className="text-sm text-gray-600">
                  {assignedExercises.today.filter(ex => ex.status === 'completed').length} of {assignedExercises.today.length} exercises completed
                </p>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <span className="text-lg font-bold text-green-600">
                  {Math.round((assignedExercises.today.filter(ex => ex.status === 'completed').length / assignedExercises.today.length) * 100)}%
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Exercise List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {assignedExercises[activeTab].map((exercise) => (
            <ExerciseCard key={exercise.id} exercise={exercise} />
          ))}
        </div>

        {assignedExercises[activeTab].length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {activeTab === 'today' && 'No exercises for today'}
              {activeTab === 'upcoming' && 'No upcoming exercises'}
              {activeTab === 'completed' && 'No completed exercises'}
            </h3>
            <p className="text-gray-600">
              {activeTab === 'today' && 'Great job! You\'ve completed all your exercises for today.'}
              {activeTab === 'upcoming' && 'Your physiotherapist will assign new exercises soon.'}
              {activeTab === 'completed' && 'Completed exercises will appear here.'}
            </p>
          </div>
        )}
      </div>

      {/* Modals */}
      <ExerciseDetailModal />
      <ExerciseInProgressModal />
    </div>
  );
};

export default PatientExerciseView;