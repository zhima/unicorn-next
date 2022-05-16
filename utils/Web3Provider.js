import WalletConnectProvider from "@walletconnect/web3-provider";
import { ethers } from "ethers";
import Web3Modal from "web3modal";
import ContractABI from '/abi/UniNFT.json';

export const CHAIN_ID = Number(process.env.NEXT_PUBLIC_CHAIN_ID);

const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider, // required
    options: {
      infuraId: process.env.NEXT_PUBLIC_INFURA_PROJECT_ID // required
    }
  }
};

export let web3Modal;
if (typeof window !== 'undefined') {
  web3Modal = new Web3Modal({
    network: CHAIN_ID === 1 ? "mainnet" : "rinkeby", // optional
    cacheProvider: true, // optional
    providerOptions // required
  });
}

let provider;
let signer;
let instance;
let contract;

export async function connectWallet() {
  if (!instance) {
    instance = await web3Modal.connect();
    provider = new ethers.providers.Web3Provider(instance);
    signer = provider.getSigner();
    contract = new ethers.Contract(
      process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
      ContractABI.abi,
      signer
    );
  }
  return {provider, signer, contract, web3Instance: instance};
}

export async function disconnectWallet() {
  provider = null;
  signer = null;
  instance = null;
  contract = null;
  await web3Modal.clearCachedProvider();
}

export function getWeb3Instance() {
  return instance;
}

export function getProvider() {
  return provider;
}

export function getContract() {
  return contract;
}