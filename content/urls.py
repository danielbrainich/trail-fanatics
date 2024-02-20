from django.urls import path
from .views import (
    tag_list,
    tag_detail,
    post_list,
    post_detail,
    comment_list,
    comment_detail,
    post_like_list,
    post_like_detail,
    comment_like_list,
    comment_like_detail,
    check_like,
    check_comment_like,
)

urlpatterns = [
    # Tag URLs
    path("tags/", tag_list, name="tag_list"),
    path("tags/<int:pk>/", tag_detail, name="tag_detail"),
    # Post URLs
    path("posts/", post_list, name="post_list"),
    path("posts/<int:pk>/", post_detail, name="post_detail"),
    # Comment URLs
    path("posts/<int:post_pk>/comments/", comment_list, name="comment_list"),
    path(
        "posts/<int:post_pk>/comments/<int:pk>/", comment_detail, name="comment_detail"
    ),
    # PostLike URLs
    path("posts/<int:post_pk>/post-likes/", post_like_list, name="post_like_list"),
    path(
        "posts/<int:post_pk>/post-likes/<int:pk>/",
        post_like_detail,
        name="post_like_detail",
    ),
    path('posts/<int:post_pk>/check-like/', check_like, name='check_like'),

    # CommentLike URLs
    path("posts/<int:post_pk>/comments/<int:comment_pk>/comment-likes/", comment_like_list, name="comment_like_list"),
    path("posts/<int:post_pk>/comments/<int:comment_pk>/comment-likes/<int:pk>/", comment_like_detail, name="comment_like_detail"),
    path("posts/<int:post_pk>/comments/<int:comment_pk>/check-comment-like/", check_comment_like, name="check_comment_like"),
]
