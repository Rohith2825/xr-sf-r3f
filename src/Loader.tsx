import React, { useEffect, useRef } from "react";
import "./styles/loading-animation.css";

interface LoadProps {
  progress: number; // Progress as a percentage
}

const Load: React.FC<LoadProps> = ({ progress }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;

    if (video) {
      // Play the video on load
      video.play();

      // Pause the video after 2 seconds
      const timeout = setTimeout(() => {
        video.pause();
      }, 2000);

      return () => clearTimeout(timeout); // Cleanup the timeout on unmount
    }
  }, []);

  return (
    <div className="loader-background">
      {/* Full-screen video */}
      <video
        ref={videoRef}
        className="loader-video"
        src="/media/Loading_video.MOV" // Replace with your video file path
        muted
        playsInline
      ></video>

      {/* Loading overlay */}
      {/* <div className="loader-overlay">
        <div className="loader-container">
          <div className="spinner">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
          <div className="loading-text-container">
            <div className="loading-text typewriter">Delta XR</div>
            <div className="loading-text">{Math.round(progress)}%</div>
          </div>
          <img
            id="powered-by-loader"
            src="logo.avif"
            alt="Powered By Strategy Fox"
            className="powered-by-loader"
          />
        </div>
        <div className="loading-line"></div>
      </div> */}
    </div>
  );
};

export default Load;
