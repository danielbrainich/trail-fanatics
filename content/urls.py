from django.urls import path
from .views import (
    tag_list,
    tag_detail,
    post_list,
    post_detail,
    comment_list,
    comment_detail,
    post_like_list,
    comment_like_list,
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
    path("posts/<int:post_pk>/comments/<int:pk>/", comment_detail, name="comment_detail"),

    # PostLike URLs
    path("post-likes/", post_like_list, name="post_like_list"),

    # CommentLike URLs
    path("comment-likes/", comment_like_list, name="comment_like_list"),
]
