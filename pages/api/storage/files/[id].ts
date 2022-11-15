import type { NextApiRequest, NextApiResponse } from "next";

import { listBucketObjects } from "../../libs/s3Utils";

import { isAVideo } from "../../../constants/regex";

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
    const { id } = req.query;

    const bucketParams = { bucketName: id?.toString() || "" };

    const data = await listBucketObjects(bucketParams);

    const files =
      data?.Contents?.map((file) => ({
        name: file.Key,
        lastModified: file.LastModified,
        size: file.Size,
        owner: file.Owner?.DisplayName,
        bucket: data.Name,
      })).filter((file) => isAVideo.test(file?.name || "")) || [];

    res.status(200).json(files);
  } catch (err) {
    // Improve error handling for this request when bucket doesn't exist
    console.error("Error", err);
    res.status(200).json([]);
  }
}
