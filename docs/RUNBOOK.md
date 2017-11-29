# Runbook

## Initial setup

TODO

## Updating for a new semester

Make a new branch, e.g. `sp16` , then make the following changes to `settings/common.py`, landing, and status pages:

https://github.com/maximz/recal/commit/4dbc0684c132051cc4ed72dc7efae92a8b9949cd 
Test out on test-recal:


    git remote add dev https://git.heroku.com/test-recal.git
    git push dev sp16:master
    heroku run python manage.py course_selection_courses_init --app=test-recal
    # heroku run python manage.py clear_cache --app=test-recal # not needed but may help

Test on [test-recal](https://test-recal.herokuapp.com).

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
