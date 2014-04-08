from django import forms
from django.forms.widgets import PasswordInput, Textarea

''' Good reading about this:
http://www.pythondiary.com/blog/Apr.11,2012/comparing-django-aspnet-mvc.html
http://stackoverflow.com/questions/4381300/django-forms-list-of-checkboxes-list-of-radiobuttons
https://docs.djangoproject.com/en/dev/ref/forms/widgets/
http://stackoverflow.com/questions/6142025/dynamically-add-field-to-a-form
http://jacobian.org/writing/dynamic-form-generation/ -- this is the most helpful.
http://www.b-list.org/weblog/2008/nov/09/dynamic-forms/
'''

class ContactForm(forms.Form):
    first_name = forms.CharField()
    last_name = forms.CharField()
    password = forms.CharField(widget=PasswordInput)
    confirm_password = forms.CharField(widget=PasswordInput)
    profile = forms.CharField(widget=Textarea(attrs={'cols':'60','rows':'10'}))
    newsletter = forms.BooleanField(label='Receive Newsletter?', required=False)
    def clean_confirm_password(self): # validation method is named clean_<fieldname>; there are basic built-in/implicit ones (like enforce ints)
        # other clean_.. methods have already put their results into self.cleaned_data
        password1 = self.cleaned_data.get("password", "") # in case password1 wasn't provided, then cleaned_data wouldn't have anything for "password"
        password2 = self.cleaned_data["confirm_password"] # this method being called implies that there is something in this field, so this won't be blank
        if password1 != password2:
            raise forms.ValidationError("The two password fields didn't match.") # this is where validation errors come from
        return password2 # here, we have the option of cleaning the data further
        
        
        
class AnotherFormExample(forms.Form):
    first_name = forms.CharField()
    last_name = forms.CharField()
    max_number = forms.ChoiceField(widget = forms.Select(), choices = ([('1','1'), ('2','2'),('3','3'), ]), initial='3', required = True,) 
    def __init__(self, *args, **kwargs):
        extra = kwargs.pop('extra')
        super(AnotherFormExample, self).__init__(*args, **kwargs) # run default initialization
        # process extra elements -- i.e. populate the checkboxes
        l = [str(x) for x in list(extra)]
        print 'extra: ', repr(l)
        self.fields['custom_%s' % 'sections'] = forms.ChoiceField(label='Which sections?', choices=l, widget=forms.widgets.CheckboxInput())
        self.fields['custom_%s' % 'sections_2'] = forms.MultipleChoiceField(label='Multiple',choices=([('1','1'), ('2','5'),('3','3'), ]), widget=forms.CheckboxSelectMultiple())

        # the above is how to do it for the sections form; for courses form, just put a checkbox for each section_id, section_name in extra
    def extra_sections(self): # retrieve sections
        for name, value in self.cleaned_data.items():
            if name.startswith('custom_'):
                yield (self.fields[name].label, value)
                
    def clean_custom_sections_2(self): # an example from http://stackoverflow.com/questions/147752/in-django-is-there-a-way-to-display-choices-as-checkboxes
        if len(self.cleaned_data['custom-sections_2']) > 3:
            raise forms.ValidationError('Select no more than 3.')
        return self.cleaned_data['custom_sections_2']