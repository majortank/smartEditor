from django.shortcuts import render

# markdown_editor_app/views.py
from django.shortcuts import render
from .forms import Edit_Doc_Form
import markdown

def markdown_editor(request):
	if request.method == 'POST':
		form = Edit_Doc_Form(request.POST)
		if form.is_valid():
			title = form.cleaned_data['title']
			content = form.cleaned_data['content']
			html_content = markdown.markdown(content)
			return render(request, 'editor/preview.html', {'title': title, 'html_content': html_content})
	else:
		form = Edit_Doc_Form()

	return render(request, 'editor/editor.html', {'form': form})
