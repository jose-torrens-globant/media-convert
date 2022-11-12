import type { NextApiRequest, NextApiResponse } from "next";

import { ListObjectsCommand } from "@aws-sdk/client-s3";

import { s3Client } from "../libs/s3Client";
import { listBucketObjects } from "../libs/s3Utils";

type mappedObjectList = {
  name: string | undefined;
  lastModified: Date | undefined;
  size: number | undefined;
  owner: string | undefined;
  bucket: string | undefined;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<mappedObjectList[]>
) {
  try {
    const bucketParams = { bucketName: process.env.S3_BUCKET_NAME || "" };

    const data = await listBucketObjects(bucketParams);

    const files =
      data?.Contents?.map((file) => ({
        name: file.Key,
        lastModified: file.LastModified,
        size: file.Size,
        owner: file.Owner?.DisplayName,
        bucket: data.Name,
      })) || [];

    res.status(200).json(files);
  } catch (err) {
    console.log("Error", err);
  }
}
