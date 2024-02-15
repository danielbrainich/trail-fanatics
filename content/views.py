from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from .models import Tag, Post, Comment, PostLike, CommentLike

# Tag views
def tag_list(request):
    tags = Tag.objects.all()
    # Serialize tags and return JSON response
    return JsonResponse([...], safe=False)

def tag_detail(request, pk):
    tag = get_object_or_404(Tag, pk=pk)
    # Serialize tag and return JSON response
    return JsonResponse({...})

# Post views
def post_list(request):
    posts = Post.objects.all()
    # Serialize posts and return JSON response
    return JsonResponse([...], safe=False)

def post_detail(request, pk):
    post = get_object_or_404(Post, pk=pk)
    # Serialize post and return JSON response
    return JsonResponse({...})

# Comment views
def comment_list(request):
    comments = Comment.objects.all()
    # Serialize comments and return JSON response
    return JsonResponse([...], safe=False)

def comment_detail(request, pk):
    comment = get_object_or_404(Comment, pk=pk)
    # Serialize comment and return JSON response
    return JsonResponse({...})

# PostLike views
def post_like_list(request):
    post_likes = PostLike.objects.all()
    # Serialize post likes and return JSON response
    return JsonResponse([...], safe=False)

# CommentLike views
def comment_like_list(request):
    comment_likes = CommentLike.objects.all()
    # Serialize comment likes and return JSON response
    return JsonResponse([...], safe=False)
