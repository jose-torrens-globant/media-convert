import React, { Dispatch, SetStateAction } from "react";

import { AWSBucket } from "../pages/api/types/AWSBucket";
import { AWSS3Object } from "../pages/api/types/AWSS3Object";
import { FileData } from "../pages/_app";

type MediaContextType = {
  buckets?: AWSBucket[];
  files?: AWSS3Object[];
  getBuckets?: () => void;
  getFiles?: (bucketName: string) => void;
  selectedOption?: string | undefined;
  setSelectedOption?: Dispatch<SetStateAction<string>>;
  loading?: boolean;
  setLoading?: React.Dispatch<React.SetStateAction<boolean>>;
  convertFile?: (fileData: FileData) => void;
  convertStatus?: any;
  setConvertStatus?: Dispatch<SetStateAction<null>>;
};

const MediaContext = React.createContext<MediaContextType>({});

export default MediaContext;
