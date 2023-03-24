import React, {useEffect, useRef, useState} from 'react';
import Image from 'next/image';
import Link from 'next/link';
import MainIconImage from '../public/favicon.svg';
import GitHubIcon from '@mui/icons-material/GitHub';
import { styled } from '@mui/material/styles';
import {breakpoint_md, formatAddress, getChainName} from '../utils';
import Chip from '@mui/material/Chip';
import {connectWallet, disconnectWallet, web3Modal, CHAIN_ID, getWeb3Instance, getProvider} from '/utils/Web3Provider';
import { useSnackbar } from 'notistack';
import { useStore } from '/utils/StoreProvider';

const debounce = require('lodash/debounce');

const NavHead = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  @media only screen and (max-width: ${breakpoint_md}px) {
    flex-direction: column;
    justify-content: flex-start;
  }
`;

const MenuWrapper = styled.div`
  display: flex;
  align-items: center;
  @media only screen and (max-width: ${breakpoint_md}px) {
    margin-top: 20px;
    margin-bottom: 20px;
    flex-wrap: wrap;
  }
`;

const MenuItemText = styled.span`
  cursor: pointer;
  :hover {
    font-weight: bold;
  }
`;

function MenuItem(props) {
  const elementId = props.elementId;
  return (
    <MenuItemText
      className="py-4 px-4 text-black text-xl"
      onClick={() => {
        if (elementId) {
          const ele = document.getElementById(elementId);
          ele?.scrollIntoView({behavior: "smooth"});
        }
        props.onClick && props.onClick();
      }}
    >
      {props.children}
    </MenuItemText>
  );
}

const NavBar = () => {
  const { enqueueSnackbar } = useSnackbar();
  const store = useStore();
  const clearListenersFuncRef = useRef(null);
  const [accountName, setAccountName] = useState(null);

  useEffect(() => {
    if (web3Modal.cachedProvider) {
      connect();
    }

    return () => {
      clearListenersFuncRef.current && clearListenersFuncRef.current();
    };
  }, []);

  const connect = async () => {
    try {
      const {provider, signer, web3Instance} = await connectWallet();
      const accounts = await provider.listAccounts();
      const network = await provider.getNetwork();
      const address = await signer.getAddress();
      
      // const avatar = await provider.getAvatar(address);
      // console.log('accounts:', accounts);
      // console.log('network:', network);
      // console.log('address:', address);
      // console.log('ens:', ens);
      // console.log('avatar:', avatar);
      
      if (network.chainId != CHAIN_ID) {
        const currentChainName = getChainName(network.chainId);
        const supportChainName = getChainName(CHAIN_ID);
        enqueueSnackbar(`不支持当前连接的${currentChainName}网络，请切换到${supportChainName}网络`, {variant: 'error'});
        disconnect();
        return;
      }

      try {
        const ens = await provider.lookupAddress(address);
        setAccountName(ens || formatAddress(address));
      } catch (error) {
        setAccountName(formatAddress(address));
      }

      store.updateState(address);

      if (web3Instance?.on) {
        console.log('provider on add event listener')
        const handleAccountsChanged = async (accounts) => {
          console.log('accounts changed:', accounts);
          if (accounts.length > 0) {
            const address = accounts[0];
            try {
              const ens = await provider.lookupAddress(address);
              const avatar = await provider.getAvatar(address);
              setAccountName(ens || formatAddress(address));
            } catch (error) {
              console.log('lookupAddress error:', error);
              setAccountName(formatAddress(address));
            }
            store.updateState(address);
          } else {
            disconnect();
          }
          
        };
    
        const handleChainChanged = debounce((chainIdStr) => {
          const chainId = Number(chainIdStr);
          if (chainId !== CHAIN_ID) {
            const currentChainName = getChainName(chainId);
            const supportChainName = getChainName(CHAIN_ID);
            disconnect();
            enqueueSnackbar(`不支持当前连接的${currentChainName}网络，请切换到${supportChainName}网络`, {variant: 'error'});
          }
        }, 1000);
    
        const handleDisconnect = debounce((error) => {
          enqueueSnackbar('Network is disconnected', {variant: 'error'});
        }, 1000);
    
        web3Instance.on("accountsChanged", handleAccountsChanged);
        web3Instance.on("chainChanged", handleChainChanged);
        web3Instance.on("disconnect", handleDisconnect);

        clearListenersFuncRef.current = () => {
          if (web3Instance?.removeListener) {
            console.log('provider on remove event listener')
            web3Instance.removeListener("accountsChanged", handleAccountsChanged);
            web3Instance.removeListener("chainChanged", handleChainChanged);
            web3Instance.removeListener("disconnect", handleDisconnect);
          }
        };
      }
    } catch (error) {
      console.log('error:', error);
      disconnect();
      enqueueSnackbar('Error connecting to wallet: ' + error, {variant: 'error'});
    }
  };

  const disconnect = async () => {
    try {
      await disconnectWallet();
      store.updateState('');
      setAccountName(null);
    } catch (error) {
      console.log('error:', error);
      enqueueSnackbar('Error disconnecting from wallet: ' + error, {variant: 'error'});
    }
  }



  return (
    <NavHead className="w-full px-8 py-5">
      <Link href="/">
        <span>
          <Image
            src={MainIconImage}
            alt="Picture of the author"
            width={40}
            height={40}
          />
          <h2 className='inline-block text-3xl text-black font-bold italic ml-2 align-top'>unicorn nft</h2>
        </span>
      </Link>
      <MenuWrapper>
        <MenuItem elementId="mint">Mint铸造</MenuItem>
        <MenuItem elementId="faq">问与答</MenuItem>
      </MenuWrapper>
      <div>
        <Link href="https://github.com/zhima/unicorn-next">
          <GitHubIcon 
            className="mx-4"
            fontSize='large'
          />
        </Link>
        
        {accountName ? (
          <Chip 
            label={accountName}
            color="secondary"
            onDelete={disconnect}
          />
        ) : (
          <Chip 
            label="连接钱包"
            color="primary"
            onClick={connect}
          />
        )}
        
      </div>
      
    </NavHead>
  )
}

export default NavBar;