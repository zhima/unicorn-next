import React, {useEffect, memo} from 'react';
import Head from 'next/head'


import Home from '../components/Home';
import Mint from '../components/Mint';
import FAQ from '../components/FAQ';

function App() {
  useEffect(() => {
    console.log('Home useEffect');
  }, []);

  return (
    <div>
      <Head>
        <title>Unicorn NFT</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <meta name="description" content="Unicorn NFT" />
        <link rel="icon" href="/favicon.svg" />
      </Head>

      <Home />

      <Mint />
      <FAQ />
    </div>    
  );
}

export default App;
