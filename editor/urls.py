# markdown_editor_app/urls.py
from django.urls import path
from .views import markdown_editor

urlpatterns = [
	path('editor/', markdown_editor, name='editor'),
]
