import React, {useEffect, useState, useCallback} from 'react';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import CircularProgress from '@mui/material/CircularProgress';
import ShowMessageDialog from '/components/ShowMessageDialog';
import Link from '@mui/material/Link';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import Box from '@mui/material/Box';
import { useSnackbar } from 'notistack';
import {default as cns} from "classnames";
import { useStore } from '/utils/StoreProvider';
import {getContract} from '/utils/Web3Provider';
import { ethers } from "ethers";
import { observer } from 'mobx-react-lite';

const debounce = require('lodash/debounce');

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: theme.palette.mode === 'light' ? '#1a90ff' : '#308fe8',
  },
}));

const Mint = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [status, setStatus] = useState(0);
  const [curUserNumberMinted, setCurUserNumberMinted] = useState(0);
  const [progress, setProgress] = useState(0);
  const [maxSupply, setMaxSupply] = useState(0);
  const store = useStore();
  const { enqueueSnackbar } = useSnackbar();

  const isConnected = Boolean(store.accountAddr);


  useEffect(() => {
    if (isConnected) {
      const contract = getContract();

      const refresh = async () => {
        const curStatus = await contract.status();
        setStatus(curStatus);
        const numberMinted = await contract.numberMinted(store.accountAddr);
        setCurUserNumberMinted(numberMinted.toNumber());

        const totalMinted = (await contract.totalSupply()).toNumber();
        const maxSupply = (await contract.MAX_SUPPLY()).toNumber();
        setProgress(totalMinted);
        setMaxSupply(maxSupply);

      };

      refresh();

      const onMinted = debounce(async (minter, amount) => {
        console.log('onMinted amount:', amount.toNumber());
        const contract = getContract();
        const numberMinted = await contract.numberMinted(store.accountAddr);
        const totalMinted = (await contract.totalSupply()).toNumber();
        setCurUserNumberMinted(numberMinted.toNumber());
        setProgress(totalMinted);
      }, 1000);
      const onStatusChanged = debounce(async (status) => {
        console.log('onStatusChanged status:', status);
        setStatus(status);
      }, 1000);
      contract.on("Minted", onMinted);
      contract.on("StatusChanged", onStatusChanged);

      return () => {
        contract.off("Minted");
        contract.off("StatusChanged");
      }
    }
  }, [store.accountAddr])
  

  const onAdd = () => {
    setQuantity((prev) => prev + 1);
  }

  const onSubstract = () => {
    setQuantity((prev) => {
      if (prev > 1) {
        return prev - 1;
      }
      return 1;
    });
  }

  const getMerkleProof = async (leaf) => {
    const response = await fetch(`/api/merkleProof?leaf=${leaf}`, {
      method: "GET",
    });

    const respJson = await response.json();
    if (!response.ok) {
      throw new Error(`Error: ${respJson?.msg ?? response.status}`);
    }
    return respJson;
  }

  const onClickMint = useCallback(async () => {
    setIsLoading(true);
    const contract = getContract();
    try {
      if (status == 1) {
        const merkleProof = await getMerkleProof(store.accountAddr);
        const price = 0.02 * quantity;
        const whitelistMintTx = await contract.whitelistMint(merkleProof, quantity,  {value: ethers.utils.parseEther(price.toString())});
        await whitelistMintTx.wait();
      } else {
        const price = 0.02 * quantity;
        const publicMintTx = await contract.mint(quantity,  {value: ethers.utils.parseEther(price.toString())});
        await publicMintTx.wait();
      }
      const etherscanAddr = "https://rinkeby.etherscan.io/address/" + process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
      ShowMessageDialog({
        type: 'success',
        title: "铸造成功",
        body: (
          <div>
            点击查看{" "}
            <Link
              href={etherscanAddr}
              target="_blank"
              rel="noreferrer"
            >
              交易详情
            </Link>
            {" "}或者到{" "}
            <Link
              href="https://testnets.opensea.io/account"
              target="_blank"
              rel="noreferrer"
            >
              OpenSea 
            </Link>
            {" "}查看
          </div>
        )
      });
    } catch (error) {
      console.log('Mint error:', error.message);
      const errMsg = error.message;
      if (errMsg) {
        if (errMsg.includes('UC-N: exceed the max limit of each account')) {
          enqueueSnackbar('铸造的数量超出每个账号的最大限制', {variant: 'error'});
        } else if (errMsg.includes('UC-N: Invalid merkle proof')) {
          enqueueSnackbar('你不在白名单内，无法铸造', {variant: 'error'});
        } else if (errMsg.includes('UC-N: not able to mint yet')) {
          enqueueSnackbar('项目未开始，无法铸造', {variant: 'error'});
        } else if (errMsg.includes('UC-N: exceed the total token amount')) {
          enqueueSnackbar('你要铸造的数量超过了项目总量', {variant: 'error'});
        } else if (errMsg.includes('UC-N: Not engouth ETH sent')) {
          enqueueSnackbar('ETH 不够', {variant: 'error'});
        } else {
          enqueueSnackbar('铸造失败', {variant: 'error'});
        }
      }
      
    }
    setIsLoading(false);
  }, [status, store.accountAddr, quantity]);

  let mintButtonText = '';
  let disabled = true;
  if (isConnected) {
    switch(status) {
      case 0: {
        mintButtonText = "尚未开始";
        break;
      }
      case 3: {
        mintButtonText = "已经结束";
        break;
      }
      default: {
        if (progress >= maxSupply) {
          mintButtonText = "已经售罄";
        }
        else if (curUserNumberMinted >= 5) {
          mintButtonText = "铸造已达上限";
        } else {
          mintButtonText = "铸造";
          disabled = false;
        }
      }
    }
  } else {
    mintButtonText = "请先连接钱包";
  }

  disabled = disabled || isLoading;

  const progressValue = maxSupply > 0 ? progress / maxSupply : 0;

  return (
    <div id='mint' className="w-full min-h-screen bg-[#f8f9fa]	 flex flex-col items-center justify-start">
      <h2 className='text-yellow-700 text-4xl lg:text-5xl font-bold mt-10'>
        Mint 铸造
      </h2>
      <p className='bg-[#d3e5ec] border-2 border-[#bbd9e2] rounded-md w-1/2 text-center text-sm lg:text-base mt-8 h-10 lg:h-12 leading-[2.5rem] lg:leading-[3rem]'>
        每个售价 0.02 ETH，每个钱包最多可铸造 5 个NFT
      </p>
      <div className="flex flex-col items-center justify-center flex-1 p-6 m-10 w-1/2 bg-clip-border bg-white border-2 border-gray rounded-xl border-dashed">
        <Stack className='self-stretch lg:mx-20' spacing={2} direction="row" alignItems="center">
          <span className='text-black text-xs lg:text-base'>
            铸造进度：
          </span>
          <Box sx={{ flex: 1 }}>
            <BorderLinearProgress variant="determinate" value={progressValue} />
          </Box>
          <span className='text-black text-xs lg:text-base'>
            {progress}/{maxSupply}
          </span>
        </Stack>
        <Stack spacing={2} direction="row" className='mt-16'>
          <button 
            className='text-white text-2xl rounded-md  bg-yellow-500 w-8 h-8 flex  justify-center items-center'
            onClick={onSubstract}
          >
            -
          </button>
          <span className='text-md text-black flex justify-center items-center border rounded-md w-20 border-black'>{quantity}</span>
          <button 
            className='text-white text-2xl rounded-md  bg-yellow-500 w-8 h-8 flex  justify-center items-center'
            onClick={onAdd}
          >
            +
          </button>
        </Stack>
        <button
          className={cns(
            'block mt-8 p-3 rounded-md text-center w-44 h-12',
            disabled ? 'bg-[#eee] text-[#999] cursor-not-allowed' : 'bg-blue-600 text-white'  
          )}
          onClick={onClickMint}
          disabled={disabled}
        >
          
          {isLoading ? (
            <CircularProgress sx={{ color: 'grey.600' }} size={'1.3rem'} />
          ) : mintButtonText}
        </button>
        <p className='text-center text-black my-8'>
          请移步到{" "}
          <Link
            href='https://testnets.opensea.io/collection/unicorn-nft-v2'
            target={'_blank'}
            rel="noreferrer"
          >
            OpenSea
          </Link> 
          {" "}上查看已铸造的 NFT 
        </p>
      </div>
    </div>
  )
}

export default observer(Mint);