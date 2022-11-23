# Dashboard-spa

---

## Table of contents

| #   | Title                                                         |
|-----|---------------------------------------------------------------|
| 1   | [Prepare your environment](#prepare-your-environment)         |
| 2   | [Connect to remote backend](#connect-to-remote-backend)       |
| 3   | [Connect to local backend](#connect-to-local-backend)         |
| 4   | [Local code validation](#local-code-validation)               |
| 5   | [How to configure yalc](#how-to-configure-yalc)               |
| 6   | [How to debug analytic events](#how-to-debug-analytic-events) |

## Prepare your environment

### Docker Login

*Note: it's a one-time operation for all projects. No need to do it more than once*

Prepare gitlab access token for you account with the following READ-ONLY permissions: `api, read_user, read_api, read_repository, read_registry`.  
https://docs.gitlab.com/ee/user/profile/personal_access_tokens.html

*Make sure to copy the access token value to your clipboard.*

Then run, using the acquired token

```bash
docker login https://docker.alycedev.com -u <email> -p <PersonalAccessToken>
```

### Related projects

It is required to have these projects deployed locally:

- https://gitlab.alycedev.com/alycecom/frontend-packages
- https://gitlab.alycedev.com/alycecom/alyce-app
- https://gitlab.alycedev.com/alycecom/api-gateway-svc
- https://gitlab.alycedev.com/alycecom/contacts-svc
- https://gitlab.alycedev.com/alycecom/traefik-svc

Please follow the corresponding projects README for more information

### Hosts

Add the following hosts:

- *For Linux/MacOS: edit the file in /etc/hosts*
- *For Windows: edit the file in /Windows/System32/drivers/etc/hosts*

```
# dashboard-spa
127.0.0.1   dashboard.alyce.test
```

### Running application

#### Using docker environment

```shell
make rebuild
```

Then open `http://dashboard.alyce.test` in your browser

#### Using local environment

Requirements

- [x] `Node.js` 16.13.0 LTS
- [x] `npm@6.9.0` or later
- [x] `yarn@1.21.1` or later
- [x] `lerna` globally installed
- [ ] `yalc` globally (optional) to work with SPA and packages on your local machine
- [ ] `concurrently` globally (optional) to work with SPA and packages on your local machine
- [ ] `nodemon` globally (optional) to work with SPA and packages on your local machine

```shell
sudo npm install -g npm@6.9.0 lerna yarn
```

```shell
make env
yarn install
yarn start
```

Then open `http://dashboard.alyce.test:3000` in your browser.

## Connect to remote backend

### Setup .env variables

Replace urls in .env to your instance

e.g. your instance is - `qa.alycedev.com`,
and following is how .env should be updated:
```dotenv
REACT_APP_API_HOST=https://qa.alycedev.com
REACT_APP_PROXY=https://qa.alycedev.com
```

### Allow cors
- Open alyce admin on your instance (e.g - https://qa.alycedev.com/admin)
- Navigate to Admin > Setting
- Add `http://dashboard.alyce.test:3000` in CORS ALLOWED ORIGINS field in API section
- At this point your local frontend can be connected to a remote instance

## Connect to local backend

### Setup .env variables

Replace urls in .env to the local backend urls

```shell
REACT_APP_API_HOST=http://alyce.test
REACT_APP_PROXY=http://alyce.test
```

Start dashboard application

```shell
yarn install
yarn start
```

### Open dashboard application with local backend
- Copy gift link from remote instance alyce admin part
- Paste this link in the browser url (it should be done in incognito mode or in the another browser)

## Local code validation

Run `make qa`. It will run the following commands sequentially:

- yarn lint:js
- yarn prettier:check
- yarn test --watchAll=false

## How to configure yalc
[Read this guide to know how to do it](./docs/guides/how_to_configure_yalc.md).

## How to debug analytic events
[Read this guide to know how to do it](./docs/guides/how_to_debug_analytics_events.md).
