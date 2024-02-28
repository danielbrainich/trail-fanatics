from rest_framework import serializers
from .models import Tag, Post, Comment, PostLike, CommentLike
from activities.serializers import TrailSerializer


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ["id", "name"]


class PostSerializer(serializers.ModelSerializer):
    author_username = serializers.CharField(source="author.username", read_only=True)
    author_id = serializers.CharField(source="author.id", read_only=True)
    trail = TrailSerializer(read_only=True)

    class Meta:
        model = Post
        fields = [
            "id",
            "author",
            "author_username",
            "author_id",
            "tags",
            "title",
            "content",
            "image",
            "created_at",
            "updated_at",
            "status",
            "trail",
        ]


class CommentSerializer(serializers.ModelSerializer):
    author_username = serializers.CharField(source="author.username", read_only=True)
    author_id = serializers.CharField(source="author.id", read_only=True)
    post_id = serializers.PrimaryKeyRelatedField(source="post", read_only=True)

    class Meta:
        model = Comment
        fields = [
            "id",
            "author",
            "author_username",
            "author_id",
            "post",
            "post_id",
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
