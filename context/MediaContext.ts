import React, { Dispatch, SetStateAction } from "react";

import { AWSBucket } from "../pages/api/types/AWSBucket";
import { AWSS3Object } from "../pages/api/types/AWSS3Object";

type MediaContextType = {
  buckets?: AWSBucket[];
  files?: AWSS3Object[];
  getBuckets?: () => void;
  getFiles?: (bucketName: string) => void;
  selectedOption?: string | undefined;
  setSelectedOption?: Dispatch<SetStateAction<string>>;
};

const MediaContext = React.createContext<MediaContextType>({});

export default MediaContext;
