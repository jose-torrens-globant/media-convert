import * as React from "react";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

type Column = {
  id: "name" | "lastModified" | "size" | "owner" | "bucket";
  label: string;
  minWidth?: number;
  align?: "right";
  format?: (value: number | string) => string;
  action: (row: TableItem) => void;
  icon: string;
};

export type TableItem = {
  bucket: string;
  lastModified: string;
  name: string;
  owner: string;
  size: number;
};

type TableProps = {
  items: TableItem[] | undefined;
  columns: Column[];
};

export default function StickyHeadTable(props: TableProps) {
  const { columns, items } = props;

  return (
    <TableContainer sx={{ maxHeight: 440 }}>
      <Table stickyHeader aria-label="sticky table">
        <TableHead>
          <TableRow>
            {columns?.map((column) => (
              <TableCell
                key={column.id}
                align={column.align}
                style={{ minWidth: column.minWidth }}
              >
                {column.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {items?.map((row) => {
            return (
              <TableRow hover role="checkbox" tabIndex={-1} key={row.name}>
                {columns?.map((column) => {
                  const value = row[column.id];
                  return (
                    <TableCell key={column.id} align={column.align}>
                      <React.Fragment>
                        {column.action && column.icon && (
                          <p onClick={() => column.action(row)}>
                            {column.icon}
                          </p>
                        )}

                        {column.format &&
                        ["number", "string"].includes(typeof value)
                          ? column.format(value)
                          : value}
                      </React.Fragment>
                    </TableCell>
                  );
                })}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
