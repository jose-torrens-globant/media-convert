import "../styles/globals.scss";
import type { AppProps } from "next/app";
import React from "react";
import MediaContext from "../context/MediaContext";

import { menuOptions } from "./constants/options";

import { AWSBucket } from "./api/types/AWSBucket";
import { AWSS3Object } from "./api/types/AWSS3Object";

export default function App({ Component, pageProps }: AppProps) {
  const [buckets, setBuckets] = React.useState<AWSBucket[]>([]);
  const [files, setFiles] = React.useState<AWSS3Object[]>([]);

  const [selectedOption, setSelectedOption] = React.useState<string>(
    menuOptions.VIDEO_FILES.key
  );

  const getBuckets = React.useCallback(() => {
    fetch("/api/storage")
      .then((response) => response.json())
      .then((data: AWSBucket[]) => {
        const sortedResults = data?.sort(
          /* @ts-expect-error */
          (a, b) => new Date(a?.creationDate) - new Date(b?.creationDate)
        );

        setBuckets(sortedResults);
      });
  }, []);

  const getFiles = React.useCallback((bucketName: string) => {
    fetch(`/api/storage/files/${bucketName}`)
      .then((response) => response.json())
      .then((data: AWSS3Object[]) => {
        const sortedResults = data?.sort(
          /* @ts-expect-error */
          (a, b) => new Date(a?.creationDate) - new Date(b?.creationDate)
        );

        setFiles(sortedResults);
      });
  }, []);

  return (
    <MediaContext.Provider
      value={{
        buckets,
        getBuckets,
        selectedOption,
        setSelectedOption,
        getFiles,
        files,
      }}
    >
      <Component {...pageProps} />
    </MediaContext.Provider>
  );
}
