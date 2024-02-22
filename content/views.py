from django.shortcuts import get_object_or_404
from rest_framework import status
from django.http import (JsonResponse, HttpResponseNotAllowed, HttpResponse)
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.views.decorators.http import require_http_methods
from .models import Tag, Post, Comment, PostLike, CommentLike
from rest_framework.permissions import IsAuthenticated
import json
from .serializers import (TagSerializer, PostSerializer, CommentSerializer, PostLikeSerializer, CommentLikeSerializer)


# Tag views
@api_view(["GET"])
def tag_list(request):
    if request.method == "GET":
        tags = Tag.objects.all()
        serializer = TagSerializer(tags, many=True)
        return Response(serializer.data)

# Post views
@api_view(["GET", "POST"])
def post_list(request):
    if request.method == "GET":
        posts = Post.objects.all()
        serializer = PostSerializer(posts, many=True)
        return Response(serializer.data)

    elif request.method == "POST":
        if not request.user.is_authenticated:
            return Response({"detail": "Authentication credentials were not provided."}, status=status.HTTP_401_UNAUTHORIZED)

        serializer = PostSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(author=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET", "PUT", "DELETE"])
def post_detail(request, pk):
    post = get_object_or_404(Post, pk=pk)

    if request.method == "GET":
        serializer = PostSerializer(post)
        likeCount = PostLike.objects.filter(post=post).count()
        data = serializer.data
        data['likeCount'] = likeCount
        return Response(data)

    if not request.user.is_authenticated:
        return Response({"detail": "Authentication credentials were not provided."}, status=status.HTTP_401_UNAUTHORIZED)

    if request.user != post.author:
        return Response({"detail": "You do not have permission to modify this post."}, status=status.HTTP_403_FORBIDDEN)

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
        serializer = CommentSerializer(comments, many=True)
        return Response(serializer.data)

    elif request.method == "POST":
        if not request.user.is_authenticated:
            return Response({"detail": "Authentication credentials were not provided."}, status=status.HTTP_401_UNAUTHORIZED)

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
        data['like_count'] = like_count
        return Response(data)

    if not request.user.is_authenticated:
        return Response({"detail": "Authentication credentials were not provided."}, status=status.HTTP_401_UNAUTHORIZED)

    if request.method == "PUT":
        if request.user != comment.author:
            return Response({"detail": "You do not have permission to edit this comment."}, status=status.HTTP_403_FORBIDDEN)

        serializer = CommentSerializer(comment, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    if request.method == "DELETE":
        if request.user != comment.author:
            return Response({"detail": "You do not have permission to delete this comment."}, status=status.HTTP_403_FORBIDDEN)

        comment.delete()
        return Response({"message": "Comment deleted"}, status=status.HTTP_204_NO_CONTENT)


# PostLike views
@require_http_methods(["GET"])
def check_like(request, post_pk):
    if not request.user.is_authenticated:
        return HttpResponse(status=401)
    like = PostLike.objects.filter(post_id=post_pk, author=request.user).first()

    if like:
        return JsonResponse({"liked": True, "likeId": like.pk})
    else:
        return JsonResponse({"liked": False, "likeId": None})

@require_http_methods(["GET", "POST"])
def post_like_list(request, post_pk):
    if request.method == "GET":
        post_likes = PostLike.objects.filter(post_id=post_pk)
        serializer = PostLikeSerializer(post_likes, many=True)
        return JsonResponse(serializer.data, safe=False)
    elif request.method == "POST":
        if not request.user.is_authenticated:
            return HttpResponse(status=401)
        existing_like = PostLike.objects.filter(post_id=post_pk, author=request.user).first()
        if existing_like:
            return JsonResponse({"message": "Like already exists"}, status=200)
        like = PostLike.objects.create(post_id=post_pk, author=request.user)
        serializer = PostLikeSerializer(like)
        return JsonResponse(serializer.data, status=201)


@require_http_methods(["DELETE"])
def post_like_detail(request, post_pk, pk):
    if not request.user.is_authenticated:
        return HttpResponse(status=401)
    try:
        post_like = PostLike.objects.get(pk=pk, post_id=post_pk, author=request.user)
    except PostLike.DoesNotExist:
        return HttpResponse(status=404)
    post_like.delete()
    return JsonResponse({"message": "Like removed"}, status=204)


# CommentLike views
@require_http_methods(["GET"])
def check_comment_like(request, post_pk, comment_pk):
    if not request.user.is_authenticated:
        return HttpResponse(status=401)
    like = CommentLike.objects.filter(comment_id=comment_pk, author=request.user).first()

    if like:
        return JsonResponse({"liked": True, "likeId": like.pk})
    else:
        return JsonResponse({"liked": False, "likeId": None})


@require_http_methods(["GET", "POST"])
def comment_like_list(request, post_pk, comment_pk):
    if request.method == "GET":
        comment_likes = CommentLike.objects.filter(comment_id=comment_pk)
        serializer = CommentLikeSerializer(comment_likes, many=True)
        return JsonResponse(serializer.data, safe=False)
    elif request.method == "POST":
        if not request.user.is_authenticated:
            return HttpResponse(status=401)
        existing_like = CommentLike.objects.filter(comment_id=comment_pk, author=request.user).first()
        if existing_like:
            return JsonResponse({"message": "Like already exists"}, status=200)
        comment = get_object_or_404(Comment, pk=comment_pk)
        like = CommentLike.objects.create(comment=comment, author=request.user)
        serializer = CommentLikeSerializer(like)
        return JsonResponse(serializer.data, status=201)


@require_http_methods(["DELETE"])
def comment_like_detail(request, post_pk, comment_pk, pk):
    if not request.user.is_authenticated:
        return HttpResponse(status=401)
    try:
        comment_like = CommentLike.objects.get(pk=pk, comment_id=comment_pk, author=request.user)
    except CommentLike.DoesNotExist:
        return HttpResponse(status=404)
    comment_like.delete()
    return JsonResponse({"message": "Like removed"}, status=204)
