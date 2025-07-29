import { SearchPage } from '@nestify/pages/Search'
import { Chatbot } from '@nestify/components/chatBot/chat'
import { Link } from 'react-router-dom'

import logo_default from '@nestify/assets/images/default_003.png';

import img_login from '@nestify/assets/images/login-bg.png'

export default function Demo() {
  return (
    <div className="relative overflow-y-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center filter blur-lg"
        style={{ backgroundImage: `url(${img_login})` }}
      />

      <div className="relative z-10 flex flex-col min-h-screen w-full">
        <div className="relative w-full flex flex-row items-center gap-x-4 max-w-[940px] mx-auto">
          <Link 
            to="/" 
            className="text-3xl flex flex-col items-center text-[#002B5C] hover:text-[#002B5C]/80 whitespace-nowrap"
          >
            <img src={logo_default} alt="Nestify Logo" className="w-[5rem] h-auto" />
          </Link>
          
          <div className="flex-grow">
            <SearchPage />
          </div>
        </div>
        <Chatbot />
      </div>

    </div>
  )
}
