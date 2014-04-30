# -*- coding: utf-8 -*-

from django import forms
from django.conf import settings
from django.utils.safestring import mark_safe

COLORFIELD_HTML_WIDGET = u"""
<script type="text/javascript">(function($){
$(function(){
    var preview = $('<div class="color-picker-preview"><div style="background-color:#%(color)s"></div></div>').insertAfter('#id_%(name)s');
    $('#id_%(name)s').ColorPicker({
        color: '%(color)s',
        onSubmit: function(hsb, hex, rgb, el) { $(el).val(hex); $(el).ColorPickerHide();$(preview).find('div').css('backgroundColor', '#' + hex); },
        onBeforeShow: function () { $(this).ColorPickerSetColor(this.value); },
    }).bind('keyup', function(){ $(this).ColorPickerSetColor(this.value); });
});})(django.jQuery);</script>
"""

class ColorPickerWidget(forms.TextInput):
    """
    A model field widget which implements Stefan Petre's jQuery color picker:
    http://www.eyecon.ro/colorpicker/
    """
    class Media:
        css = {
            'all': (settings.STATIC_URL + 'colorfield/css/colorpicker.css',)
        }
        js = (settings.STATIC_URL + 'colorfield/js/colorpicker.js', )

    def __init__(self, language=None, attrs=None):
        self.language = language or settings.LANGUAGE_CODE[:2]
        super(ColorPickerWidget, self).__init__(attrs=attrs)

    def render(self, name, value, attrs=None):
        rendered = super(ColorPickerWidget, self).render(name, value, attrs)
        return rendered + mark_safe(COLORFIELD_HTML_WIDGET % {
                            'color': value, 'name': name})
