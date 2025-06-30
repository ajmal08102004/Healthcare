from rest_framework import serializers
from .models import BookCategory, Book, BookReview, BookBookmark

class BookCategorySerializer(serializers.ModelSerializer):
    books_count = serializers.SerializerMethodField()
    
    class Meta:
        model = BookCategory
        fields = ['id', 'name', 'description', 'books_count', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']
    
    def get_books_count(self, obj):
        return obj.books.count()

class BookReviewSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = BookReview
        fields = ['id', 'user', 'user_name', 'rating', 'review_text', 'created_at', 'updated_at']
        read_only_fields = ['user', 'created_at', 'updated_at']

class BookSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    reviews = BookReviewSerializer(many=True, read_only=True)
    average_rating = serializers.SerializerMethodField()
    reviews_count = serializers.SerializerMethodField()
    is_bookmarked = serializers.SerializerMethodField()
    
    class Meta:
        model = Book
        fields = [
            'id', 'title', 'author', 'isbn', 'description', 'category', 'category_name',
            'book_type', 'publication_date', 'publisher', 'pages', 'language',
            'cover_image', 'pdf_file', 'is_available', 'reviews', 'average_rating',
            'reviews_count', 'is_bookmarked', 'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']
    
    def get_average_rating(self, obj):
        reviews = obj.reviews.all()
        if reviews:
            return sum(review.rating for review in reviews) / len(reviews)
        return 0
    
    def get_reviews_count(self, obj):
        return obj.reviews.count()
    
    def get_is_bookmarked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return BookBookmark.objects.filter(book=obj, user=request.user).exists()
        return False

class BookListSerializer(serializers.ModelSerializer):
    """Simplified serializer for book lists"""
    category_name = serializers.CharField(source='category.name', read_only=True)
    average_rating = serializers.SerializerMethodField()
    reviews_count = serializers.SerializerMethodField()
    is_bookmarked = serializers.SerializerMethodField()
    
    class Meta:
        model = Book
        fields = [
            'id', 'title', 'author', 'isbn', 'category', 'category_name',
            'book_type', 'publication_date', 'publisher', 'cover_image',
            'is_available', 'average_rating', 'reviews_count', 'is_bookmarked'
        ]
    
    def get_average_rating(self, obj):
        reviews = obj.reviews.all()
        if reviews:
            return sum(review.rating for review in reviews) / len(reviews)
        return 0
    
    def get_reviews_count(self, obj):
        return obj.reviews.count()
    
    def get_is_bookmarked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return BookBookmark.objects.filter(book=obj, user=request.user).exists()
        return False

class BookBookmarkSerializer(serializers.ModelSerializer):
    book_title = serializers.CharField(source='book.title', read_only=True)
    book_author = serializers.CharField(source='book.author', read_only=True)
    
    class Meta:
        model = BookBookmark
        fields = ['id', 'book', 'book_title', 'book_author', 'created_at']
        read_only_fields = ['user', 'created_at']