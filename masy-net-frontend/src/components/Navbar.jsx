import { useEffect, useState } from "react"

const Navbar = () => {
    const[show, setShow] = useState(false)
    const[scroll, setScroll] = useState(false)
    const handleClick = () => {
        setShow(!show)
    }
    let menuActive = show ? "right-auto" : "-right-full"

    useEffect(() => {
        window.addEventListener("scroll", ()=> {
            if (window.scrollY>5){
                setScroll(true)
                setShow(false)
            } else {
                setScroll(false)
            }
        })
    })
    let scrollActive = scroll ?"py-4 bg-transparent shadow" : "py-4"
  return (
    <div className={`navbar fixed mt-5 bg-transparent backdrop-blur-md left-1/2 -translate-x-1/2 rounded-lg w-2/4 shadow-md py-1.5 transition-all ${scrollActive} z-20`}>
        <div className="container mx-auto px-4">
            <div className="navbar-box flex items-center justify-between">
                <div className="logo">
                    <h1 className="sm:text-2xl text-xl font-bold">Masy-Net</h1>
                    </div>
                    <div>
                    <ul className={`flex lg:gap-12 md:static md:bg-transparent md:w-auto md:p-0 md:m-0 md:transform-none md:h-full md:translate-y-0 md:text-silverGrey md:flex-row md:shadow-none gap-8 fixed ${menuActive} top-1/2 mt-96 -translate-y-1/2 flex-col px-8 py-6 rounded shadow-lg shadow-black/50 bg-transparent font-bold text-coolGrey transition-all`}>
                        <li>
                            <a href="#home" className="font-medium opacity-75">Home</a>
                        </li>
                        <li>
                            <a href="#aboutus" className="font-medium opacity-75">About Us</a>
                        </li>
                        <li>
                            <a href="#features" className="font-medium opacity-75">Features</a>
                        </li>
                    </ul>
                        <i className="ri-menu-3-line text-3xl md:hidden block" onClick={handleClick}></i>
                    </div>
            </div>
        </div>
    </div>
  )
}

export default Navbar