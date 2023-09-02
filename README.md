# Anota AI Analyst Test - Mateus José Barbosa

The test main goal is to build a API to handle a product catalog. See below the original requiments
of Anota AI test:

[Original requirements](REQUIREMENTS.md)

## Deploy information

- My test is deployed on [Railway](https://railway.app/).
- It can be visited through the link: [Demo](https://anotaai-test-production.up.railway.app/)

## Project structure

- The test was builded based on Clean Code and Clean Architecture
- See a simple folder explanation:

```
src/
    ├── application/
    │   └── Here is the usecases and repository interfaces
    ├── entities/
    │   └── Here is the project main entities, like Category and Product
    ├── errors/
    │   └── Here is the custom errors, for better error handling
    ├── infrastructure/
    │   └── Here is the all external dependencies of project, like: express, SQS, S3 and MongoDB
    ├── main.ts // The project bootstrap file
    └── receive-messages.ts // Cron job to receive SQS messages about catalog update.
```

- In the project root, has a file called `requests.http` that makes possible test the API without
  Insomnia or Postman interfaces. Just install VSCode extension
  [REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client)
- In the project root, has a .env.example with all enough variables to running project with personal
  information.
