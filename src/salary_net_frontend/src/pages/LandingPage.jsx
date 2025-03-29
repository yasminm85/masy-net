import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";

const LandingPage = () => {
  const { login, isAuthenticated } = useAuth();
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const handleLogin = async () => {
    const success = await login("/management"); 
    if (success) {
      setIsLoginOpen(false);
    } else {
      alert("Login gagal, silakan coba lagi");
    }
  };

  if (isAuthenticated) {
    window.location.href = "/management";
    return null;
  }
  return (
    
    <div className="landingpage pb-10">
            <Navbar />
      <div className="absolute inset-0 z-0">
        <div className="absolute top-10 left-20 w-72 h-72 bg-purple-400 opacity-70 blur-[100px] rounded-full"></div>
        <div className="absolute bottom-20 right-32 w-80 h-80 bg-blue-400 opacity-70 blur-[100px] rounded-full"></div>
        <div className="absolute top-1/3 left-1/2 w-96 h-96 bg-pink-400 opacity-70 blur-[100px] rounded-full"></div>
        <div className="absolute bottom-1 left-1/3 w-80 h-80 bg-yellow-400 opacity-70 blur-[100px] rounded-full"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="hero grid md:grid-cols-2 grid-cols-1 items-center gap-20 pt-32 relative z-10">
          <div className="box">
            <h1 className='lg:text-6xl/tight text-4xl font-medium mb-7'>Masy-net</h1>
          </div>
          <div className="box">
          <p className='text-base/8 mb-7'>
            Masy-net simply store employee records securely on-chain – no database setup, just pure decentralized storage. Easy. Immutable. Blockchain-powered. 
            </p>
          <div>
          <button className="bg-black px-5 py-2 rounded-full text-white font-bold border-2 border-black hover:bg-transparent hover:text-black transition-all z-10" onClick={() => setIsLoginOpen(true)}> Get Started </button>
          </div>
          </div>
        </div>


        <div id="aboutus"></div>
        <div className="aboutus py-10 px-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-lg p-6 mt-20 mb-7 relative z-10">
          <h1 className='lg:text-5xl/tight text-3xl text-center font-medium mb-7'>About Us</h1>
            <div className="box">
              <p className='text-base/loose '>
              Masy-net is a decentralized workforce management platform that stores employee data on-chain, leverages Internet Identity for secure authentication and get updated convert salary</p>
            </div>
        </div>        

        <div id="features"></div>
        <div className="features py-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-lg p-6 mb-7 mt-20">
          <h1 className='lg:text-5xl/tight text-3xl text-center font-medium mb-7'>Features</h1>
        
        <div className="features-box pt-12 grid md:grid-cols-2 gap-6">
          <div className="box py-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-lg p-4 mb-7">
            <i className="ri-number-1 text-3xl"></i>
            <h3 className='text-xl font-bold text-center'>Internet Identity Login</h3>
            <p className='text-base/loose justify-center'>Passwordless authentication via ICP's Web3 identity system</p>
          </div>
          <div className="box py-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-lg p-4 mb-7">
            <i className="ri-number-2 text-3xl"></i>
            <h3 className='text-xl font-bold text-center'>On-Chain Employee Data Storage</h3>
            <p className='text-base/loose justify-center'>Immutable, encrypted employee records stored directly on the Internet Computer blockchain</p>
          </div>
          <div className="box py-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-lg p-4 mb-7">
            <i className="ri-number-2 text-3xl"></i>
            <h3 className='text-xl font-bold text-center'>Currency Convertion</h3>
            <p className='text-base/loose justify-center'>Information of convertion</p>
          </div>
          </div>
        </div>

      {isLoginOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-center relative">
            <h2 className="text-2xl font-bold mb-4">Connect to ICP</h2>
            <button 
              className="bg-blue-500 text-white px-5 py-2 rounded-full hover:bg-blue-700 transition-all"
              onClick={handleLogin}
            >
              Login with Internet Identity
            </button>
            <button 
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800" 
              onClick={() => setIsLoginOpen(false)}
            >
              &times;
            </button>
          </div>
        </div>
      )}

      </div>
    </div>
  )
}

export default LandingPage