# retrieved from: https://gist.github.com/zyegfryed/918403, https://gist.github.com/grantmcconnaughey/ce90a689050c07c61c96
# used for creating pdf files to be served using django

# -*- coding: utf-8 -*-
import codecs
import subprocess
from fdfgen import forge_fdf
from django.core.exceptions import ImproperlyConfigured
from django.template import engines
from django.template.backends.base import BaseEngine
from django.template.engine import Engine, _dirs_undefined


class PdfTemplateError(Exception):
    pass


class PdftkEngine(BaseEngine):

    # Going ahead and defining this, but really PDFs should still be placed
    # in the templates directory of an app because the loader checks templates
    app_dirname = 'pdfs'

    def __init__(self, params):
        params = params.copy()
        options = params.pop('OPTIONS').copy()
        super(PdftkEngine, self).__init__(params)
        self.engine = self._Engine(self.dirs, self.app_dirs, **options)

    def get_template(self, template_name, dirs=_dirs_undefined):
        return PdfTemplate(self.engine.get_template(template_name, dirs))

    class _Engine(Engine):

        def make_origin(self, display_name, loader, name, dirs):
            # Always return an Origin object, because PDFTemplate need it to
            # render the PDF Form file.
            from django.template.loader import LoaderOrigin
            return LoaderOrigin(display_name, loader, name, dirs)


class PdfTemplate(object):
    pdftk_bin = None

    def __init__(self, template):
        self.template = template
        self.set_pdftk_bin()

    @property
    def origin(self):
        return self.template.origin

    def render(self, context=None, request=None):
        if context is None:
            context = {}

        context = context.items()
        output, err = self.fill_form(context, self.origin.name)
        if err:
            raise PdfTemplateError(err)
        return output

    def fill_form(self, fields, src, pdftk_bin=None):
        fdf_stream = forge_fdf(fdf_data_strings=fields)

        cmd = [self.pdftk_bin, src, 'fill_form', '-', 'output', '-', 'flatten']
        cmd = ' '.join(cmd)

        return self.run_cmd(cmd, fdf_stream)

    def dump_data_fields(self):
        cmd = [self.pdftk_bin, self.origin.name, 'dump_data_fields']
        cmd = ' '.join(cmd)

        output, err = self.run_cmd(cmd, None)
        if err:
            raise PdfTemplateError(err)
        return output

    def run_cmd(self, cmd, input_data):
        try:
            process = subprocess.Popen(cmd, stdin=subprocess.PIPE,
                                       stdout=subprocess.PIPE, shell=True)
            if input_data:
                return process.communicate(input=input_data)
            else:
                return process.communicate()
        except OSError, e:
            return None, e

    def set_pdftk_bin(self):
        if self.pdftk_bin is None:
            from django.conf import settings
            if not hasattr(settings, 'PDFTK_BIN'):
                msg = "PDF generation requires pdftk " \
                      "(http://www.pdflabs.com/tools/pdftk-the-pdf-toolkit). " \
                      "Edit your PDFTK_BIN settings accordingly."
                raise ImproperlyConfigured(msg)
            self.pdftk_bin = settings.PDFTK_BIN

        return self.pdftk_bin

    def version(self):
        cmd = [self.pdftk_bin, '--version']
        cmd = ' '.join(cmd)

        output, err = self.run_cmd(cmd, None)
        if err:
            raise PdfTemplateError(err)
        return output


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

    if template_name.endswith('.pdf'):
        template = engines['pdf'].get_template(template_name)
    else:
        template = engines['django'].get_template(template_name)

    # Loading hacks
    codecs.register_error('strict', strict_errors)

    return template
