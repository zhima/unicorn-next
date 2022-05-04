import React from 'react';
import Image from 'next/image';
import MainIconImage from '../public/favicon.svg';
import GitHubIcon from '@mui/icons-material/GitHub';
import { styled } from '@mui/material/styles';
import {breakpoint_md} from '../utils';
import Chip from '@mui/material/Chip';

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
  return (
    <NavHead className="absolute top-0 left-0 w-full px-8 py-5">
      <a href='/'>
        <Image
          src={MainIconImage}
          alt="Picture of the author"
          width={40}
          height={40}
        />
        <h2 className='inline-block text-3xl text-black font-bold italic ml-2 align-top'>unicorn nft</h2>
      </a>
      <MenuWrapper>
        <MenuItem elementId="mint">Mint铸造</MenuItem>
        <MenuItem elementId="faq">问与答</MenuItem>
      </MenuWrapper>
      <div>
        <a href="https://github.com" className="mx-4">
          <GitHubIcon 
            fontSize='large'
          />
        </a>
        
        <Chip 
          label="连接钱包"
          color="primary"
          onClick={() => {

          }}
        />
      </div>
      
    </NavHead>
  )
}

export default NavBar;