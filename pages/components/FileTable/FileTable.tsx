import * as React from "react";

import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import Checkbox from "@mui/material/Checkbox";

import Table, { TableItem } from "../../components/Table/Table";
import Modal from "../Modal/Modal";

import MediaContext from "../../../context/MediaContext";
import { formatBytes } from "../../utils/utils";

import { isAVideo } from "../../constants/regex";

const RESOLUTIONS = ["1280x536", "1200x720", "960x720"];

const STREAMING_PROTOCOLS = ["Dash", "HLS"];

export default function TemporaryDrawer() {
  const [openModal, setOpenModal] = React.useState<boolean>(false);
  const [resolutions, setResolutions] = React.useState<string[]>([]);

  const [protocols, setProtocols] = React.useState<string[]>([]);
  const [selectedVideo, setSelectedVideo] = React.useState<TableItem>();

  const [bucket, setBucket] = React.useState<string>("");

  const {
    getBuckets,
    buckets,
    files,
    getFiles,
    loading,
    convertFile,
    convertStatus,
    setConvertStatus,
  } = React.useContext(MediaContext);

  const filteredFiles = React.useMemo(
    /* @ts-expect-error */
    () => files?.filter((item) => isAVideo.test(item.name)),
    [files]
  );

  const handleChange = React.useCallback(
    (event: SelectChangeEvent<typeof bucket>) => {
      const {
        target: { value },
      } = event;

      setBucket(value);
    },
    []
  );

  const onProtocolsChange = React.useCallback(
    (event: any) => {
      const value = event.target.value;

      if (protocols.includes(value)) {
        setProtocols((state) => {
          return state.filter((item) => item !== value);
        });

        return;
      }

      setProtocols((state) => {
        return [...state, value];
      });
    },
    [protocols]
  );

  const onResolutionsChange = React.useCallback(
    (event: any) => {
      const value = event.target.value;

      if (resolutions.includes(value)) {
        setResolutions((state) => {
          return state.filter((item) => item !== value);
        });

        return;
      }

      setResolutions((state) => {
        return [...state, value];
      });
    },
    [resolutions]
  );

  React.useEffect(() => getBuckets, []);

  React.useEffect(() => {
    if (buckets?.length) {
      setBucket(buckets?.[0]?.name || "");
    }
  }, [buckets]);

  React.useEffect(() => {
    if (!["", null, undefined].includes(bucket)) {
      getFiles?.(bucket);
    }
  }, [bucket]);

  const onCloseModal = React.useCallback(() => {
    if (loading) {
      return;
    }

    setOpenModal(false);

    setProtocols([]);
    setResolutions([]);

    if (convertStatus) {
      setConvertStatus?.(null);
    }
  }, [loading, setConvertStatus]);

  const onConvertElement = React.useCallback((data: any) => {
    setSelectedVideo(data);
    setOpenModal(true);
  }, []);

  const startConvertion = React.useCallback(() => {
    convertFile?.({
      resolutions,
      protocols,
      videoName: selectedVideo?.name || "",
      bucketName: selectedVideo?.bucket || "",
    });
  }, [selectedVideo?.name, selectedVideo?.bucket, resolutions, protocols]);

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
      id: "convert",
      label: "Convert",
      minWidth: 170,
      align: "right",
      action: onConvertElement,
      icon: "convert",
    },
  ];

  return (
    <React.Fragment>
      <FormControl sx={{ m: 1, width: 300 }}>
        <InputLabel id="demo-multiple-name-label">
          Select your bucket
        </InputLabel>
        <Select
          labelId="demo-multiple-name-label"
          id="demo-multiple-name"
          value={bucket}
          onChange={handleChange}
          input={<OutlinedInput label="Select your bucket" />}
        >
          {buckets?.map((bucket) => (
            <MenuItem key={bucket.name} value={bucket.name}>
              {bucket.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* @ts-expect-error check types */}
      <Table columns={columns} items={filteredFiles} />

      <Modal
        open={openModal}
        onClose={onCloseModal}
        titleActionButton={convertStatus ? "Close" : "Start video conversion"}
        onClickActionButton={convertStatus ? onCloseModal : startConvertion}
        modalTitle="Start video conversion"
        loading={loading}
        disableButton={loading || !resolutions.length || !protocols.length}
      >
        {!convertStatus && (
          <>
            <div className="confirmation-message">
              You are about to convert this file{" "}
              <span>{selectedVideo?.name}</span>, please select the following
              options
            </div>

            <div className="options-container">
              <FormControl
                className="options"
                component="fieldset"
                variant="standard"
              >
                <FormLabel component="legend">Select the resolution</FormLabel>
                <FormGroup>
                  {RESOLUTIONS.map((item) => (
                    <FormControlLabel
                      key={item}
                      control={
                        <Checkbox
                          onChange={onResolutionsChange}
                          value={item}
                          name="resolutions"
                        />
                      }
                      label={item}
                    />
                  ))}
                </FormGroup>
              </FormControl>

              <FormControl
                className="options"
                component="fieldset"
                variant="standard"
              >
                <FormLabel component="legend">
                  Select the streaming protocol
                </FormLabel>
                <FormGroup>
                  {STREAMING_PROTOCOLS.map((item) => (
                    <FormControlLabel
                      key={item}
                      control={
                        <Checkbox
                          onChange={onProtocolsChange}
                          value={item}
                          name="protocols"
                        />
                      }
                      label={item}
                    />
                  ))}
                </FormGroup>
              </FormControl>
            </div>
          </>
        )}

        {convertStatus && (
          <div
            className={`confirmation-message ${
              convertStatus?.error ? "error" : ""
            } ${convertStatus && !convertStatus?.error ? "success" : ""}`}
          >
            {convertStatus?.message}
          </div>
        )}
      </Modal>
    </React.Fragment>
  );
}
