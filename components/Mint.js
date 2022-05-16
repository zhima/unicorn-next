import React, {useEffect, useState, useCallback} from 'react';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import LoadingButton from '@mui/lab/LoadingButton';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import ShowMessageDialog from '/components/ShowMessageDialog';
import Link from '@mui/material/Link';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import Box from '@mui/material/Box';
import { useSnackbar } from 'notistack';
import {default as cns} from "classnames";
import { useSelector } from 'react-redux';
import {getContract} from '/utils/Web3Provider';
const { MerkleTree } = require('merkletreejs');
import { ethers } from "ethers";
const { keccak256 } = ethers.utils;

const debounce = require('lodash/debounce');

const accounts = [
  '0xaE8BE7d8dB019B104156790A99bc46E25e9650c1',
  '0x4f5B321a30026578C35e0c80Cfa5568979E8c604'
]

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
  const app = useSelector(({ app }) => app);
  const { enqueueSnackbar } = useSnackbar();

  const isConnected = Boolean(app.accountAddr);


  useEffect(() => {
    if (isConnected) {
      const contract = getContract();

      const refresh = async () => {
        const curStatus = await contract.status();
        setStatus(curStatus);
        const curUserNumberMinted = await contract.numberMinted(app.accountAddr);
        setCurUserNumberMinted(curUserNumberMinted);

        const totalMinted = parseInt(await contract.totalSupply());
        const maxSupply = parseInt(await contract.MAX_SUPPLY());
        setProgress(totalMinted);
        setMaxSupply(maxSupply);

      };

      refresh();

      const onMinted = debounce(async (minter, amount) => {
        console.log('onMinted minter:', minter);
        console.log('onMinted amount:', amount.toNumber());
        const contract = getContract();
        const curUserNumberMinted = await contract.numberMinted(app.accountAddr);
        const totalMinted = parseInt(await contract.totalSupply());
        setCurUserNumberMinted(curUserNumberMinted);
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
  }, [app.accountAddr])
  

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

  const onClickMint = useCallback(async () => {
    setIsLoading(true);
    const contract = getContract();
    try {
      if (status == 1) {
        const leaves = accounts.map(account => keccak256(account));
        const tree = new MerkleTree(leaves, keccak256, { sort: true });
        const merkleProof = tree.getHexProof(keccak256(app.accountAddr));
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
      //处理超出数量的 error、不在白名单的 error xxxxx
      console.log('Mint error:', error.message);
      const errMsg = error.message;
      if (errMsg) {
        if (errMsg.includes('UC-N: exceed the max limit of each account')) {
          enqueueSnackbar('铸造的数量超出每个账号的最大限制', {variant: 'error'});
        } else if (errMsg.includes('')) {
  
        }
      }
      
    }
    setIsLoading(false);
  }, [status, app.accountAddr, quantity]);

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
        <Stack spacing={2} direction="row" alignItems="center">
          <span className='text-black text-xs lg:text-base'>
            铸造进度：
          </span>
          <Box sx={{ minWidth: 150 }}>
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
            (disabled | isLoading) ? 'bg-[#eee] text-[#999] cursor-not-allowed' : 'bg-blue-600 text-white'  
          )}
          onClick={onClickMint}
          disabled={disabled}
        >
          
          {isLoading ? (
            <CircularProgress sx={{ color: 'grey.600' }} size={'1.3rem'} />
          ) : mintButtonText}
        </button>
        {/* <LoadingButton
          size="large"
          sx={{
            m: 4,
            width: 180,
            color: 'primary.main'
          }}
          onClick={onClickMint}
          loading={isLoading}
          variant="contained"
          disabled={disabled}
        >
          {mintButtonText}
        </LoadingButton> */}
        <p className='text-center text-black my-4'>
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

      {/* <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop> */}
    </div>
  )
}

export default Mint