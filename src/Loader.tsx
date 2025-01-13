import React, { useEffect, useRef, useState } from "react";
import "./styles/loading-animation.css";

interface LoadProps {
  progress: number; // Progress as a percentage
}

const Load: React.FC<LoadProps> = ({ progress }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoCompleted, setIsVideoCompleted] = useState(false);

  useEffect(() => {
    const video = videoRef.current;

    if (video) {
      // Play the video on load
      video.play();

      // Event listener to detect when the video ends
      const handleVideoEnd = () => {
        setIsVideoCompleted(true); // Show loading overlay after video ends
      };

      video.addEventListener("ended", handleVideoEnd);

      return () => {
        video.removeEventListener("ended", handleVideoEnd); // Cleanup listener
      };
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

      {/* Show loading message and bar only after video completes */}
      {isVideoCompleted && (
        <div className="loader-overlay">
          <p className="loader-message">Your experience is loading!</p>
          <div className="loading-bar-container">
            <div
              className="loading-bar"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Load;
