import * as React from "react";

import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";

import Table from "../../components/Table/Table";

import MediaContext from "../../../context/MediaContext";
import { formatBytes } from "../../utils/utils";

export default function TemporaryDrawer() {
  const [bucket, setBucket] = React.useState<string>("");
  const { getBuckets, buckets, files, getFiles } =
    React.useContext(MediaContext);

  const handleChange = React.useCallback(
    (event: SelectChangeEvent<typeof bucket>) => {
      const {
        target: { value },
      } = event;

      setBucket(value);
    },
    []
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

  const onConvertElement = React.useCallback((data: any) => {
    console.log(
      "🚀 ~ file: FileTable.tsx ~ line 45 ~ onConvertElement ~ data",
      data
    );
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
      id: "convert",
      label: "Convert",
      minWidth: 170,
      align: "right",
      action: onConvertElement,
      icon: "trash",
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

      {/* @ts-expect-error */}
      <Table columns={columns} items={files} />
    </React.Fragment>
  );
}
