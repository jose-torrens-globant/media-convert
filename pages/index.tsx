import * as React from "react";

import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

import Drawer from "./components/Drawer/Drawer";

import FileTable from "./components/FileTable/FileTable";
import StreamingTable from "./components/StreamingTable/StreamingTable";

import MediaContext from "../context/MediaContext";
import { menuOptions } from "./constants/options";

export default function TemporaryDrawer() {
  const { selectedOption } = React.useContext(MediaContext);

  const renderContent = React.useCallback(() => {
    switch (selectedOption) {
      case menuOptions.VIDEO_FILES.key:
        return <FileTable />;
      case menuOptions.STREAMING_INFO.key:
        return <StreamingTable />;
      default:
        return null;
    }
  }, [selectedOption]);

  return (
    <div className="media-converter-main">
      <React.Fragment>
        <Drawer />
        <Paper
          className="main-container"
          sx={{ maxWidth: "100%", overflow: "hidden" }}
        >
          <Typography className="main-title" variant="h1">
            {/* @ts-expect-error */}
            {menuOptions[selectedOption]?.name}
          </Typography>

          {renderContent()}
        </Paper>
      </React.Fragment>
    </div>
  );
}
