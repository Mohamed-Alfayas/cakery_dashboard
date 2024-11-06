import React from "react";
import preloaderGif from "../assets/img/preloader-2.gif";

const PreLoaderComponent = () => {
  return (
    <div className="preloader-section">
      <img src={preloaderGif} alt="Loading..." />
    </div>
  );
};

export default PreLoaderComponent;
