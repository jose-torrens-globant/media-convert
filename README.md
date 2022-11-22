# media-convert

media-convert is a project made to play with the AWS media converts API.

## Env vars
To run the project correctly, you should set the following env vars. To do this, create a .env file in the root of the project:

- HOSTNAME=localhost
- PORT=3000 (or the port you want to use)
- HOST=http://$HOSTNAME:$PORT
- S3_BUCKET_REGION=Your bucket's region
- S3_BUCKET_MEDIA_DESTINATION=Bucket to save the files converted
- NEXT_PUBLIC_S3_BUCKET_MEDIA_DESTINATION=Same value as the previous one
- S3_BUCKET_ARN=Go to media-convert dashboard -> Jobs -> Create job -> AWS integration -> Service Role
- MEDIA_CONVERT_QUEUE=Go to media-convert dashboard -> lateral menu -> queues
- AWS_ROLE=
- MEDIA_CONVERT_API_ENDPOINT=Go to media-convert dashboard -> lateral menu -> account
- AWS_REGION=AWS region you are using for your services. It is recommended to use the same for both `S3` and `media-convert`

## Setting up AWS credentials
To use the libraries for NodeJS, we should set up the AWS credentials by following [this guide](https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/loading-node-credentials-shared.html)

## Configuring AWS media-convert
Go to the following [link](https://docs.aws.amazon.com/mediaconvert/latest/ug/iam-role.html) and complete the steps described.

## Running the app

Install the modules by running
```bash
npm install
# or
yarn install
```

Then, run the development server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.