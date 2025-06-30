from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    BookCategoryViewSet, BookViewSet, BookReviewViewSet, BookBookmarkViewSet
)

router = DefaultRouter()
router.register(r'categories', BookCategoryViewSet, basename='book-categories')
router.register(r'books', BookViewSet, basename='books')
router.register(r'reviews', BookReviewViewSet, basename='book-reviews')
router.register(r'bookmarks', BookBookmarkViewSet, basename='book-bookmarks')

urlpatterns = [
    path('', include(router.urls)),
]