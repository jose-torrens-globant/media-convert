import * as React from "react";

import Drawer from "./components/Drawer/Drawer";

export default function TemporaryDrawer() {
  const renderContent = React.useCallback(() => {
    
  }, []);

  return (
    <div className="media-converter-main">
      <React.Fragment>
        <Drawer />
        {renderContent()}
      </React.Fragment>
    </div>
  );
}
