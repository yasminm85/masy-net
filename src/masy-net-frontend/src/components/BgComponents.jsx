// components/BackgroundComponent.jsx
import React from "react";

const BackgroundComponent = () => {
  return (
    <div className="absolute inset-0 overflow-hidden -z-10">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-richBlack via-[#1B0032] to-[#030014]" />

      {/* Glowing Blobs*/}
      <div className="absolute top-[-10%] left-[-10%] w-[400px] h-[400px] bg-[#BF00FF] opacity-20 blur-3xl rounded-full animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#00FFFF] opacity-20 blur-3xl rounded-full animate-pulse" />
      <div className="absolute top-[30%] right-[20%] w-[300px] h-[300px] bg-[#FF007F] opacity-15 blur-3xl rounded-full animate-pulse" />

    </div>
  );
};

export default BackgroundComponent;
