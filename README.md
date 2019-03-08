# Asana and Github tools for better project management.

### Asana Task ID

Automatically assign Task numbers to newly created Asana cards (eg. FR-1)

<img src="https://res.cloudinary.com/beaconmaker/image/upload/v1551416831/2019-03-01_16.06.07_uy4u8s.gif" alt="Image of Task numbers" width="600" />

### Asana/Github Sync

> Note: You will need an Asana Premium account to use these features. Asana Basic does not have access to custom fields and tasks search 😤

#### Add GitHub commits to Asana cards via Task IDs in the commit message (see example below).

<img src="https://res.cloudinary.com/beaconmaker/image/upload/v1552027610/Screen_Shot_2019-03-08_at_5.39.09_pm_yggqoq.png" alt="Image of Task Status" width="600" />

#### When a pull request is opened on GitHub, automatically update all associated Asana card's status to 'Review', and add the PR information to it.

<img src="https://res.cloudinary.com/beaconmaker/image/upload/v1552043810/Screen_Shot_2019-03-08_at_9.31.40_pm_ecjrai.png" alt="Image of Task Status" width="600" />

#### When a pull request is closed and merged on GitHub, automatically update all associated Asana card's status to 'Staging' or 'Production' depending on which branch it is merged into, and add the PR information to it.

<img src="https://res.cloudinary.com/beaconmaker/image/upload/v1552043810/Screen_Shot_2019-03-08_at_10.14.11_pm_jsegvr.png" alt="Image of Task Status" width="600" />

## Getting started (run locally):

1. Add the following variables into a .env file in the root folder of this app:

```
BASE_URL=https://featureready.herokuapp.com
PRODUCTION_BRANCH_NAME=master
STAGING_BRANCH_NAME=develop
GITHUB_PATOKEN=GGGG
GITHUB_OWNER_NAME=yoongfook
GITHUB_REPO_NAME=featureready
GITHUB_WEBHOOK_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxx
ASANA_PATOKEN=0/9cccccccccccccccccccccccccccc
ASANA_WORKSPACE_ID=111122222223333333
ASANA_PROJECT_ID=1111222224444444
ASANA_PROJECT_PREFIX=FR
ASANA_CUSTOM_FIELD_NAME=Stage
```

2. Run `npm run setup-custom-fields` to setup all the required custom-fields on your Asana project (Asana Premium required)

3. Run `npm run setup-asana-hooks` to setup all required hooks when creating a task etc
4. Run `npm run setup-github-hooks` to setup all required GitHub hooks when adding a commit, creating pull requests, etc
5. Run `npm run dev` to start the server locally

## Getting started (deploy to Heroku):

1. Clone this repo to your local machine
2. Create a new Heroku app
3. Push this repo to your newly created Heroku app (take note of the app's URL eg. https://featureready.herokuapp.com)
4. Add the config vars above to your app's Heroku dashboard > Settings, adding the URL from #3 to BASE_URL
5. Run `heroku run npm run setup-tags`
6. Run `heroku run npm run setup-hooks`

## Useful commands:

`npm list-hooks` - lists all hooks on Asana
