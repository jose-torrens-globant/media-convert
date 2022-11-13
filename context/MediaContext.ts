import React from "react";

type MediaContextType = {
  buckets?: any;
  getBuckets?: any;
  selectedOption?: any;
  setSelectedOption?: any;
};

const MediaContext = React.createContext<MediaContextType>({});

export default MediaContext;
