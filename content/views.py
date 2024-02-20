from django.shortcuts import get_object_or_404
from django.http import (
    JsonResponse,
    HttpResponseBadRequest,
    HttpResponseNotAllowed,
    HttpResponse,
)
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
        if not request.user.is_authenticated:
            return HttpResponse(status=401)
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
        likeCount = PostLike.objects.filter(post=post).count()
        data = serializer.data
        data['likeCount'] = likeCount
        return JsonResponse(data)
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
def comment_list(request, post_pk):
    if request.method == "GET":
        comments = Comment.objects.all()
        serializer = CommentSerializer(comments, many=True)
        return JsonResponse(serializer.data, safe=False)
    elif request.method == "POST":
        if not request.user.is_authenticated:
            return HttpResponse(status=401)
        data = json.loads(request.body)
        data["post"] = post_pk
        serializer = CommentSerializer(data=data)
        if serializer.is_valid():
            serializer.save(author=request.user)
            return JsonResponse(serializer.data, status=201)
        return JsonResponse(serializer.errors, status=400)
    else:
        return HttpResponseNotAllowed(["GET", "POST"])


@require_http_methods(["GET", "PUT", "DELETE"])
def comment_detail(request, post_pk, pk):
    comment = get_object_or_404(Comment, pk=pk)
    if request.method == "GET":
        serializer = CommentSerializer(comment)
        like_count = CommentLike.objects.filter(comment=comment).count()
        data = serializer.data
        data['like_count'] = like_count
        return JsonResponse(data)
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
