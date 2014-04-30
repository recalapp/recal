from django import forms
from django.forms.widgets import PasswordInput, Textarea
import re

class EnrollCoursesForm(forms.Form):
    """
    Lets user enroll in courses and edit their name. They must enroll in at least one class to see their dashboard.
    
    """
    first_name = forms.CharField(required=False)
    last_name = forms.CharField(required=False)
    
    def __init__(self, *args, **kwargs):
        # See http://jacobian.org/writing/dynamic-form-generation/ for kwargs method description
        extra, initial_first, initial_last = kwargs.pop('extra'), kwargs.pop('initial_first'), kwargs.pop('initial_last') 
        
        # Run default initialization, but don't pass in our extra params (that's why we popped above)
        super(EnrollCoursesForm, self).__init__(*args, **kwargs) 
        
        # Process extra elements -- i.e. populate the checkboxes
        for (i, course, isEnrolled) in extra:
            self.fields['custom_%s' % i] = forms.BooleanField(label=course, initial=isEnrolled, required=False)
        
        # Fill in initial first and last names
        self.fields['first_name'].initial = initial_first
        self.fields['last_name'].initial = initial_last
    def extra_courses(self): # retrieve courses
        for name, value in self.cleaned_data.items():
            prefix = 'custom_'
            if name.startswith(prefix):
                yield (int(name[len(prefix):]), self.fields[name].label, value) # course ID, course name, and whether the checkbox is checked
    
class ChooseSectionsForm(forms.Form):
    """
    Lets user choose sections they're in among their classes. 
    
    """
    
    def __init__(self, *args, **kwargs):
        # See http://jacobian.org/writing/dynamic-form-generation/ for kwargs method description
        extra = kwargs.pop('extra')
        
        # Run default initialization, but don't pass in our extra params (that's why we popped above)
        super(ChooseSectionsForm, self).__init__(*args, **kwargs) 
        
        # Process extra elements -- i.e. populate the checkboxes
        for (i, course, secList) in extra:
            for (j, section, isEnrolled) in secList:
                self.fields['custom_%s_%s' % (i,j)] = forms.BooleanField(label=section, initial=isEnrolled, required=False)
        
    def extra_sections(self): # retrieve sections
        for name, value in self.cleaned_data.items():
            prefix = 'custom_'
            if name.startswith(prefix):
                c_s_ids = name[len(prefix):] # this removes the "custom_" prefix
                m = re.match(r'(\d)_(\d)', c_s_ids)
                if m: # if matched successfully
                    c_id, s_id = m.groups()
                    yield (int(s_id), int(c_id), value) # section ID, course ID, and whether the checkbox is checked
    



''' Good reading about this:
http://www.pythondiary.com/blog/Apr.11,2012/comparing-django-aspnet-mvc.html
http://stackoverflow.com/questions/4381300/django-forms-list-of-checkboxes-list-of-radiobuttons
https://docs.djangoproject.com/en/dev/ref/forms/widgets/
http://stackoverflow.com/questions/6142025/dynamically-add-field-to-a-form
 -- this is the most helpful.
http://www.b-list.org/weblog/2008/nov/09/dynamic-forms/
'''

# Below are old, unused example forms.

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
