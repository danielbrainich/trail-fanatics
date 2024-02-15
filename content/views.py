from django.shortcuts import get_object_or_404
from django.http import JsonResponse, HttpResponseBadRequest, HttpResponseNotAllowed
from django.views.decorators.http import require_http_methods
from .models import Tag, Post, Comment, PostLike, CommentLike
from rest_framework.parsers import JSONParser
import json
from .serializers import (
    TagSerializer,
    PostSerializer,
    CommentSerializer,
    PostLikeSerializer,
    CommentLikeSerializer,
)

# Tag views
@require_http_methods(["GET", "POST"])
def tag_list(request):
    if request.method == "GET":
        tags = Tag.objects.all()
        serializer = TagSerializer(tags, many=True)
        return JsonResponse(serializer.data, safe=False)
    elif request.method == "POST":
        serializer = TagSerializer(data=request.POST)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=201)
        return JsonResponse(serializer.errors, status=400)
    else:
        return HttpResponseNotAllowed(["GET", "POST"])

@require_http_methods(["GET", "PUT", "DELETE"])
def tag_detail(request, pk):
    tag = get_object_or_404(Tag, pk=pk)
    if request.method == "GET":
        serializer = TagSerializer(tag)
        return JsonResponse(serializer.data)
    elif request.method == "PUT":
        serializer = TagSerializer(tag, data=request.POST)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data)
        return JsonResponse(serializer.errors, status=400)
    elif request.method == "DELETE":
        tag.delete()
        return JsonResponse({"message": "Tag deleted"}, status=204)
    else:
        return HttpResponseNotAllowed(["GET", "PUT", "DELETE"])

# Post views
@require_http_methods(["GET", "POST"])
def post_list(request):
    if request.method == "GET":
        posts = Post.objects.all()
        serializer = PostSerializer(posts, many=True)
        return JsonResponse(serializer.data, safe=False)
    elif request.method == "POST":
        data = json.loads(request.body)
        serializer = PostSerializer(data=data)
        if serializer.is_valid():
            serializer.save(author=request.user)
            return JsonResponse(serializer.data, status=201)
        return JsonResponse(serializer.errors, status=400)
    else:
        return HttpResponseNotAllowed(["GET", "POST"])

@require_http_methods(["GET", "PUT", "DELETE"])
def post_detail(request, pk):
    post = get_object_or_404(Post, pk=pk)
    if request.method == "GET":
        serializer = PostSerializer(post)
        return JsonResponse(serializer.data)
    elif request.method == "PUT":
        serializer = PostSerializer(post, data=request.POST)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data)
        return JsonResponse(serializer.errors, status=400)
    elif request.method == "DELETE":
        post.delete()
        return JsonResponse({"message": "Post deleted"}, status=204)
    else:
        return HttpResponseNotAllowed(["GET", "PUT", "DELETE"])

# Comment views
@require_http_methods(["GET", "POST"])
def comment_list(request):
    if request.method == "GET":
        comments = Comment.objects.all()
        serializer = CommentSerializer(comments, many=True)
        return JsonResponse(serializer.data, safe=False)
    elif request.method == "POST":
        serializer = CommentSerializer(data=request.POST)
        if serializer.is_valid():
            serializer.save(author=request.user)
            return JsonResponse(serializer.data, status=201)
        return JsonResponse(serializer.errors, status=400)
    else:
        return HttpResponseNotAllowed(["GET", "POST"])

@require_http_methods(["GET", "PUT", "DELETE"])
def comment_detail(request, pk):
    comment = get_object_or_404(Comment, pk=pk)
    if request.method == "GET":
        serializer = CommentSerializer(comment)
        return JsonResponse(serializer.data)
    elif request.method == "PUT":
        serializer = CommentSerializer(comment, data=request.POST)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data)
        return JsonResponse(serializer.errors, status=400)
    elif request.method == "DELETE":
        comment.delete()
        return JsonResponse({"message": "Comment deleted"}, status=204)
    else:
        return HttpResponseNotAllowed(["GET", "PUT", "DELETE"])

# PostLike views
@require_http_methods(["GET", "POST"])
def post_like_list(request):
    if request.method == "GET":
        post_likes = PostLike.objects.all()
        serializer = PostLikeSerializer(post_likes, many=True)
        return JsonResponse(serializer.data, safe=False)
    elif request.method == "POST":
        serializer = PostLikeSerializer(data=request.POST)
        if serializer.is_valid():
            serializer.save(author=request.user)
            return JsonResponse(serializer.data, status=201)
        return JsonResponse(serializer.errors, status=400)
    else:
        return HttpResponseNotAllowed(["GET", "POST"])

@require_http_methods(["GET", "PUT", "DELETE"])
@require_http_methods(["GET", "PUT", "DELETE"])
def post_like_detail(request, pk):
    post_like = get_object_or_404(PostLike, pk=pk)
    if request.method == "GET":
        serializer = PostLikeSerializer(post_like)
        return JsonResponse(serializer.data)
    elif request.method == "PUT":
        serializer = PostLikeSerializer(post_like, data=request.POST)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data)
        return JsonResponse(serializer.errors, status=400)
    elif request.method == "DELETE":
        post_like.delete()
        return JsonResponse({"message": "PostLike deleted"}, status=204)
    else:
        return HttpResponseNotAllowed(["GET", "PUT", "DELETE"])

# CommentLike views
@require_http_methods(["GET", "POST"])
def comment_like_list(request):
    if request.method == "GET":
        comment_likes = CommentLike.objects.all()
        serializer = CommentLikeSerializer(comment_likes, many=True)
        return JsonResponse(serializer.data, safe=False)
    elif request.method == "POST":
        serializer = CommentLikeSerializer(data=request.POST)
        if serializer.is_valid():
            serializer.save(author=request.user)
            return JsonResponse(serializer.data, status=201)
        return JsonResponse(serializer.errors, status=400)
    else:
        return HttpResponseNotAllowed(["GET", "POST"])

@require_http_methods(["GET", "PUT", "DELETE"])
def comment_like_detail(request, pk):
    comment_like = get_object_or_404(CommentLike, pk=pk)
    if request.method == "GET":
        serializer = CommentLikeSerializer(comment_like)
        return JsonResponse(serializer.data)
    elif request.method == "PUT":
        serializer = CommentLikeSerializer(comment_like, data=request.POST)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data)
        return JsonResponse(serializer.errors, status=400)
    elif request.method == "DELETE":
        comment_like.delete()
        return JsonResponse({"message": "CommentLike deleted"}, status=204)
    else:
        return HttpResponseNotAllowed(["GET", "PUT", "DELETE"])
