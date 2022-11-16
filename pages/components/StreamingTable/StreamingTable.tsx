import React from "react";
import dynamic from "next/dynamic";

import Table from "../Table/Table";
import Modal from "../Modal/Modal";

import MediaContext from "../../../context/MediaContext";
import { formatBytes } from "../../utils/utils";

const Player = dynamic(import("./Player"), { ssr: false });

import { isAStreamingFile } from "../../constants/regex";

export default function TemporaryDrawer() {
  const [openModal, setOpenModal] = React.useState<boolean>(false);

  const [selectedVideo, setSelectedVideo] = React.useState<any>(null);

  const { files, getFiles, loading } = React.useContext(MediaContext);

  const config = React.useMemo(
    () => ({
      source: {
        ...(selectedVideo?.name?.indexOf(".mpd") >= 0
          ? { dash: selectedVideo?.url }
          : {}),
        ...(selectedVideo?.name?.indexOf(".m3u8") >= 0
          ? { hls: selectedVideo?.url }
          : {}),
      },
      autoplay: true,
      id: "player",
    }),
    [selectedVideo?.name, selectedVideo?.url]
  );

  React.useEffect(() => {
    getFiles?.(process.env.NEXT_PUBLIC_S3_BUCKET_MEDIA_DESTINATION || "");
  }, []);

  const filteredFiles = React.useMemo(
    /* @ts-expect-error */
    () => files?.filter((item) => isAStreamingFile.test(item.name)),
    [files]
  );

  const onCloseModal = React.useCallback(() => {
    setOpenModal(false);
  }, [loading]);

  const onPlayVideo = React.useCallback((data: any) => {
    setSelectedVideo(data);
    setOpenModal(true);
  }, []);

  const columns = [
    { id: "name", label: "Name", minWidth: 170 },
    {
      id: "lastModified",
      label: "Last Modified",
      minWidth: 100,
      format: (value: string) => new Date(value).toLocaleDateString("en-US"),
    },
    {
      id: "size",
      label: "Size",
      minWidth: 170,
      align: "right",
      format: (value: number) => formatBytes(value),
    },
    {
      id: "owner",
      label: "Owner",
      minWidth: 170,
      align: "right",
    },
    {
      id: "bucket",
      label: "Bucket",
      minWidth: 170,
      align: "right",
    },
    {
      id: "play",
      label: "Play",
      minWidth: 170,
      align: "right",
      action: onPlayVideo,
      icon: "play",
    },
  ];

  const videoRef = React.useRef();

  return (
    <React.Fragment>
      {/* @ts-expect-error check types */}
      <Table columns={columns} items={filteredFiles} />

      <Modal
        open={openModal}
        onClose={onCloseModal}
        modalTitle="Playing content"
        loading={loading}
      >
        {selectedVideo && (
          <div>
            <Player config={config} />
          </div>
        )}
      </Modal>
    </React.Fragment>
  );
}
