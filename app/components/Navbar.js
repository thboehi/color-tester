import Image from "next/image";

export default function Navbar( ) {
  

  return (
    <>
        <nav className="absolute bottom-8 left-1/2 w-fit h-16 -translate-x-1/2 bg-gray-500/5 shadow-md flex items-center justify-between px-4 z-50 rounded-full backdrop-blur-sm border border-white/10">
            <ul className="flex space-x-4">
                <li className="hover:-translate-y-1 transition-transform">
                    <a href="#" className="text-gray-500 hover:text-white transition-all">
                        <Image src="/home.svg" alt="Logo" width={12} height={12} className="w-6 h-6" />
                    </a>
                </li>
                <li className="hover:-translate-y-1 transition-transform"><a href="#" className="text-gray-500 hover:text-white transition-all -my-6 py-6 hover:translate-y-2">About</a></li>
                <li className="hover:-translate-y-1 transition-transform"><a href="#" className="text-gray-500 hover:text-white transition-all -my-6 py-6 hover:translate-y-2">Contact</a></li>
            </ul>
        </nav>
    </>
  )
}
