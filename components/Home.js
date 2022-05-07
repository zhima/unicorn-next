import React from 'react';
import Image from 'next/image';
import MainIconImage from '../public/favicon.svg';
import NavBar from './NavBar';

const Home = () => {

  const start = () => {
    const ele = document.getElementById('mint');
    ele?.scrollIntoView({behavior: "smooth"});
  }

  return (
    <div id='home' className="w-full min-h-screen bg-[#f8ccbf]	 flex flex-col items-center justify-start">
      <NavBar />

      <Image
        className='mt-16'
        src={MainIconImage}
        alt="Picture of the unicorn"
        width={200}
        height={200}
      />
      <h1 className="lg:text-8xl text-5xl font-bold text-center text-black ">
        Unicorn  <span className='text-rose-600'>NFT</span>
      </h1>
      <p className='lg:text-2xl text-xl text-gray-500 my-8 text-center'>
        A decentralized NFT token that is backed by a smart contract.
      </p>
      <button 
        className='rounded-full lg:py-6 lg:px-12 lg:text-3xl py-4 px-8 text-1.5xl text-white bg-sky-700 hover:scale-105 hover:bg-sky-600 transition'
        onClick={start}  
      >
        Start Mint
      </button>
    </div>
  )
}

export default Home