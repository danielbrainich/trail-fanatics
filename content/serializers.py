from rest_framework import serializers
from .models import Tag, Post, Comment, PostLike, CommentLike


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ["id", "name"]


class PostSerializer(serializers.ModelSerializer):

    author_username = serializers.CharField(source='author.profile.user.username', read_only=True)

    class Meta:
        model = Post
        fields = [
            "id",
            "author",
            "author_username",
            "tags",
            "title",
            "content",
            "image",
            "created_at",
            "updated_at",
            "status",
        ]


class CommentSerializer(serializers.ModelSerializer):

    author_username = serializers.CharField(source='author.profile.user.username', read_only=True)

    class Meta:
        model = Comment
        fields = [
            "id",
            "author",
            "author_username",
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
