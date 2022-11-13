import "../styles/globals.scss";
import type { AppProps } from "next/app";
import React from "react";
import MediaContext from "../context/MediaContext";

import { menuOptions } from "./constants/options";

import { AWSBucket } from "./api/types/AWSBucket";

export default function App({ Component, pageProps }: AppProps) {
  const [buckets, setBuckets] = React.useState<AWSBucket[]>([]);

  const [selectedOption, setSelectedOption] = React.useState<string>(
    menuOptions.VIDEO_FILES.key
  );

  const getBuckets = React.useCallback(() => {
    fetch("/api/storage")
      .then((response) => response.json())
      .then((data: AWSBucket[]) => {
        setBuckets(data);
      });
  }, []);

  return (
    <MediaContext.Provider
      value={{
        buckets,
        getBuckets,
        selectedOption,
        setSelectedOption,
      }}
    >
      <Component {...pageProps} />
    </MediaContext.Provider>
  );
}
