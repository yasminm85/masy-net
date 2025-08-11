import React from "react";
import "./HeroAnimation.css";
import btc from "../assets/btc.png";
import icp from "../assets/icp.png";
import eth from "../assets/eth.png";

const coins = [
  { src: btc, alt: "Bitcoin", style: { top: "50%", left: "15%", animationDelay: "0s" } },
  { src: eth, alt: "Ethereum", style: { top: "10%", left: "75%", animationDelay: "1.5s" } },
  { src: icp, alt: "ICP", style: { top: "20%", left: "40%", animationDelay: "0.8s", width: "210px", height: "210px" } },
];

const HeroAnimation = () => {
  return (
    <div className="hero-animation-container">
      {coins.map((coin, idx) => (
        <img
          key={idx}
          src={coin.src}
          alt={coin.alt}
          className="floating-coin"
          style={coin.style}
        />
      ))}
      <div className="blur" />
    </div>
  );
};

export default HeroAnimation;
