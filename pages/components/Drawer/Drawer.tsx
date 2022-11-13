import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

import { menuOptions } from "../../constants/options";
import MediaContext from "../../../context/MediaContext";

import "./Drawer.module.scss";

export default function TemporaryDrawer() {
  const { setSelectedOption, selectedOption } = React.useContext(MediaContext);
  console.log(
    "🚀 ~ file: Drawer.tsx ~ line 19 ~ TemporaryDrawer ~ selectedOption",
    selectedOption
  );

  // React.useEffect(() => getBuckets, []);

  return (
    <div>
      <React.Fragment>
        <Drawer className="media-drawer" anchor={"left"} variant="permanent">
          <Box
            sx={{
              width: 250,
            }}
            role="presentation"
          >
            <div className="project-title">Media Convert</div>
            <List>
              {Object.values(menuOptions)?.map((item, index) => (
                <ListItem
                  key={item.key}
                  disablePadding
                  onClick={() => setSelectedOption(item.key)}
                  className={`${selectedOption === item.key ? "active" : ""}`}
                >
                  <ListItemButton>
                    <ListItemIcon>
                      {/* {index % 2 === 0 ? <InboxIcon /> : <MailIcon />} */}
                    </ListItemIcon>
                    <ListItemText primary={item.name} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Box>
        </Drawer>
      </React.Fragment>
    </div>
  );
}
