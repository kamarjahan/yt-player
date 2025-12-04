import './globals.css';
import { Inter } from 'next/font/google';
import Navbar from '@/components/Navbar';
import { AuthContextProvider } from '@/context/AuthContext';
// Import icons individually to prevent import errors
import { FaHome, FaCompass, FaPlayCircle, FaHistory, FaClock, FaThumbsUp, FaFire, FaMusic, FaGamepad, FaCode } from 'react-icons/fa';
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Jahan Tube',
  description: 'Custom YouTube Player',
};

export default function RootLayout({ children }) {
  // Define menu items inside the component to ensure icons render
  const menuItems = [
    { name: 'Home', icon: <FaHome size={20} />, path: '/' },
    { name: 'Shorts', icon: <FaFire size={20} />, path: '/' },
    { name: 'Subscriptions', icon: <FaCompass size={20} />, path: '/' },
    { name: 'Library', icon: <FaPlayCircle size={20} />, path: '/' },
    { name: 'History', icon: <FaHistory size={20} />, path: '/' },
    { name: 'Your Videos', icon: <FaPlayCircle size={20} />, path: '/' },
    { name: 'Watch Later', icon: <FaClock size={20} />, path: '/' },
    { name: 'Liked Videos', icon: <FaThumbsUp size={20} />, path: '/' },
  ];

  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthContextProvider>
          <Navbar />
          
          <div className="flex pt-14 h-screen bg-[#0f0f0f] overflow-hidden">
            {/* Sidebar */}
            <aside className="w-[72px] sm:w-[240px] hidden md:flex flex-col gap-1 p-3 h-full overflow-y-auto bg-[#0f0f0f] hover:bg-[#0f0f0f] fixed left-0 top-14 z-40">
               {menuItems.map((item, index) => (
                  <Link 
                    href={item.path} 
                    key={item.name} 
                    className={`flex items-center gap-5 px-3 py-2.5 rounded-lg hover:bg-[#272727] cursor-pointer transition-all text-white ${index === 0 ? 'bg-[#272727]' : ''}`}
                  >
                    <span className="text-white min-w-[24px] flex justify-center">{item.icon}</span>
                    <span className="text-sm font-medium hidden sm:block overflow-hidden whitespace-nowrap">{item.name}</span>
                  </Link>
               ))}
               
               <hr className="my-3 border-[#3f3f3f] hidden sm:block" />
               
               <div className="hidden sm:block px-3">
                 <h3 className="text-sm font-semibold text-[#aaaaaa] mb-2">Explore</h3>
                 <div className="flex flex-col gap-1 text-white">
                    <div className="flex items-center gap-5 px-3 py-2 rounded-lg hover:bg-[#272727] cursor-pointer">
                      <FaMusic className="text-xl"/> <span className="text-sm">Music</span>
                    </div>
                    <div className="flex items-center gap-5 px-3 py-2 rounded-lg hover:bg-[#272727] cursor-pointer">
                      <FaGamepad className="text-xl"/> <span className="text-sm">Gaming</span>
                    </div>
                 </div>
               </div>
            </aside>
            
            {/* Main Content */}
            <main className="flex-1 md:ml-[240px] w-full h-full overflow-y-scroll bg-[#0f0f0f]">
              {children}
            </main>
          </div>
        </AuthContextProvider>
      </body>
    </html>
  );
}