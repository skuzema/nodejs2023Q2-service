# Home Library Service

## Prerequisites

- Git - [Download & Install Git](https://git-scm.com/downloads).
- Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager.

## Downloading

```
git clone https://github.com/skuzema/nodejs2023Q2-service.git
```

## Switching to development branch and Installing NPM modules

```
cd nodejs2023Q2-service
git checkout dev-part3
npm install
```

## Environment

Rename file `.env.example` to `.env`

## Running application

Run Docker Desktop and wait for the docker service to start:

```
docker-compose up
```

or

```
npm run docker:start
```

If you have any troubles with Docker, please try to clear all docker images, volumes and containers.
(Clean / Purge data in Troubleshoot section of Docker Desktop)

```
docker system prune -a
```

## Docker security scans

Please use these commands to scan docker images

```
npm run docker:scan
```

## Testing

After application running open new terminal and enter:

To run all test with authorization

```
npm run test:auth
```

To run only one of all test suites

```
npm run test:auth -- <path to suite>
```

Linting with ESLint and formatting with Prettier

```
npm run lint
```
