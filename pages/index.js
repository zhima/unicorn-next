import React, {useState} from 'react';
import Head from 'next/head'

import styles from '../styles/Home.module.css'
import { styled } from '@mui/material/styles';
import NavBar from '../components/NavBar';
import Home from '../components/Home';
import Mint from '../components/Mint';
import FAQ from '../components/FAQ';

export default function App() {
  

  return (
    <div>
      <Head>
        <title>Unicorn NFT</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <meta name="description" content="Unicorn NFT" />
        <link rel="icon" href="/favicon.svg" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
        />
      </Head>

      <Home />

      <NavBar />

      <Mint />
      <FAQ />
      
    </div>
  )
}
