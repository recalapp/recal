# Overview

ReCal is a course selection tool widely used at Princeton University.

# Runbook

## Initial setup

TODO

## Updating for a new semester

Make a new branch, e.g. `sp16` , then make the following changes to `settings/common.py` , landing, and status pages:

https://github.com/maximz/recal/commit/4dbc0684c132051cc4ed72dc7efae92a8b9949cd 

Test out on test-recal:


    git remote add dev https://git.heroku.com/test-recal.git
    git push dev sp16:master
    heroku run python manage.py course_selection_courses_init --app=test-recal
    # heroku run python manage.py clear_cache --app=test-recal # not needed but may help

Test at test-recal.herokuapp.com.

If good, then add a message to the main page: https://github.com/maximz/recal/commit/8bc566f7b8cd45f351b90d4294bbebf883c22baa

Then merge `sp16` into `master` , and deploy as follows:


    git push origin master
    git remote add prod https://git.heroku.com/newice.git
    git push prod master
    heroku run python manage.py course_selection_courses_init --app=newice

Then, test on recal.io.
And bump number of dynos.
Then send out emails.

## Updating Buildpacks

If relying on the older [Multipack Buildpack](https://github.com/ddollar/heroku-buildpack-multi), which is now deprecated, update the buildpacks as present on the `.buildpacks` file:


    heroku buildpacks:set -r dev https://github.com/heroku/heroku-buildpack-nodejs#v80
    heroku buildpacks:add -r dev https://github.com/naphatkrit/recal-heroku-typescript-buildpack#v1
    heroku buildpacks:add -r dev https://github.com/ejholmes/heroku-buildpack-bower
    heroku buildpacks:add -r dev https://github.com/naphatkrit/heroku-buildpack-pdftk
    heroku buildpacks:add -r dev https://github.com/heroku/heroku-buildpack-python#v57

Switch `-r dev` with `-r prod` if changing the production buildpacks.

# Workflow
We will be using a rebase workflow. This is much easier for rollbacks, and since we are not open-sourced, we don't have to deal with pull requests.

## Working on a New Feature
Use the following template.
```
git checkout -b fb1
# do your work here
...
# end of work
git fetch origin master:master # this is the same as `git checkout master && git pff && git checkout fb1`
git rebase -i master
git checkout master
git mff fb1
```

## `pull --ff-only` and `merge --ff-only`
`git pull` does not always do the right thing, as it tries to merge. We never want merging, so I recommend adding the following aliases to your ~/.gitconfig:

```
[alias]
    ...
    pff = pull --ff-only
    mff = merge --ff-only
    ...
```

### What if I Can't Fast-Forward on Master?
```
# on master
git fetch
git rebase origin/master
```

# Dev Environment Setup
## Installing Prerequisites
### Heroku Toolbelt
ReCal uses Heroku. For testing, it is recommended to use Heroku's Foreman, as opposed to using Django's built-in testing web server. To get Foreman, install [Heroku Toolbelt](https://toolbelt.heroku.com/).

### Environmental Variable
Copy the file `.env_example` into `.env` and fill in the appropriate variable. Then, execute it as a Bash script, or to make things easier, use [autoenv](https://github.com/kennethreitz/autoenv).

### Postgres
ReCal uses Postgres as its database. First, download [Postgres](http://www.postgresql.org/). For Mac, the easiest thing is to install [Postgres.app](http://postgresapp.com/). Create an empty database for use with ReCal. Django will take care of the rest.

### pipenv

We use `pipenv` to keep track of our required packages. First, install [pipenv](https://github.com/kennethreitz/pipenv). With `pipenv` installed, run:

```bash
pipenv install
```

To activate the virtual environment (to actually use the dependencies), run

```bash
pipenv shell
```

You may also need to install [PDFtk](https://www.pdflabs.com/tools/pdftk-the-pdf-toolkit/) manually in order to successfully run the command above. PDFtk is a dependency for parsing PDF files in python, which we use for generating course enrollment worksheets.

## Initial Setup
### Django
We need to give django a chance to set up everything. To do that, run the script `setup_database`. Note that you must have your environmental variables set up correctly for this to work.

### Static Assets

To install, compile, and collect static assets:

```bash
npm install
bin/compile_static
```

## Running the Test Environment
Issue this command:

```
heroku local
```

You can now access the test environment at `localhost:PORT`, where PORT is the actual port number. By default, PORT is 5000.

### collectstatic
Whenever you make changes to the static file, you must tell Django about it. To do that, run:

```
python manage.py collectstatic
```

If that fails, ignore the npm dependencies and run

```
python manage.py collectstatic -i node_modules
```