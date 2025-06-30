import React, { useState, useEffect } from 'react';
import { Activity, Clock, Target, Search, Filter, Play, CheckCircle } from 'lucide-react';
import apiService from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const ExercisesList = () => {
  const [exercises, setExercises] = useState([]);
  const [categories, setCategories] = useState([]);
  const [exercisePlans, setExercisePlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('');
  const [activeTab, setActiveTab] = useState('exercises'); // exercises, plans
  const { user } = useAuth();

  useEffect(() => {
    fetchExercises();
    fetchCategories();
    if (user?.user_type === 'patient') {
      fetchExercisePlans();
    }
  }, [searchTerm, selectedCategory, difficultyFilter]);

  const fetchExercises = async () => {
    try {
      setLoading(true);
      const params = {};
      if (searchTerm) params.search = searchTerm;
      if (selectedCategory) params.category = selectedCategory;
      if (difficultyFilter) params.difficulty_level = difficultyFilter;
      
      const response = await apiService.getExercises(params);
      setExercises(response.results || []);
    } catch (error) {
      console.error('Error fetching exercises:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await apiService.getExerciseCategories();
      setCategories(response.results || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchExercisePlans = async () => {
    try {
      const response = await apiService.getExercisePlans();
      setExercisePlans(response.results || []);
    } catch (error) {
      console.error('Error fetching exercise plans:', error);
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDuration = (minutes) => {
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Exercise Library</h1>
          <p className="text-gray-600">Discover and track your rehabilitation exercises</p>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('exercises')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'exercises'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                All Exercises
              </button>
              {user?.user_type === 'patient' && (
                <button
                  onClick={() => setActiveTab('plans')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'plans'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  My Exercise Plans
                </button>
              )}
            </nav>
          </div>
        </div>

        {activeTab === 'exercises' && (
          <>
            {/* Filters */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search exercises..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Category Filter */}
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>

                {/* Difficulty Filter */}
                <select
                  value={difficultyFilter}
                  onChange={(e) => setDifficultyFilter(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Levels</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>

                {/* Clear Filters */}
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('');
                    setDifficultyFilter('');
                  }}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            </div>

            {/* Exercises Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {exercises.map((exercise) => (
                <div key={exercise.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  {/* Exercise Image/Icon */}
                  <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 rounded-t-lg flex items-center justify-center">
                    {exercise.image ? (
                      <img
                        src={exercise.image}
                        alt={exercise.name}
                        className="w-full h-full object-cover rounded-t-lg"
                      />
                    ) : (
                      <Activity className="w-16 h-16 text-white" />
                    )}
                  </div>

                  {/* Exercise Info */}
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-semibold text-gray-900 text-lg">
                        {exercise.name}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(exercise.difficulty_level)}`}>
                        {exercise.difficulty_level}
                      </span>
                    </div>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {exercise.description}
                    </p>

                    {/* Exercise Details */}
                    <div className="space-y-2 mb-4">
                      {exercise.duration && (
                        <div className="flex items-center text-sm text-gray-600">
                          <Clock className="w-4 h-4 mr-2" />
                          <span>{formatDuration(exercise.duration)}</span>
                        </div>
                      )}
                      
                      {exercise.target_area && (
                        <div className="flex items-center text-sm text-gray-600">
                          <Target className="w-4 h-4 mr-2" />
                          <span>{exercise.target_area}</span>
                        </div>
                      )}

                      {exercise.category_name && (
                        <div className="text-xs text-gray-500">
                          <span className="bg-gray-100 px-2 py-1 rounded">
                            {exercise.category_name}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Instructions Preview */}
                    {exercise.instructions && (
                      <div className="mb-4">
                        <p className="text-xs text-gray-600 bg-gray-50 p-3 rounded line-clamp-3">
                          {exercise.instructions}
                        </p>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                      <button className="flex items-center text-sm text-blue-600 hover:text-blue-800 font-medium">
                        <Play className="w-4 h-4 mr-1" />
                        Start Exercise
                      </button>
                      
                      <button className="text-sm text-gray-600 hover:text-gray-800">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty State */}
            {exercises.length === 0 && !loading && (
              <div className="text-center py-12">
                <Activity className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No exercises found</h3>
                <p className="text-gray-600">Try adjusting your search criteria or filters.</p>
              </div>
            )}
          </>
        )}

        {activeTab === 'plans' && user?.user_type === 'patient' && (
          <div className="space-y-6">
            {exercisePlans.map((plan) => (
              <div key={plan.id} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {plan.name}
                    </h3>
                    <p className="text-gray-600">{plan.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500">Progress</div>
                    <div className="text-2xl font-bold text-blue-600">
                      {Math.round((plan.completed_exercises / plan.total_exercises) * 100)}%
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(plan.completed_exercises / plan.total_exercises) * 100}%` }}
                  ></div>
                </div>

                {/* Plan Stats */}
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-lg font-semibold text-gray-900">{plan.total_exercises}</div>
                    <div className="text-sm text-gray-500">Total Exercises</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-green-600">{plan.completed_exercises}</div>
                    <div className="text-sm text-gray-500">Completed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-blue-600">{plan.total_exercises - plan.completed_exercises}</div>
                    <div className="text-sm text-gray-500">Remaining</div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                  <button className="flex items-center text-blue-600 hover:text-blue-800 font-medium">
                    <Play className="w-4 h-4 mr-2" />
                    Continue Plan
                  </button>
                  <button className="text-gray-600 hover:text-gray-800">
                    View All Exercises
                  </button>
                </div>
              </div>
            ))}

            {/* Empty State for Plans */}
            {exercisePlans.length === 0 && !loading && (
              <div className="text-center py-12">
                <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No exercise plans assigned</h3>
                <p className="text-gray-600">Contact your physiotherapist to get a personalized exercise plan.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExercisesList;