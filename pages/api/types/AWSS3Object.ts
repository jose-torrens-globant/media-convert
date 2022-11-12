import { AWSOwner } from "./AWSOwner";

export type AWSS3Object = {
  Key?: string | undefined;
  LastModified?: Date | undefined;
  ETag?: string | undefined;
  ChecksumAlgorithm?: string[] | undefined;
  Size?: number | undefined;
  StorageClass?: string | undefined;
  Owner?: AWSOwner | undefined;
};
