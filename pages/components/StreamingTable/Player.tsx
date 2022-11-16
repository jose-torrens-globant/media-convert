import React from "react";
 /* @ts-expect-error */
import { tplayer, destroyPlayer } from "tplayer.js";

// TODO This component should be improved

export default function Player({ config }: any) {
  const videoRef = React.useRef(null);

  React.useEffect(() => {
    tplayer({
      ...config,
      playerElem: videoRef?.current,
    });

    return () => destroyPlayer({ id: config.id });
  }, []);

  return (
    <div>
      <video ref={videoRef}></video>
    </div>
  );
}
