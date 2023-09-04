# Anota AI Analyst Test - Mateus José Barbosa

The test main goal is to build a API to handle a product catalog. Click below to see the original
requiments of Anota AI test:

[Original requirements](REQUIREMENTS.md)

## Deployed API information

- My test is deployed on [Railway](https://railway.app/).
- It can be visited through the link: [Demo](https://anotaai-test-production.up.railway.app/)

## Project structure

- The test was builded based on Clean Code and Clean Architecture
- See a simple folders organization:

```
src/
    ├── application/
    │   └── Here is the usecases and repository interfaces
    ├── entities/
    │   └── Here is the project main entities, like Category and Product
    ├── errors/
    │   └── Here is the custom errors, for better error handling
    ├── infrastructure/
    │   └── Here is the all implementation of external dependencies of project, like: express, SQS, S3 and MongoDB
    ├── main.ts // The project bootstrap file
    └── receive-messages.ts // Cron job to receive SQS messages about catalog update.
```

## Preparing your local environment

### Setting .env file

- Copy the `.env.example` file and rename to `.env`
  - See that `MONGO_URI` and `PORT` was already writed, if your have a personal MongoDB configured
    with differente URI, you can change in `MONGO_URI` on `.env` file
- Get your AWS credentials
  - If you don't have a AWS account, see
    [Create and setting AWS account](#create-and-setting-aws-account)
  - If you already have a configured AWS account in your machine, execute command below to get the
    AWS credentials
  - For Linux/MacOS
    - `cat ~/.aws/credentials`
  - For Windows
    - `type %USERPROFILE%\.aws\credentials`
  - In this file, copy values of `aws_access_key_id` and `aws_secret_access_key` and paste in
    `AWS_ACESS_KEY_ID` and `AWS_SECRET_ACESS_KEY` on `.env` file
- Get AWS region
  - In your AWS account console, on left side of your name, click on region name and get region code
    (see image below)
  - ![image](/docs/aws-get-region.png)
  - Copy this code and paste in `AWS_REGION` on `.env` file
- Get AWS Account ID
  - Still on AWS console, click in your profile name and copy your Account ID number (see image
    below)
  - ![image](/docs/aws-get-account-id.png)
  - Paste your Account ID in `AWS_ACCOUNT_ID` on `.env` file
- Set `MONGO_DB` value on `env` file
  - You can choose your Mongo database name, be creative!

### Create queue in AWS SQS

- On AWS Console, search for `SQS` or `Simple Queue Service` and click in the result
- Click on `Create queue` on SQS page
- Set queue name as `catalog-emit`
- At the end of the page, click on `Create queue`

### Create AWS S3 Bucket

- On AWS Console, search for `S3` and click in the result
- Click on `Create bucket` on S3 page
- Set bucket name as `anotaai-test-catalog`
- At the end of the page, click on `Create bucket`

### Running Docker

- Execute the command below to running docker-compose file and up MongoDB and Mongo Express services

```
$ docker compose up -d
```

- In first time, the Docker service will download images for your machine
- In another times, it will be faster

### Running application

- After all steps completed, execute the command sequence below to running application correctly

```
$ npm run build
$ npm start
```

- If everything is correct, the message `anotaai-test running at 3000`
  - 3000 is the application port setted on `.env` file

### Testing API

- In the project root, has a file called `requests.http` that makes possible test the API without
  Insomnia or Postman. Just install VSCode extension
  [REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client)
- On top of file, was configured variables, and see that `@baseURL` value is the
  `{{productionURL}}`. For local tests, change this value to `{{localURL}}`
- In this file, with the extension installed, just click on `Send Request` on top each request, and
  wait result.

### Create and setting AWS account

#### Log in or Register in AWS Account

- Acess [AWS site](https://aws.amazon.com/)
- Click on `Sign In to the Console` on right top
- Log in or register in AWS

#### Setting AWS Account

- Download AWS CLI in your machine
  - For Linux
  ```
  $ curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
  unzip awscliv2.zip
  sudo ./aws/install
  ```
  - For MacOS
  ```
  $ curl "https://awscli.amazonaws.com/AWSCLIV2.pkg" -o "AWSCLIV2.pkg"
  $ sudo installer -pkg AWSCLIV2.pkg -target /
  ```
  - For Windows
  ```
  C:\> msiexec.exe /i https://awscli.amazonaws.com/AWSCLIV2.msi
  ```
- After download, execute command `aws configure`
  - This command will generate a file with confidential values
- If everything is correct, return to
  [Preparing your local environment](#preparing-your-local-environment)
