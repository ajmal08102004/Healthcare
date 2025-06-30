import React, { useState, useEffect } from 'react';
import { Search, BookOpen, Star, Bookmark, Plus } from 'lucide-react';
import apiService from '../../services/api';

const BooksList = () => {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [bookType, setBookType] = useState('');

  useEffect(() => {
    fetchBooks();
    fetchCategories();
  }, [searchTerm, selectedCategory, bookType]);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const params = {};
      if (searchTerm) params.search = searchTerm;
      if (selectedCategory) params.category = selectedCategory;
      if (bookType) params.book_type = bookType;
      
      const response = await apiService.getBooks(params);
      setBooks(response.results || []);
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await apiService.getBookCategories();
      setCategories(response.results || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleBookmark = async (bookId) => {
    try {
      await apiService.bookmarkBook(bookId);
      // Refresh books to update bookmark status
      fetchBooks();
    } catch (error) {
      console.error('Error bookmarking book:', error);
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Healthcare Library</h1>
          <p className="text-gray-600">Discover and explore healthcare books and resources</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search books..."
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

            {/* Book Type Filter */}
            <select
              value={bookType}
              onChange={(e) => setBookType(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Types</option>
              <option value="educational">Educational</option>
              <option value="reference">Reference</option>
              <option value="research">Research</option>
              <option value="guide">Guide</option>
              <option value="manual">Manual</option>
            </select>

            {/* Add Book Button */}
            <button className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Plus className="w-4 h-4 mr-2" />
              Add Book
            </button>
          </div>
        </div>

        {/* Books Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {books.map((book) => (
            <div key={book.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
              {/* Book Cover */}
              <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 rounded-t-lg flex items-center justify-center">
                {book.cover_image ? (
                  <img
                    src={book.cover_image}
                    alt={book.title}
                    className="w-full h-full object-cover rounded-t-lg"
                  />
                ) : (
                  <BookOpen className="w-16 h-16 text-white" />
                )}
              </div>

              {/* Book Info */}
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-gray-900 text-sm line-clamp-2">
                    {book.title}
                  </h3>
                  <button
                    onClick={() => handleBookmark(book.id)}
                    className={`p-1 rounded ${
                      book.is_bookmarked
                        ? 'text-blue-600 bg-blue-50'
                        : 'text-gray-400 hover:text-blue-600'
                    }`}
                  >
                    <Bookmark className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-sm text-gray-600 mb-2">{book.author}</p>
                
                <div className="flex items-center mb-2">
                  <div className="flex items-center mr-2">
                    {renderStars(Math.round(book.average_rating || 0))}
                  </div>
                  <span className="text-xs text-gray-500">
                    ({book.reviews_count} reviews)
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span className="bg-gray-100 px-2 py-1 rounded">
                    {book.category_name}
                  </span>
                  <span className="capitalize">{book.book_type}</span>
                </div>

                {book.description && (
                  <p className="text-xs text-gray-600 mt-2 line-clamp-2">
                    {book.description}
                  </p>
                )}

                <div className="mt-3 flex justify-between items-center">
                  <span className={`text-xs px-2 py-1 rounded ${
                    book.is_available 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {book.is_available ? 'Available' : 'Not Available'}
                  </span>
                  
                  <button className="text-xs text-blue-600 hover:text-blue-800 font-medium">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {books.length === 0 && !loading && (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No books found</h3>
            <p className="text-gray-600">Try adjusting your search criteria or add some books to the library.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BooksList;