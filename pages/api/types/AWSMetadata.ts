export type AWSMetadata = {
  httpStatusCode?: number | undefined;
  requestId?: string | undefined;
  extendedRequestId?: string | undefined;
  cfId?: string | undefined;
  attempts?: number | undefined;
  totalRetryDelay?: number | undefined;
};
