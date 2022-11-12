import type { NextApiRequest, NextApiResponse } from "next";

import { ListObjectsCommand } from "@aws-sdk/client-s3";

import { bucketList } from "../libs/s3Utils";

type mappedBucketList = {
  name: string | undefined;
  creationDate: Date | undefined;
  owner: string | undefined;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<mappedBucketList[]>
) {
  try {
    const data = await bucketList();

    const buckets =
      data?.Buckets?.map((bucket) => ({
        name: bucket.Name,
        creationDate: bucket.CreationDate,
        owner: data.Owner?.DisplayName,
      })) || [];

    res.status(200).json(buckets);
  } catch (err) {
    console.log("Error", err);
  }
}
