import "../styles/globals.scss";
import type { AppProps } from "next/app";
import React from "react";
import MediaContext from "../context/MediaContext";

import { menuOptions } from "./constants/options";

import { AWSBucket } from "./api/types/AWSBucket";
import { AWSS3Object } from "./api/types/AWSS3Object";

export type FileData = {
  protocols: string[];
  resolutions: string[];
  videoName: string;
  bucketName: string;
};

// TODO Fix types across the app
// TODO Remove if possible all @ts-expect-error 

export default function App({ Component, pageProps }: AppProps) {
  const [buckets, setBuckets] = React.useState<AWSBucket[]>([]);
  const [files, setFiles] = React.useState<AWSS3Object[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [convertStatus, setConvertStatus] = React.useState(null);

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
    setFiles([]);
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

  const convertFile = React.useCallback((fileData: FileData) => {
    setLoading(true);

    fetch("/api/convert", {
      method: "POST",
      body: JSON.stringify({
        protocols: fileData.protocols,
        resolutions: fileData.resolutions,
        videoName: fileData.videoName,
        bucketName: fileData.bucketName,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setConvertStatus(data);
      })
      .catch((data) => {
        setConvertStatus(data);
      })
      .finally(() => setLoading(false));
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
        loading,
        setLoading,
        convertFile,
        convertStatus,
        setConvertStatus,
      }}
    >
      <Component {...pageProps} />
    </MediaContext.Provider>
  );
}
