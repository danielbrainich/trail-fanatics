from django.db import models
from django.conf import settings


class Tag(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name


class Post(models.Model):
    STATUS_CHOICES = (
        ("public", "Public"),
        ("archived", "Archived"),
    )
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name="posts",
        on_delete=models.CASCADE,
        null=True,
    )
    tags = models.ManyToManyField(Tag, related_name="posts", blank=True)
    title = models.CharField(max_length=100)
    content = models.CharField(max_length=280)
    image = models.ImageField(upload_to="post_images/", null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default="public")

    def __str__(self):
        return (
            f"Post by {self.author.username} at {self.created_at.strftime('%Y-%m-%d')}"
        )

    class Meta:
        ordering = ["-created_at"]


class Comment(models.Model):
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name="comments",
        on_delete=models.CASCADE,
        null=True,
    )
    post = models.ForeignKey(
        Post,
        related_name="comments",
        on_delete=models.CASCADE,
    )
    content = models.CharField(max_length=280)
    image = models.ImageField(upload_to="comment_images/", null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Comment by {self.author.username} at {self.created_at.strftime('%Y-%m-%d')}"

    class Meta:
        ordering = ["-created_at"]


class PostLike(models.Model):
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name="post_likes",
        on_delete=models.SET_NULL,
        null=True,
    )
    post = models.ForeignKey(
        Post,
        related_name="post_likes",
        on_delete=models.CASCADE,
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Post like by {self.author.username} at {self.created_at.strftime('%Y-%m-%d')}"

    class Meta:
        ordering = ["-created_at"]


class CommentLike(models.Model):
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name="comment_likes",
        on_delete=models.SET_NULL,
        null=True,
    )
    comment = models.ForeignKey(
        Comment,
        related_name="comment_likes",
        on_delete=models.CASCADE,
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Comment like by {self.author.username} at {self.created_at.strftime('%Y-%m-%d')}"

    class Meta:
        ordering = ["-created_at"]
