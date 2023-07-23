# # ALX CheckIn API - Attendance Management System

## Description

This is a REST API for an attendance management system. It allows students to check in and check out of ALX hubs in Addis Ababa, Ethiopia. The API is built with NestJS framework, PostgreSQL, and TypeOrm with the CQRS pattern.

## Installation

##### 1. Clone this repository

```bash
$ git clone https://github.com/eleccrazy/alx-checkin-backend-api.git
```

##### 2. Install the dependencies

```bash
$ npm install
```

##### 3. Create a docker container for the database and start it.

```bash
$ docker compose up -d
```

## Running the app

```bash
# development
$ npm run start # or yarn start

# watch mode
$ npm run start:dev # or yarn start:dev

# production mode
$ npm run build   # or yarn build
$ npm run start:prod # or yarn start:prod
```

## Test

```bash
# unit tests
$ npm run test # or yarn test
```
