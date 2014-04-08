from django import forms
from django.forms.widgets import PasswordInput, Textarea

class ContactForm(forms.Form):
	first_name = forms.CharField()
	last_name = forms.CharField()
	password = forms.CharField(widget=PasswordInput)
	confirm_password = forms.CharField(widget=PasswordInput)
	profile = forms.CharField(widget=Textarea(attrs={'cols':'60','rows':'10'}))
	newsletter = forms.BooleanField(label='Receive Newsletter?', required=False)
	def clean_confirm_password(self):
		password1 = self.cleaned_data.get("password", "")
		password2 = self.cleaned_data["confirm_password"]
		if password1 != password2:
			raise forms.ValidationError("The two password fields didn't match.")
		return password2