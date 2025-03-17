import { useRef } from "react";
import React from "react";
import "./styles/loading-animation.css";

interface LoadProps {
  progress: number; 
}

const Load: React.FC<LoadProps> = ({ progress }) => {
  const prevProgressRef = useRef(0);
  const displayProgress = Math.max(progress, prevProgressRef.current);
  prevProgressRef.current = displayProgress;

  return (
    <div className="loader-background">
      <div className="loader-container-container">
        <div className="loader-container" id="loaderContainer">
          <div className="snapchat-logo">
            <img src="trace.png" alt="Snapchat Logo Trace" className="ghost-outline" />
          </div>
          <div className="loading-text-container">
            <span className="loading-text typewriter">Delta XR</span>
            <span className="loading-text">{Math.round(displayProgress)}%</span>
          </div>
          <img
            id="powered-by-loader"
            src="icon_black.png"
            alt="Powered By Strategy Fox"
            className="powered-by-loader"
          />
        </div>
        <div className="loading-line"></div>
      </div>
    </div>
  );
};

export default Load;