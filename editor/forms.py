# markdown_editor_app/forms.py
from django import forms

class Edit_Doc_Form(forms.Form):
	title = forms.CharField(max_length=255)
	content = forms.CharField(widget=forms.Textarea)
