'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaYoutube, FaSearch, FaMicrophone, FaBell, FaUserCircle } from 'react-icons/fa';
import { useUserAuth } from '@/context/AuthContext';

export default function Navbar() {
  const { user, googleSignIn, logOut } = useUserAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    try {
      await googleSignIn();
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if(searchQuery) {
       router.push(`/search/${searchQuery}`);
    }
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-14 bg-[#0f0f0f] flex items-center justify-between px-4 border-b border-[#272727]">
      
      {/* 1. Left: Logo */}
      <div className="flex items-center gap-1 h-full cursor-pointer">
        <div className="p-2 hover:bg-[#272727] rounded-full hidden sm:block">
           <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white"><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"></path></svg>
        </div>
        <Link href="/" className="flex items-center gap-1">
           <FaYoutube className="text-3xl text-[#ff0000]" />
           <span className="text-xl font-bold tracking-tighter text-white font-sans relative -top-[1px]">Jahan Tube</span>
        </Link>
      </div>

      {/* 2. Center: Search Bar */}
      <div className="hidden sm:flex flex-1 items-center justify-center max-w-[700px] ml-10">
        <form onSubmit={handleSearch} className="flex w-full items-center">
            <div className="flex items-center h-10 bg-[#121212] border border-[#303030] border-r-0 rounded-l-full w-full px-4 focus-within:border-[#1c62b9] shadow-inner">
               <input 
                 type="text" 
                 placeholder="Search" 
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 className="w-full bg-transparent outline-none text-white text-base font-normal placeholder-[#888888]"
               />
            </div>
            <button 
              type="submit" 
              className="h-10 w-16 bg-[#222222] border border-[#303030] rounded-r-full flex items-center justify-center hover:bg-[#303030] cursor-pointer"
            >
              <FaSearch className="text-white text-lg" />
            </button>
        </form>
        
        <div className="ml-4 h-10 w-10 bg-[#181818] rounded-full flex items-center justify-center hover:bg-[#303030] cursor-pointer">
           <FaMicrophone className="text-white text-lg" />
        </div>
      </div>

      {/* 3. Right: Icons & Login */}
      <div className="flex items-center gap-3">
         <FaSearch className="text-white text-xl sm:hidden" />
         
         {user ? (
           <div className="flex items-center gap-4">
             <div className="hidden sm:flex h-9 w-9 items-center justify-center rounded-full hover:bg-[#272727] cursor-pointer">
                <FaBell className="text-white text-xl" />
             </div>
             <img 
               onClick={logOut}
               src={user.photoURL} 
               alt="User" 
               className="h-8 w-8 rounded-full cursor-pointer object-cover" 
             />
           </div>
         ) : (
           <button 
             onClick={handleLogin}
             className="flex items-center gap-2 text-[#3ea6ff] border border-[#3ea6ff]/30 px-3 py-1.5 rounded-full text-sm font-medium hover:bg-[#3ea6ff]/10"
           >
             <FaUserCircle className="text-xl" /> 
             Sign in
           </button>
         )}
      </div>
    </nav>
  );
}