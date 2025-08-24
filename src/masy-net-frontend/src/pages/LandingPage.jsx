import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FeatureCarousel from "../components/FeatureCarousel";
import HeroAnimation from "../components/HeroAnimation";
import CryptoGraphAnimation from "../components/Background Animation";
import InfinityGlow from "../components/IcpAnimation";
import BackgroundComponent from "../components/BgComponents";
import Navbar from "../components/Navbar";
import { AuthDesc } from "../context/AuthContext";

const LandingPage = () => {

  const { isAuthenticated, login} = AuthDesc();
  const navigate = useNavigate();

  useEffect(() => {
    if(isAuthenticated) {
      if(isAuthenticated) {
        navigate('/management');
      }
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async () => {
    await login();
  };


  useEffect(() => {
    const cursor = document.getElementById("cursor-light");
    let mouseX = 0;
    let mouseY = 0;
    let currentX = 0;
    let currentY = 0;

    const handleMouseMove = (e) => {
      mouseX = e.clientX - 64;
      mouseY = e.clientY - 64;
    };

    const animate = () => {
      currentX += (mouseX - currentX) * 0.1;
      currentY += (mouseY - currentY) * 0.1;
      cursor.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
      requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", handleMouseMove);
    animate();

    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="relative w-full min-h-screen text-white overflow-hidden">
      <Navbar />
      {/* bg */}
      <div className="absolute inset-0 z-0 opacity-40">
        <CryptoGraphAnimation />
        <BackgroundComponent/>
      </div>

      {/* efek cursor */}
      <div
        id="cursor-light"
        className="pointer-events-none fixed w-32 h-32 rounded-full bg-[#BF00FF] opacity-50 blur-2xl z-0 transition-transform duration-100 ease-out"
      ></div>

      <div className="container mx-auto px-4 relative z-10">
        {/* hero section */}
        <section className="mt-32 md:mt-48 grid md:grid-cols-2 gap-10 items-center text-center md:text-left">
          <div>
            <h1 className="lg:text-6xl text-4xl font-medium mb-6 text-whiteSmoke">
              Masy-Net
            </h1>
            <p className="text-base text-coolGray mb-8 leading-relaxed">
              Masy-net simply store employee records securely on-chain, no
              database setup, just pure decentralized storage. Easy. Immutable.
              Blockchain-powered.
            </p>
            <div className="flex justify-center md:justify-start">
              <button
                className="bg-whiteSmoke px-6 py-2 rounded-full text-black font-bold border-2 border-coolGray hover:bg-transparent hover:text-coolGray transition-all"
                onClick={handleLogin}
              >
                Get Started
              </button>
            </div>
          </div>
          <div className="flex justify-center">
            <InfinityGlow />
          </div>
        </section>

        {/* ABOUT US */}
        <section
          id="aboutus"
          className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center pt-20 mt-20"
        >
          <div className="flex justify-center order-2 md:order-1">
            <HeroAnimation />
          </div>
          <div className="order-1 md:order-2">
            <h2 className="text-3xl md:text-4xl text-whiteSmoke mb-6 text-center md:text-center">
              About Us
            </h2>
            <p className="text-coolGray leading-relaxed text-center md:text-left max-w-xl mx-auto">
              Masy-net is a decentralized workforce management platform that stores employee data on-chain, leverages Internet Identity for secure authentication and create digital contract.
            </p>
          </div>
        </section>

        {/* FEATURES */}
        <section id="features" className="relative py-24 mb-32">
          <div className="absolute inset-0 z-0 opacity-40">
            <CryptoGraphAnimation />
          </div>

          <div className="relative z-10 max-w-6xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl mb-8 text-whiteSmoke">
              What can you do with Masy-Net?
            </h1>
            <p className="text-coolGray text-base mb-12 max-w-3xl mx-auto leading-relaxed">
              Lock your employee records on-chain. Zero hassle, 100% trust
            </p>
            <FeatureCarousel />
          </div>
        </section>

      </div>
    </div>
  );
};

export default LandingPage;
