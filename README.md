# Asana and Github tools for better project management.

### Asana Task ID

Automatically assign Task numbers to newly created Asana cards (eg. FR-1)

<img src="https://res.cloudinary.com/beaconmaker/image/upload/v1551416831/2019-03-01_16.06.07_uy4u8s.gif" alt="Image of Task numbers" width="600" />

### Asana/Github Sync

#### Note: You will need an Asana Premium account to use this feature. Asana Basic does not have access to custom fields and tasks search 😤

Automatically assign and update card status (Draft, Review, Approved, Staging, Production) based on a Github Pull Request's status

<img src="https://res.cloudinary.com/beaconmaker/image/upload/v1552005620/Screen_Shot_2019-03-08_at_11.39.25_am_alvifk.png" alt="Image of Task Status" width="600" />

(Coming soon).

## Getting started (run locally):

1. Add the following variables into a .env file in the root folder of this app:

```
BASE_URL=https://featureready.herokuapp.com
PRODUCTION_BRANCH_NAME=master
STAGING_BRANCH_NAME=develop
GITHUB_PATOKEN=GGGG
GITHUB_OWNER_NAME=yoongfook
GITHUB_REPO_NAME=featureready
ASANA_PATOKEN=0/9cccccccccccccccccccccccccccc
ASANA_WORKSPACE_ID=111122222223333333
ASANA_PROJECT_ID=1111222224444444
ASANA_PROJECT_PREFIX=FR
```

2. Run `npm run setup-custom-fields` to setup all the required custom-fields on your Asana project (Asana Premium required)

3. Run `npm run setup-hooks` to setup all required hooks when creating a task etc

4. Run `npm run dev` to start the server locally

## Getting started (deploy to Heroku):

1. Clone this repo to your local machine
2. Create a new Heroku app
3. Push this repo to your newly created Heroku app (take note of the app's URL eg. https://featureready.herokuapp.com)
4. Add the config vars above to your app's Heroku dashboard > Settings, adding the URL from #3 to BASE_URL
5. Run `heroku run npm run setup-tags`
6. Run `heroku run npm run setup-hooks`

## Useful commands:

`npm list-hooks` - lists all hooks on Asana
