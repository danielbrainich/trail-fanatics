from django.contrib import admin
from .models import Tag, Post, Comment, PostLike, CommentLike


admin.site.register(Tag)
admin.site.register(Post)
admin.site.register(Comment)
admin.site.register(PostLike)
admin.site.register(CommentLike)
