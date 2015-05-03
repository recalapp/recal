# Dev Environment Setup
## Installing Prerequisites
### Heroku Toolbelt
ReCal uses Heroku. For testing, it is recommended to use Heroku's Foreman, as opposed to using Django's built-in testing web server. To get Foreman, install [Heroku Toolbelt](https://toolbelt.heroku.com/).

### Environmental Variable
Copy the file `.env_example` into `.env` and fill in the appropriate variable. Then, execute it as a Bash script, or to make things easier, use [autoenv](https://github.com/kennethreitz/autoenv).

### Postgres
ReCal uses Postgres as its database. First, download [Postgres](http://www.postgresql.org/). For Mac, the easiest thing is to install [Postgres.app](http://postgresapp.com/). Create an empty database for use with ReCal. Django will take care of the rest.

### PIP
We use PIP to keep track of our required packages. First, install [PIP](https://pypi.python.org/pypi/pip). Optionally, but recommended, use [virtualenv](http://docs.python-guide.org/en/latest/dev/virtualenvs/) to keep ReCal's PIP packages separate from your other projects. On a Mac, also install [virtualenvwrapper](https://virtualenvwrapper.readthedocs.org/en/latest/), which exposes a nice command-line interface. When you have everything setup, run the following:

```
pip install -r requirements.txt
```

Two things you may have to install to successfully run this command:
- MySQL - We are working to eliminate this, as we don't actually need MySQL. But for now, we don't want to change the production code, so go ahead and install it.
- [PDFtk](https://www.pdflabs.com/tools/pdftk-the-pdf-toolkit/)

## Initial Setup
### Django
We need to give django a chance to set up everything. To do that, run the script `setup_database`. Note that you must have your environmental variables set up correctly for this to work.

## Running the Test Environment
Issue this command:

```
foreman start
```

You can now access the test environment at `localhost:PORT`, where PORT is the actual port number.

### collectstatic
Whenever you make changes to the static file, you must tell Django about it. To do that, run:

```
python manage.py collectstatic
```
