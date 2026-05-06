# Expense Tracker (NestJS & ReactJS)

This is expense tracker web application. It is built with NestJS (backend), ReactJS (frontend) and MySQL (database). It had used some popular library like React-Toastify (message alert), dnd-kit (drag and drop), React Query (manage the API calling) and Chart.js.

**Most of the styling and design are referred to [Monny app](https://greamer.com/)**

## Features

1. Manage expense and income and the same time
2. User can create multiple wallets
3. View the expense/income distribution by pie chart, bar chart and line chart.

## Branches

There are 2 branch: master and refine-vite. The refine-vite branch is using refine's vite framework to develop. Both branch perform the same.

## Deploy

### Pre-requisite

Please ensure you have installed the following framework or software

1. [NodeJS](https://nodejs.org/en/download/current)
2. [Docker](https://www.docker.com/)
3. [NestJS](https://docs.nestjs.com/first-steps) framework

### Steps

1. Pull [MySQL image](https://hub.docker.com/_/mysql)
2. Start the container and create database (You may need to create a user in the MySQL container)
3. Create a .env file as .env.example and fill them all  
4. Build the client folder (frontend)

    ```npm run build:client```
5. Start the application

    ```npm run start```

## Environment variables

| Name                           | Description                                          |
|--------------------------------|-----------------------------------------------------------------------------------------------------------------------------|
| DB_HOST                        | MySQL host. Ignored if `DB_SOCKETPATH` is provided.          |
| DB_PORT                        | MySQL port, default `3306`. Ignored if `DB_SOCKETPATH` is provided. |
| DB_DATABASE                    | MySQL database name.                                         |
| DB_USERNAME                    | MySQL username.                                              |
| DB_PASSWORD                    | MySQL password. For production, the password should be stored in `GAE_DB_PASSWORD` secret in the same GCP project. |
| JWT_SECRET                    | Secret for creating and verifying the JWT                                             |
| JWT_EXPIRATION_TIME                    | Expiration time for the JWT |

## Screebshots

![image](https://github.com/Vincy-Cheng/nestjs-expense-tracker/assets/60846680/82505857-7261-480e-b6c7-6c939f0aa8f0)

![image](https://github.com/Vincy-Cheng/nestjs-expense-tracker/assets/60846680/65fe3aeb-e03d-4804-a537-5096ff8a5533)

![image](https://github.com/Vincy-Cheng/nestjs-expense-tracker/assets/60846680/5bdc8b45-05a5-4e2c-a561-b7cfafcb51fe)

![image](https://github.com/Vincy-Cheng/nestjs-expense-tracker/assets/60846680/19825f3c-cf36-4925-a35e-6e5ef51f3ff9)

![image](https://github.com/Vincy-Cheng/nestjs-expense-tracker/assets/60846680/11cf1f87-40d3-4f35-8467-0e0fe0720cba)

![image](https://github.com/Vincy-Cheng/nestjs-expense-tracker/assets/60846680/c724ce8b-57c1-45e6-909d-ab33f3741029)

![image](https://github.com/Vincy-Cheng/nestjs-expense-tracker/assets/60846680/44bc177a-19cb-4b61-bedf-cd1177e68d74)

![image](https://github.com/Vincy-Cheng/nestjs-expense-tracker/assets/60846680/a74ab4a2-5a55-47b0-86c8-5ab457791cb5)

![image](https://github.com/Vincy-Cheng/nestjs-expense-tracker/assets/60846680/2bad23e1-f054-40b9-a081-40ce8943f584)

![image](https://github.com/Vincy-Cheng/nestjs-expense-tracker/assets/60846680/e3b46ab5-8272-4b00-9e8b-e9411ac1688c)
