import React, { useState, useEffect } from 'react';
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
  TrendingUp,
  Zap,
  Star,
  Trophy,
  Flame
} from 'lucide-react';

const PatientExerciseView = () => {
  const [activeTab, setActiveTab] = useState('today');
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [exerciseInProgress, setExerciseInProgress] = useState(null);
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [completedExercises, setCompletedExercises] = useState(new Set());
  const [showCompletionAnimation, setShowCompletionAnimation] = useState(false);
  const [completionMessage, setCompletionMessage] = useState('');
  const [streakCount, setStreakCount] = useState(5);
  const [showStreakAnimation, setShowStreakAnimation] = useState(false);

  // Mock assigned exercises data
  const [assignedExercises, setAssignedExercises] = useState({
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
  });

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
      
      // Trigger set completion animation
      setShowCompletionAnimation(true);
      setCompletionMessage(`Set ${updatedExercise.completedSets} completed! 💪`);
      
      setTimeout(() => {
        setShowCompletionAnimation(false);
      }, 2000);
      
      if (updatedExercise.completedSets >= updatedExercise.totalSets) {
        // Exercise completed - update state
        setAssignedExercises(prev => ({
          ...prev,
          today: prev.today.map(ex => 
            ex.id === exerciseInProgress.id 
              ? { ...ex, status: 'completed', completedSets: updatedExercise.completedSets }
              : ex
          )
        }));
        
        setCompletedExercises(prev => new Set([...prev, exerciseInProgress.id]));
        
        // Check if all exercises are completed for streak
        const todayExercises = assignedExercises.today;
        const completedToday = todayExercises.filter(ex => 
          ex.status === 'completed' || ex.id === exerciseInProgress.id
        ).length;
        
        if (completedToday === todayExercises.length) {
          setStreakCount(prev => prev + 1);
          setShowStreakAnimation(true);
          setCompletionMessage('🔥 Daily streak increased! All exercises completed! 🎉');
          
          setTimeout(() => {
            setShowStreakAnimation(false);
          }, 3000);
        } else {
          setCompletionMessage('🎉 Exercise completed! Great job!');
        }
        
        setExerciseInProgress(null);
        setIsTimerRunning(false);
        setTimer(0);
      }
    }
  };

  const ExerciseCard = ({ exercise, showActions = true }) => {
    const isCompleted = completedExercises.has(exercise.id) || exercise.status === 'completed';
    
    return (
      <div className={`bg-white border border-gray-200 rounded-lg p-4 transition-all duration-500 hover:shadow-lg hover:scale-[1.02] ${
        isCompleted ? 'ring-2 ring-green-200 bg-gradient-to-br from-green-50 to-white' : 'hover:shadow-md'
      }`}>
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className={`font-semibold transition-colors duration-300 ${
                isCompleted ? 'text-green-800' : 'text-gray-900'
              }`}>
                {exercise.name}
              </h3>
              {isCompleted && (
                <div className="animate-bounce">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
              )}
            </div>
            <p className="text-sm text-gray-600 mb-2">{exercise.description}</p>
            <div className="flex items-center gap-2 mb-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(exercise.difficulty)}`}>
                {exercise.difficulty}
              </span>
              <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                {exercise.category}
              </span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium transition-all duration-300 ${getStatusColor(exercise.status)}`}>
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

        {/* Enhanced Progress Bar */}
        <div className="mb-3">
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="text-gray-600">Progress</span>
            <span className="text-gray-900 font-medium">
              {exercise.completedSets}/{exercise.totalSets} sets
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div 
              className={`h-3 rounded-full transition-all duration-1000 ease-out relative ${
                exercise.status === 'completed' ? 'bg-gradient-to-r from-green-400 to-green-600' : 'bg-gradient-to-r from-blue-400 to-blue-600'
              }`}
              style={{ width: `${(exercise.completedSets / exercise.totalSets) * 100}%` }}
            >
              {exercise.status === 'completed' && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-pulse"></div>
              )}
            </div>
          </div>
        </div>

        {exercise.notes && (
          <div className="bg-blue-50 p-3 rounded-lg mb-3 border-l-4 border-blue-400">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> {exercise.notes}
            </p>
          </div>
        )}

        {showActions && (
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedExercise(exercise)}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200 hover:scale-105"
            >
              <ChevronRight className="h-4 w-4" />
              View Details
            </button>
            {exercise.status !== 'completed' && !isCompleted && (
              <button
                onClick={() => startExercise(exercise)}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 hover:scale-105 hover:shadow-lg"
              >
                <Play className="h-4 w-4" />
                Start Exercise
              </button>
            )}
          </div>
        )}
      </div>
    );
  };

  const ExerciseDetailModal = () => (
    selectedExercise && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
        <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto transform animate-slideUp">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">{selectedExercise.name}</h3>
            <button
              onClick={() => setSelectedExercise(null)}
              className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full"
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
              <ol className="space-y-3">
                {selectedExercise.instructions.map((instruction, index) => (
                  <li key={index} className="flex items-start gap-3 animate-slideInLeft" style={{ animationDelay: `${index * 100}ms` }}>
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </span>
                    <span className="text-gray-700">{instruction}</span>
                  </li>
                ))}
              </ol>
            </div>
            
            <div className="grid grid-cols-2 gap-4 p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg">
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
              {selectedExercise.status !== 'completed' && !completedExercises.has(selectedExercise.id) && (
                <button
                  onClick={() => startExercise(selectedExercise)}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center justify-center gap-2 hover:scale-105"
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
        <div className="bg-white rounded-xl p-6 w-full max-w-md transform animate-pulse-scale">
          <div className="text-center mb-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{exerciseInProgress.name}</h3>
            <p className="text-gray-600">Set {exerciseInProgress.completedSets + 1} of {exerciseInProgress.totalSets}</p>
          </div>
          
          <div className="text-center mb-6">
            <div className="relative">
              <div className="text-4xl font-bold text-blue-600 mb-2 animate-pulse">
                {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}
              </div>
              <div className="absolute inset-0 bg-blue-100 rounded-full opacity-20 animate-ping"></div>
            </div>
            <div className="text-sm text-gray-600 flex items-center justify-center gap-1">
              <Timer className="h-4 w-4" />
              Exercise Timer
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border-l-4 border-blue-400">
              <h4 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
                <Target className="h-4 w-4" />
                Current Set Instructions:
              </h4>
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
                className="flex-1 px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 flex items-center justify-center gap-2 hover:scale-105 hover:shadow-lg"
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

  // Completion Animation Modal
  const CompletionAnimationModal = () => (
    showCompletionAnimation && (
      <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 pointer-events-none">
        <div className="bg-white rounded-xl p-8 text-center transform animate-bounceIn shadow-2xl">
          <div className="mb-4">
            {showStreakAnimation ? (
              <div className="flex items-center justify-center gap-2">
                <Flame className="h-12 w-12 text-orange-500 animate-bounce" />
                <Trophy className="h-12 w-12 text-yellow-500 animate-pulse" />
                <Star className="h-12 w-12 text-blue-500 animate-spin" />
              </div>
            ) : (
              <div className="relative">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto animate-bounce" />
                <div className="absolute inset-0 bg-green-200 rounded-full animate-ping opacity-30"></div>
              </div>
            )}
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {showStreakAnimation ? 'Streak Bonus!' : 'Well Done!'}
          </h3>
          <p className="text-gray-600">{completionMessage}</p>
          {showStreakAnimation && (
            <div className="mt-4 flex items-center justify-center gap-2">
              <Flame className="h-5 w-5 text-orange-500" />
              <span className="font-bold text-orange-600">{streakCount} Day Streak!</span>
            </div>
          )}
        </div>
      </div>
    )
  );

  // Timer effect
  useEffect(() => {
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
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-gradient-to-r from-orange-100 to-red-100 px-3 py-2 rounded-lg">
              <Flame className="h-5 w-5 text-orange-500" />
              <span className="text-sm font-medium text-gray-700">{streakCount} Day Streak!</span>
            </div>
            <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-100 to-orange-100 px-3 py-2 rounded-lg">
              <Award className="h-5 w-5 text-yellow-500" />
              <span className="text-sm font-medium text-gray-700">Level 3</span>
            </div>
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
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-all duration-200 ${
                activeTab === tab.key
                  ? 'border-blue-500 text-blue-600 bg-blue-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              {tab.label}
              {tab.count > 0 && (
                <span className={`ml-2 px-2 py-0.5 rounded-full text-xs transition-colors ${
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
          <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 p-6 rounded-xl mb-6 border border-blue-100">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900 mb-1">Today's Progress</h3>
                <p className="text-sm text-gray-600">
                  {assignedExercises.today.filter(ex => ex.status === 'completed' || completedExercises.has(ex.id)).length} of {assignedExercises.today.length} exercises completed
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <TrendingUp className="h-8 w-8 text-green-600" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                </div>
                <span className="text-2xl font-bold text-green-600 animate-pulse">
                  {Math.round(((assignedExercises.today.filter(ex => ex.status === 'completed' || completedExercises.has(ex.id)).length) / assignedExercises.today.length) * 100)}%
                </span>
              </div>
            </div>
            
            {/* Progress bar */}
            <div className="mt-4 w-full bg-white bg-opacity-50 rounded-full h-3 overflow-hidden">
              <div 
                className="h-3 bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 rounded-full transition-all duration-1000 ease-out relative"
                style={{ width: `${((assignedExercises.today.filter(ex => ex.status === 'completed' || completedExercises.has(ex.id)).length) / assignedExercises.today.length) * 100}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-pulse"></div>
              </div>
            </div>
          </div>
        )}

        {/* Exercise List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {assignedExercises[activeTab].map((exercise, index) => (
            <div 
              key={exercise.id} 
              className="animate-slideInUp"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <ExerciseCard exercise={exercise} />
            </div>
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
      <CompletionAnimationModal />

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(20px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes bounceIn {
          0% {
            opacity: 0;
            transform: scale(0.3);
          }
          50% {
            opacity: 1;
            transform: scale(1.05);
          }
          70% {
            transform: scale(0.9);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        @keyframes pulse-scale {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.02);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        
        .animate-slideUp {
          animation: slideUp 0.4s ease-out;
        }
        
        .animate-slideInLeft {
          animation: slideInLeft 0.5s ease-out;
        }
        
        .animate-slideInUp {
          animation: slideInUp 0.6s ease-out;
        }
        
        .animate-bounceIn {
          animation: bounceIn 0.6s ease-out;
        }
        
        .animate-pulse-scale {
          animation: pulse-scale 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default PatientExerciseView;