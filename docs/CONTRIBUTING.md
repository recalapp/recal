# Contribution Guide

## Workflow
We will be using a rebase workflow. This is generally much easier for
rollbacks.

### Working on a New Feature
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

### `pull --ff-only` and `merge --ff-only`
`git pull` does not always do the right thing, as it tries to merge. We never want merging, so I recommend adding the following aliases to your ~/.gitconfig:

```
[alias]
    ...
    pff = pull --ff-only
    mff = merge --ff-only
    ...
```

#### What if I Can't Fast-Forward on Master?
```
# on master
git fetch
git rebase origin/master
```

## Dev Environment Setup
### Docker Compose
ReCal uses Docker, along side Docker Compose. Make sure to install the [Docker
Community Edition](https://www.docker.com/community-edition), which comes with
all required software before proceeding.

### Initial Setup

With Docker and Docker Compose installed, we can build the initial container
along with populate the test database. Run:

```bash
docker-compose build
```

and then to start the server:

```bash
docker-compose up -d
```

To set up the database, run the following command. Note that you will be asked
for a username, email, and password - this is to set up the first superuser
account on Django.

```bash
docker-compose exec web bin/setup_database
```

You can now access Recal locally at http://localhost:5000.

#### Static Assets

To install, compile, and collect static assets:

```bash
docker-compose exec web sh bin/compile_static
```

Whenever you make changes to the static assets, this must be re-run.
