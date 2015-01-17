# retrieved from: https://gist.github.com/zyegfryed/918403
# used for creating pdf files to be served using django

# -*- coding: utf-8 -*-
import codecs
import subprocess
from fdfgen import forge_fdf

from django.template import Template, loader
from django.template.loader import find_template, LoaderOrigin


class PdfTemplateError(Exception):
    pass


class PdfTemplate(Template):

    def __init__(self, template_string, origin=None, name='<Unknown Template>'):
        self.origin = origin

    def render(self, context):
        context = context.items()
        output, err = self.fill_form(context, self.origin.name)
        if err:
            raise PdfTemplateError(err)
        return output
    
    def fill_form(self, fields, src, pdftk_bin=None):
        if pdftk_bin is None:
            from django.conf import settings
            assert hasattr(settings, 'PDFTK_BIN'), "PDF generation requires pdftk (http://www.pdflabs.com/tools/pdftk-the-pdf-toolkit/). Edit your PDFTK_BIN settings accordingly."
            pdftk_bin = settings.PDFTK_BIN

        fdf_stream = forge_fdf(fdf_data_strings=fields)

        cmd = [
            pdftk_bin,
            src,
            'fill_form',
            '-',
            'output',
            '-',
            'flatten',
        ]
        cmd = ' '.join(cmd)

        try:
            process = subprocess.Popen(cmd, stdin=subprocess.PIPE,
                                       stdout=subprocess.PIPE, shell=True)
            return process.communicate(input=fdf_stream)
        except OSError:
            return None


def get_template_from_string(source, origin=None, name=None):
    """
    Returns a compiled Template object for the given template code,
    handling template inheritance recursively.
    """
    if name and name.endswith('.pdf'):
        return PdfTemplate('pdf', origin, name)
    return Template(source, origin, name)
loader.get_template_from_string = get_template_from_string


def make_origin(display_name, loader, name, dirs):
    # Always return an Origin object, because PDFTemplate need it to render
    # the PDF Form file.
    return LoaderOrigin(display_name, loader, name, dirs)
loader.make_origin = make_origin


def get_template(template_name):
    """
    Returns a compiled Template object for the given template name,
    handling template inheritance recursively.
    """

    def strict_errors(exception):
        raise exception

    def fake_strict_errors(exception):
        return (u'', -1)

    # Loading hacks
    # Ignore UnicodeError, due to PDF file read
    codecs.register_error('strict', fake_strict_errors)
    # --//--
    template, origin = find_template(template_name)
    # Loading hacks
    codecs.register_error('strict', strict_errors)
    # --//--
    return template
