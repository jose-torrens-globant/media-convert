import { CreateJobCommand } from "@aws-sdk/client-mediaconvert";
import { emcClient } from "./mediaClient";

type JSONOutputType = {
  bucketDestination: string;
  resolutions: string[];
};

export const createMediaJob = (jobJson: any) => {
  return emcClient.send(new CreateJobCommand(jobJson));
};

export const generateDASHOutputGroup = ({
  bucketDestination,
  resolutions,
}: JSONOutputType) => {
  const outputs: any = [
    {
      AudioDescriptions: [
        {
          CodecSettings: {
            Codec: "AAC",
            AacSettings: {
              Bitrate: 96000,
              CodingMode: "CODING_MODE_2_0",
              SampleRate: 48000,
            },
          },
          AudioSourceName: "Audio Selector 1",
        },
      ],
      ContainerSettings: {
        Container: "MPD",
      },
      NameModifier: "_output1_Audio",
    },
  ];

  resolutions.forEach((resolution, index) => {
    const splittedResolution = resolution.split("x");
    const width = splittedResolution[0];
    const height = splittedResolution[1];

    const output = {
      VideoDescription: {
        CodecSettings: {
          Codec: "H_264",
          H264Settings: {
            RateControlMode: "QVBR",
            SceneChangeDetect: "TRANSITION_DETECTION",
            MaxBitrate: 5000000,
          },
        },
        Width: parseInt(width),
        Height: parseInt(height),
      },
      ContainerSettings: {
        Container: "MPD",
      },
      NameModifier: `_output${index + 2}_Video_${width}x${height}`,
    };

    outputs.push(output);
  });

  return {
    Name: "DASH ISO",
    OutputGroupSettings: {
      Type: "DASH_ISO_GROUP_SETTINGS",
      DashIsoGroupSettings: {
        SegmentLength: 15,
        FragmentLength: 2,
        Destination: `s3://${bucketDestination}/`,
      },
    },
    Outputs: outputs,
    CustomName: "dash_group",
  };
};

export const generateHLSOutputGroup = ({
  bucketDestination,
  resolutions,
}: JSONOutputType) => {
  const outputs: any = [];

  resolutions.forEach((resolution, index) => {
    const splittedResolution = resolution.split("x");
    const width = splittedResolution[0];
    const height = splittedResolution[1];

    const output = {
      VideoDescription: {
        CodecSettings: {
          Codec: "H_264",
          H264Settings: {
            RateControlMode: "QVBR",
            SceneChangeDetect: "TRANSITION_DETECTION",
            MaxBitrate: 5000000,
          },
        },
        Width: parseInt(width),
        Height: parseInt(height),
      },
      AudioDescriptions: [
        {
          CodecSettings: {
            Codec: "AAC",
            AacSettings: {
              Bitrate: 96000,
              CodingMode: "CODING_MODE_2_0",
              SampleRate: 48000,
            },
          },
          AudioSourceName: "Audio Selector 1",
        },
      ],
      OutputSettings: {
        HlsSettings: {},
      },
      ContainerSettings: {
        Container: "M3U8",
        M3u8Settings: {},
      },
      NameModifier: `_output${index + 1}_Video_${width}x${height}`,
    };

    outputs.push(output);
  });

  return {
    Name: "Apple HLS",
    OutputGroupSettings: {
      Type: "HLS_GROUP_SETTINGS",
      HlsGroupSettings: {
        SegmentLength: 10,
        MinSegmentLength: 10,
        AdditionalManifests: [
          {
            ManifestNameModifier: "hls_manifest",
            SelectedOutputs: outputs.map((item: any) => item.NameModifier),
          },
        ],
        Destination: `s3://${bucketDestination}/`,
      },
    },
    Outputs: outputs,
    CustomName: "hls_group",
  };
};
