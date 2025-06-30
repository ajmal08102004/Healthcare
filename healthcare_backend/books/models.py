from django.db import models
from django.conf import settings

class BookCategory(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name_plural = "Book Categories"
        ordering = ['name']

class Book(models.Model):
    BOOK_TYPES = (
        ('educational', 'Educational'),
        ('reference', 'Reference'),
        ('research', 'Research'),
        ('guide', 'Guide'),
        ('manual', 'Manual'),
    )
    
    title = models.CharField(max_length=200)
    author = models.CharField(max_length=100)
    isbn = models.CharField(max_length=13, unique=True, blank=True, null=True)
    description = models.TextField()
    category = models.ForeignKey(BookCategory, on_delete=models.CASCADE, related_name='books')
    book_type = models.CharField(max_length=20, choices=BOOK_TYPES, default='educational')
    publication_date = models.DateField(blank=True, null=True)
    publisher = models.CharField(max_length=100, blank=True, null=True)
    pages = models.PositiveIntegerField(blank=True, null=True)
    language = models.CharField(max_length=50, default='English')
    cover_image = models.ImageField(upload_to='book_covers/', blank=True, null=True)
    pdf_file = models.FileField(upload_to='book_pdfs/', blank=True, null=True)
    is_available = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.title} by {self.author}"
    
    class Meta:
        ordering = ['title']

class BookReview(models.Model):
    RATING_CHOICES = (
        (1, '1 - Poor'),
        (2, '2 - Fair'),
        (3, '3 - Good'),
        (4, '4 - Very Good'),
        (5, '5 - Excellent'),
    )
    
    book = models.ForeignKey(Book, on_delete=models.CASCADE, related_name='reviews')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='book_reviews')
    rating = models.PositiveSmallIntegerField(choices=RATING_CHOICES)
    review_text = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Review for {self.book.title} by {self.user.username}"
    
    class Meta:
        unique_together = ['book', 'user']
        ordering = ['-created_at']

class BookBookmark(models.Model):
    book = models.ForeignKey(Book, on_delete=models.CASCADE, related_name='bookmarks')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='bookmarked_books')
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.user.username} bookmarked {self.book.title}"
    
    class Meta:
        unique_together = ['book', 'user']
        ordering = ['-created_at']
