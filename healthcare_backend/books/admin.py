from django.contrib import admin
from .models import BookCategory, Book, BookReview, BookBookmark

@admin.register(BookCategory)
class BookCategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'description', 'created_at']
    search_fields = ['name', 'description']
    ordering = ['name']

@admin.register(Book)
class BookAdmin(admin.ModelAdmin):
    list_display = ['title', 'author', 'category', 'book_type', 'is_available', 'created_at']
    list_filter = ['category', 'book_type', 'is_available', 'language']
    search_fields = ['title', 'author', 'isbn', 'description']
    ordering = ['title']
    readonly_fields = ['created_at', 'updated_at']

@admin.register(BookReview)
class BookReviewAdmin(admin.ModelAdmin):
    list_display = ['book', 'user', 'rating', 'created_at']
    list_filter = ['rating', 'created_at']
    search_fields = ['book__title', 'user__username', 'review_text']
    ordering = ['-created_at']
    readonly_fields = ['created_at', 'updated_at']

@admin.register(BookBookmark)
class BookBookmarkAdmin(admin.ModelAdmin):
    list_display = ['book', 'user', 'created_at']
    list_filter = ['created_at']
    search_fields = ['book__title', 'user__username']
    ordering = ['-created_at']
    readonly_fields = ['created_at']
