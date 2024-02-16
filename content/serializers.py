from rest_framework import serializers
from .models import Tag, Post, Comment, PostLike, CommentLike


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ["id", "name"]


class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = [
            "id",
            "author",
            "tags",
            "title",
            "content",
            "image",
            "created_at",
            "updated_at",
            "status",
        ]


class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = [
            "id",
            "author",
            "post",
            "content",
            "image",
            "created_at",
            "updated_at",
        ]


class PostLikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = PostLike
        fields = ["id", "author", "post", "created_at"]


class CommentLikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = CommentLike
        fields = ["id", "author", "comment", "created_at"]
