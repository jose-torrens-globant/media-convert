import type { NextApiRequest, NextApiResponse } from "next";

import {
  generateDASHOutputGroup,
  generateHLSOutputGroup,
  createMediaJob,
} from "../libs/mediaUtils";

const MAP_PROTOCOLS = {
  Dash: generateDASHOutputGroup,
  HLS: generateHLSOutputGroup,
};

const handlePostRequest = async (req: NextApiRequest, res: NextApiResponse) => {
  const body = JSON.parse(req.body);
  const protocols = body?.protocols;

  const groups: any = [];

  protocols.forEach((item: string) => {
    groups.push(
      /* @ts-expect-error */
      MAP_PROTOCOLS[item]({
        bucketDestination: process.env.S3_BUCKET_MEDIA_DESTINATION || "",
        resolutions: body.resolutions,
      })
    );
  });

  const AWSJobJSON = {
    Queue: process.env.MEDIA_CONVERT_QUEUE,
    UserMetadata: {},
    Role: process.env.AWS_ROLE,
    Settings: {
      TimecodeConfig: {
        Source: "ZEROBASED",
      },
      OutputGroups: groups,
      Inputs: [
        {
          AudioSelectors: {
            "Audio Selector 1": {
              DefaultSelection: "DEFAULT",
            },
          },
          VideoSelector: {},
          TimecodeSource: "ZEROBASED",
          FileInput: `s3://${body.bucketName}/${body.videoName}`,
        },
      ],
    },
  };

  try {
    const data = await createMediaJob(AWSJobJSON);

    res.status(201).send({
      message:
        "The job was created successfully, wait 60 sec or check the status in your AWS console",
    });
  } catch (error) {
    console.error(
      "🚀 ~ file: index.ts ~ line 60 ~ handlePostRequest ~ error",
      error
    );
    res.status(500).end({
      error: true,
      message: "An error has occurred, please try again.",
    });
  }
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  switch (method) {
    case "POST":
      handlePostRequest(req, res);
      break;
    default:
      res.setHeader("Allow", ["POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
