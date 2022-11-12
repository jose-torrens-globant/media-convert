import {
  CreateBucketCommand,
  PutBucketPolicyCommand,
  ListBucketsCommand,
  ListObjectsCommand,
  DeleteBucketCommand,
  DeleteObjectsCommand,
} from "@aws-sdk/client-s3";

import { s3Client } from "./s3Client";

import { AWSMetadata } from "../types/AWSMetadata";
import { AWSS3Object } from "../types/AWSS3Object";
import { AWSBucket } from "../types/AWSBucket";
import { AWSOwner } from "../types/AWSOwner";

type AWSRequestParams = {
  bucketName: string;
  sid?: string;
};

type AWSBaseResponse = {
  $metadata: AWSMetadata;
  Contents?: AWSS3Object[] | undefined;
  Buckets?: AWSBucket[] | undefined;
  IsTruncated?: boolean | undefined;
  Marker?: string | undefined;
  MaxKeys?: number | undefined;
  Name?: string | undefined;
  Prefix?: string | undefined;
  Owner?: AWSOwner | undefined;
};

export const createBucket = ({ bucketName }: AWSRequestParams) => {
  const createBucketCommand = new CreateBucketCommand({
    Bucket: bucketName,
  });

  return s3Client.send(createBucketCommand);
};

export const bucketList = (): Promise<AWSBaseResponse> =>
  s3Client.send(new ListBucketsCommand({}));

export const listBucketObjects = ({
  bucketName,
}: AWSRequestParams): Promise<AWSBaseResponse> =>
  s3Client.send(new ListObjectsCommand({ Bucket: bucketName }));

export const deleteBucket = ({ bucketName }: AWSRequestParams) =>
  s3Client.send(
    new DeleteBucketCommand({
      Bucket: bucketName,
    })
  );

export const emptyBucket = async ({ bucketName }: AWSRequestParams) => {
  const listObjectsResult = await listBucketObjects({ bucketName });

  const objects = listObjectsResult?.Contents || [];

  const objectIdentifiers = objects?.map((o) => ({ Key: o.Key }));

  return s3Client.send(
    new DeleteObjectsCommand({
      Bucket: bucketName,
      Delete: { Objects: objectIdentifiers },
    })
  );
};

export const putBucketPolicyAllowPuts = ({
  bucketName,
  sid,
}: AWSRequestParams) =>
  s3Client.send(
    new PutBucketPolicyCommand({
      Bucket: bucketName,
      Policy: JSON.stringify({
        Version: "2012-10-17",
        Statement: [
          {
            Sid: sid,
            Effect: "Allow",
            Principal: {
              Service: "ses.amazonaws.com",
            },
            Action: "s3:PutObject",
            Resource: `arn:aws:s3:::${bucketName}/*`,
          },
        ],
      }),
    })
  );
