import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  Play, 
  Clock, 
  Target, 
  User,
  CheckCircle,
  AlertCircle,
  Calendar,
  MoreHorizontal,
  Send
} from 'lucide-react';

const ExerciseManager = ({ selectedPatient = "All Patients" }) => {
  const [activeTab, setActiveTab] = useState('library');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [exercises, setExercises] = useState([
    {
      id: 1,
      name: 'Knee Flexion Stretch',
      category: 'Flexibility',
      difficulty: 'Beginner',
      duration: '2 minutes',
      sets: 3,
      reps: 10,
      description: 'Gentle knee flexion to improve range of motion',
      instructions: ['Sit on edge of bed', 'Slowly bend knee', 'Hold for 30 seconds'],
      assignedTo: ['John Doe', 'Mike Johnson'],
      createdBy: 'You',
      lastModified: '2 days ago'
    },
    {
      id: 2,
      name: 'Shoulder Blade Squeeze',
      category: 'Strength',
      difficulty: 'Intermediate',
      duration: '3 minutes',
      sets: 2,
      reps: 15,
      description: 'Strengthen upper back and improve posture',
      instructions: ['Stand with arms at sides', 'Squeeze shoulder blades together', 'Hold for 5 seconds'],
      assignedTo: ['Jane Smith'],
      createdBy: 'You',
      lastModified: '1 week ago'
    },
    {
      id: 3,
      name: 'Ankle Circles',
      category: 'Mobility',
      difficulty: 'Beginner',
      duration: '1 minute',
      sets: 1,
      reps: 20,
      description: 'Improve ankle mobility and circulation',
      instructions: ['Sit comfortably', 'Lift one foot', 'Make slow circles with ankle'],
      assignedTo: ['John Doe', 'Sarah Wilson'],
      createdBy: 'Dr. Smith',
      lastModified: '3 days ago'
    }
  ]);

  const [assignments, setAssignments] = useState([
    {
      id: 1,
      patientName: 'John Doe',
      exerciseName: 'Knee Flexion Stretch',
      exerciseId: 1,
      assignedDate: '2024-01-10',
      dueDate: '2024-01-17',
      status: 'in-progress',
      completion: 70,
      lastCompleted: '2024-01-15'
    },
    {
      id: 2,
      patientName: 'Jane Smith',
      exerciseName: 'Shoulder Blade Squeeze',
      exerciseId: 2,
      assignedDate: '2024-01-08',
      dueDate: '2024-01-15',
      status: 'completed',
      completion: 100,
      lastCompleted: '2024-01-15'
    },
    {
      id: 3,
      patientName: 'Mike Johnson',
      exerciseName: 'Ankle Circles',
      exerciseId: 3,
      assignedDate: '2024-01-12',
      dueDate: '2024-01-19',
      status: 'overdue',
      completion: 30,
      lastCompleted: '2024-01-13'
    }
  ]);

  const categories = ['all', 'Strength', 'Flexibility', 'Mobility', 'Balance', 'Cardio'];
  const difficulties = ['Beginner', 'Intermediate', 'Advanced'];

  const filteredExercises = exercises.filter(exercise => {
    const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exercise.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || exercise.category === filterCategory;
    return matchesSearch && matchesCategory;
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
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleCreateExercise = (formData) => {
    const newExercise = {
      id: exercises.length + 1,
      ...formData,
      assignedTo: [],
      createdBy: 'You',
      lastModified: 'Just now'
    };
    setExercises([...exercises, newExercise]);
    setShowCreateModal(false);
    alert('Exercise created successfully!');
  };

  const handleAssignExercise = (assignmentData) => {
    const newAssignment = {
      id: assignments.length + 1,
      exerciseId: selectedExercise.id,
      exerciseName: selectedExercise.name,
      ...assignmentData,
      assignedDate: new Date().toISOString().split('T')[0],
      status: 'pending',
      completion: 0,
      lastCompleted: null
    };
    
    setAssignments([...assignments, newAssignment]);
    
    // Update exercise's assignedTo list
    const updatedExercises = exercises.map(ex => 
      ex.id === selectedExercise.id 
        ? { ...ex, assignedTo: [...ex.assignedTo, assignmentData.patientName] }
        : ex
    );
    setExercises(updatedExercises);
    
    setShowAssignModal(false);
    setSelectedExercise(null);
    alert(`Exercise assigned to ${assignmentData.patientName} successfully!`);
  };

  const handleDeleteExercise = (exerciseId) => {
    if (confirm('Are you sure you want to delete this exercise?')) {
      setExercises(exercises.filter(ex => ex.id !== exerciseId));
      setAssignments(assignments.filter(assign => assign.exerciseId !== exerciseId));
      alert('Exercise deleted successfully!');
    }
  };

  const CreateExerciseModal = () => {
    const [formData, setFormData] = useState({
      name: '',
      category: 'Strength',
      difficulty: 'Beginner',
      duration: '',
      sets: '',
      reps: '',
      description: '',
      instructions: ''
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      const instructionsArray = formData.instructions.split('\n').filter(inst => inst.trim());
      handleCreateExercise({
        ...formData,
        instructions: instructionsArray,
        sets: parseInt(formData.sets),
        reps: parseInt(formData.reps)
      });
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Create New Exercise</h3>
            <button
              onClick={() => setShowCreateModal(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Exercise Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter exercise name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select 
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {categories.slice(1).map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
                <select 
                  value={formData.difficulty}
                  onChange={(e) => setFormData({...formData, difficulty: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {difficulties.map(diff => (
                    <option key={diff} value={diff}>{diff}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                <input
                  type="text"
                  value={formData.duration}
                  onChange={(e) => setFormData({...formData, duration: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="2 minutes"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sets</label>
                <input
                  type="number"
                  value={formData.sets}
                  onChange={(e) => setFormData({...formData, sets: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="3"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Reps</label>
                <input
                  type="number"
                  value={formData.reps}
                  onChange={(e) => setFormData({...formData, reps: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="10"
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Brief description of the exercise"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Instructions</label>
              <textarea
                rows={4}
                value={formData.instructions}
                onChange={(e) => setFormData({...formData, instructions: e.target.value})}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Step-by-step instructions (one per line)"
                required
              />
            </div>
            
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Exercise
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const AssignExerciseModal = () => {
    const [assignmentData, setAssignmentData] = useState({
      patientName: '',
      dueDate: '',
      notes: ''
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      handleAssignExercise(assignmentData);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 w-full max-w-md">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Assign Exercise</h3>
            <button
              onClick={() => setShowAssignModal(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>
          
          {selectedExercise && (
            <div className="bg-blue-50 p-3 rounded-lg mb-4">
              <h4 className="font-medium text-blue-900">{selectedExercise.name}</h4>
              <p className="text-sm text-blue-700">{selectedExercise.description}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Patient</label>
              <select 
                value={assignmentData.patientName}
                onChange={(e) => setAssignmentData({...assignmentData, patientName: e.target.value})}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Choose a patient</option>
                <option value="John Doe">John Doe</option>
                <option value="Jane Smith">Jane Smith</option>
                <option value="Mike Johnson">Mike Johnson</option>
                <option value="Sarah Wilson">Sarah Wilson</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
              <input
                type="date"
                value={assignmentData.dueDate}
                onChange={(e) => setAssignmentData({...assignmentData, dueDate: e.target.value})}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Notes (Optional)</label>
              <textarea
                rows={3}
                value={assignmentData.notes}
                onChange={(e) => setAssignmentData({...assignmentData, notes: e.target.value})}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Any specific instructions or modifications"
              />
            </div>
            
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => setShowAssignModal(false)}
                className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                <Send className="h-4 w-4" />
                Assign Exercise
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Exercise Manager</h2>
            <p className="text-gray-600 text-sm">Create, assign, and track patient exercises</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Create Exercise
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <div className="flex">
          <button
            onClick={() => setActiveTab('library')}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'library'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Exercise Library ({exercises.length})
          </button>
          <button
            onClick={() => setActiveTab('assignments')}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'assignments'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Patient Assignments ({assignments.length})
          </button>
        </div>
      </div>

      <div className="p-6">
        {/* Search and Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder={activeTab === 'library' ? "Search exercises..." : "Search assignments..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          {activeTab === 'library' && (
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat === 'all' ? 'All Categories' : cat}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Exercise Library Tab */}
        {activeTab === 'library' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredExercises.map((exercise) => (
              <div key={exercise.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
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
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        setSelectedExercise(exercise);
                        setShowAssignModal(true);
                      }}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Assign to patient"
                    >
                      <Send className="h-4 w-4" />
                    </button>
                    <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                      <Edit3 className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => handleDeleteExercise(exercise.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
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
                
                <div className="border-t border-gray-100 pt-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">
                      Assigned to {exercise.assignedTo.length} patient{exercise.assignedTo.length !== 1 ? 's' : ''}
                    </span>
                    <span className="text-gray-500">
                      Modified {exercise.lastModified}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Patient Assignments Tab */}
        {activeTab === 'assignments' && (
          <div className="space-y-4">
            {assignments.map((assignment) => (
              <div key={assignment.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{assignment.patientName}</h3>
                        <p className="text-sm text-gray-600">{assignment.exerciseName}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(assignment.status)}`}>
                      {assignment.status.replace('-', ' ')}
                    </span>
                    <button className="p-1 text-gray-400 hover:text-gray-600">
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">Due: {assignment.dueDate}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-gray-600">Last: {assignment.lastCompleted || 'Not started'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Target className="h-4 w-4 text-blue-500" />
                    <span className="text-gray-600">{assignment.completion}% complete</span>
                  </div>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      assignment.status === 'completed' ? 'bg-green-500' :
                      assignment.status === 'overdue' ? 'bg-red-500' : 'bg-blue-500'
                    }`}
                    style={{ width: `${assignment.completion}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty States */}
        {activeTab === 'library' && filteredExercises.length === 0 && (
          <div className="text-center py-12">
            <Target className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No exercises found</h3>
            <p className="text-gray-600 mb-4">Create your first exercise to get started</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create Exercise
            </button>
          </div>
        )}

        {activeTab === 'assignments' && assignments.length === 0 && (
          <div className="text-center py-12">
            <User className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No assignments yet</h3>
            <p className="text-gray-600">Assign exercises to patients to track their progress</p>
          </div>
        )}
      </div>

      {/* Modals */}
      {showCreateModal && <CreateExerciseModal />}
      {showAssignModal && <AssignExerciseModal />}
    </div>
  );
};

export default ExerciseManager;