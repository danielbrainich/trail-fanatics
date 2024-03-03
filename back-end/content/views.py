from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import Tag, Post, Comment, PostLike, CommentLike
from rest_framework.pagination import PageNumberPagination
from django.db import transaction
from .serializers import (
    TagSerializer,
    PostSerializer,
    CommentSerializer,
    PostLikeSerializer,
    CommentLikeSerializer,
)
from trails.serializers import TrailSerializer


class PostPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = "page_size"
    max_page_size = 100

    def get_paginated_response(self, data):
        return Response(
            {
                "links": {
                    "next": self.get_next_link(),
                    "previous": self.get_previous_link(),
                },
                "total": self.page.paginator.count,
                "page_size": self.page_size,
                "current_page": self.page.number,
                "total_pages": self.page.paginator.num_pages,
                "results": data,
            }
        )


# Tag views
@api_view(["GET"])
def tag_list(request):
    if request.method == "GET":
        tags = Tag.objects.all()
        serializer = TagSerializer(tags, many=True)
        return Response(serializer.data)


# Post views
@api_view(["GET", "POST"])
@transaction.atomic
def post_list(request):
    if request.method == "GET":
        posts = Post.objects.all()
        paginator = PostPagination()
        page = paginator.paginate_queryset(posts, request)
        if page is not None:
            serializer = PostSerializer(page, many=True)
            return paginator.get_paginated_response(serializer.data)
        serializer = PostSerializer(posts, many=True)
        return Response(serializer.data)

    elif request.method == "POST":
        if not request.user.is_authenticated:
            return Response(
                {"detail": "Authentication credentials were not provided."},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        trail_data = request.data.get("trail")
        trail_instance = None
        if trail_data:
            trail_serializer = TrailSerializer(data=trail_data)
            if trail_serializer.is_valid():
                trail_instance = trail_serializer.save(creator=request.user)
            else:
                return Response(
                    trail_serializer.errors, status=status.HTTP_400_BAD_REQUEST
                )

        post_data = request.data.get("post")
        if post_data:
            post_serializer = PostSerializer(data=post_data)
            if post_serializer.is_valid():
                post = post_serializer.save(
                    author=request.user,
                    trail=trail_instance if trail_instance else None,
                )
                response = Response(post_serializer.data, status=status.HTTP_201_CREATED)
                response["Access-Control-Allow-Credentials"] = "true"
                return response
            else:
                return Response(
                    post_serializer.errors, status=status.HTTP_400_BAD_REQUEST
                )
        else:
            return Response(
                {"detail": "No post data provided."}, status=status.HTTP_400_BAD_REQUEST
            )


@api_view(["GET", "PUT", "DELETE"])
def post_detail(request, pk):
    post = get_object_or_404(Post, pk=pk)

    if request.method == "GET":
        serializer = PostSerializer(post)
        likeCount = PostLike.objects.filter(post=post).count()
        data = serializer.data
        data["likeCount"] = likeCount
        return Response(data)

    if not request.user.is_authenticated:
        return Response(
            {"detail": "Authentication credentials were not provided."},
            status=status.HTTP_401_UNAUTHORIZED,
        )

    if request.user != post.author:
        return Response(
            {"detail": "You do not have permission to modify this post."},
            status=status.HTTP_403_FORBIDDEN,
        )

    if request.method == "PUT":
        serializer = PostSerializer(post, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    if request.method == "DELETE":
        post.delete()
        return Response({"message": "Post deleted"}, status=status.HTTP_204_NO_CONTENT)


# Comment views
@api_view(["GET", "POST"])
def comment_list(request, post_pk):
    get_object_or_404(Post, pk=post_pk)

    if request.method == "GET":
        comments = Comment.objects.filter(post=post_pk)
        paginator = PostPagination()
        page = paginator.paginate_queryset(comments, request)

        if page is not None:
            serializer = CommentSerializer(page, many=True)
            return paginator.get_paginated_response(serializer.data)

        serializer = CommentSerializer(comments, many=True)
        return Response(serializer.data)

    elif request.method == "POST":
        if not request.user.is_authenticated:
            return Response(
                {"detail": "Authentication credentials were not provided."},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        data = request.data
        data["post"] = post_pk
        serializer = CommentSerializer(data=data)
        if serializer.is_valid():
            serializer.save(author=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET", "PUT", "DELETE"])
def comment_detail(request, post_pk, pk):
    comment = get_object_or_404(Comment, pk=pk, post_id=post_pk)

    if request.method == "GET":
        like_count = CommentLike.objects.filter(comment=comment).count()
        data = CommentSerializer(comment).data
        data["like_count"] = like_count
        return Response(data)

    if not request.user.is_authenticated:
        return Response(
            {"detail": "Authentication credentials were not provided."},
            status=status.HTTP_401_UNAUTHORIZED,
        )

    if request.method == "PUT":
        if request.user != comment.author:
            return Response(
                {"detail": "You do not have permission to edit this comment."},
                status=status.HTTP_403_FORBIDDEN,
            )

        serializer = CommentSerializer(comment, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    if request.method == "DELETE":
        if request.user != comment.author:
            return Response(
                {"detail": "You do not have permission to delete this comment."},
                status=status.HTTP_403_FORBIDDEN,
            )

        comment.delete()
        return Response(
            {"message": "Comment deleted"}, status=status.HTTP_204_NO_CONTENT
        )


# PostLike views
@api_view(["GET"])
def check_like(request, post_pk):
    if not request.user.is_authenticated:
        return Response(
            {"detail": "Authentication credentials were not provided."},
            status=status.HTTP_401_UNAUTHORIZED,
        )

    like = PostLike.objects.filter(post_id=post_pk, author=request.user).first()

    if like:
        return Response({"liked": True, "likeId": like.pk})
    else:
        return Response({"liked": False, "likeId": None})


@api_view(["GET", "POST"])
def post_like_list(request, post_pk):
    if request.method == "GET":
        post_likes = PostLike.objects.filter(post_id=post_pk)
        serializer = PostLikeSerializer(post_likes, many=True)
        return Response(serializer.data)

    elif request.method == "POST":
        if not request.user.is_authenticated:
            return Response(
                {"detail": "Authentication credentials were not provided."},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        existing_like = PostLike.objects.filter(
            post_id=post_pk, author=request.user
        ).first()
        if existing_like:
            return Response(
                {"message": "Like already exists"}, status=status.HTTP_200_OK
            )

        like = PostLike.objects.create(post_id=post_pk, author=request.user)
        serializer = PostLikeSerializer(like)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


@api_view(["DELETE"])
def post_like_detail(request, post_pk, pk):
    if not request.user.is_authenticated:
        return Response(
            {"detail": "Authentication credentials were not provided."},
            status=status.HTTP_401_UNAUTHORIZED,
        )

    post_like = get_object_or_404(PostLike, pk=pk, post_id=post_pk, author=request.user)

    post_like.delete()

    return Response({"message": "Like removed"}, status=status.HTTP_204_NO_CONTENT)


# CommentLike views
@api_view(["GET"])
def check_comment_like(request, post_pk, comment_pk):
    if not request.user.is_authenticated:
        return Response(
            {"detail": "Authentication credentials were not provided."},
            status=status.HTTP_401_UNAUTHORIZED,
        )

    like = CommentLike.objects.filter(
        comment_id=comment_pk, author=request.user
    ).first()

    return Response({"liked": like is not None, "likeId": like.pk if like else None})


@api_view(["GET", "POST"])
def comment_like_list(request, post_pk, comment_pk):
    if request.method == "GET":
        comment_likes = CommentLike.objects.filter(comment_id=comment_pk)
        serializer = CommentLikeSerializer(comment_likes, many=True)
        return Response(serializer.data)

    elif request.method == "POST":
        if not request.user.is_authenticated:
            return Response(
                {"detail": "Authentication credentials were not provided."},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        existing_like = CommentLike.objects.filter(
            comment_id=comment_pk, author=request.user
        ).exists()
        if existing_like:
            return Response(
                {"message": "Like already exists"}, status=status.HTTP_200_OK
            )

        comment = get_object_or_404(Comment, pk=comment_pk)

        like = CommentLike.objects.create(comment=comment, author=request.user)
        serializer = CommentLikeSerializer(like)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


@api_view(["DELETE"])
def comment_like_detail(request, post_pk, comment_pk, pk):
    if not request.user.is_authenticated:
        return Response(
            {"detail": "Authentication credentials were not provided."},
            status=status.HTTP_401_UNAUTHORIZED,
        )

    try:
        comment_like = CommentLike.objects.get(
            pk=pk, comment_id=comment_pk, author=request.user
        )
    except CommentLike.DoesNotExist:
        return Response(
            {"detail": "Comment like not found."}, status=status.HTTP_404_NOT_FOUND
        )

    comment_like.delete()

    return Response(
        {"message": "Comment like removed."}, status=status.HTTP_204_NO_CONTENT
    )
