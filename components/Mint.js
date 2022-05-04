import React, {useState} from 'react';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import SendIcon from '@mui/icons-material/Send';
import LoadingButton from '@mui/lab/LoadingButton';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import ShowMessageDialog from '/components/ShowMessageDialog';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import Box from '@mui/material/Box';

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

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Mint = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);

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

  const handleClick = () => {
    setOpen(true);
    // setIsLoading(true);
    // setTimeout(() => {
    //   setIsLoading(false);
    // }, 2000);
    // ShowMessageDialog({
    //   type: 'success',
    //   title: "铸造成功",
    //   body: (
    //     <div>
    //       <a
    //         href="https://etherscan.io"
    //         target="_blank"
    //         rel="noreferrer"
    //       >
    //         点击查看交易详情
    //       </a>
    //       {" "}或者到{" "}
    //       <a
    //         href="https://etherscan.io"
    //         target="_blank"
    //         rel="noreferrer"
    //       >
    //         OpenSea 查看
    //       </a>
    //     </div>
    //   )
    // });
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  return (
    <div id='mint' className="w-full min-h-screen bg-[#f8f9fa]	 flex flex-col items-center justify-start">
      <h2 className='text-yellow-700 text-5xl font-bold mt-10'>
        Mint 铸造
      </h2>
      <p className='bg-[#d3e5ec] border-2 border-[#bbd9e2] rounded-md w-1/2 text-center mt-8 h-12 leading-10'>
        每个售价0.01ETH，每个钱包最多可铸造2个NFT。
      </p>
      <div className="flex flex-col items-center justify-center flex-1 p-6 m-10 w-1/2 bg-clip-border bg-white border-2 border-gray rounded-xl border-dashed">
        <Stack spacing={2} direction="row" alignItems="center">
          <span className='text-black '>
            铸造进度：
          </span>
          <Box sx={{ minWidth: 250 }}>
            <BorderLinearProgress variant="determinate" value={50} />
          </Box>
          <span className='text-black '>
            10/1000
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
            onClick={handleClick}
          >
            +
          </button>
        </Stack>
        <button
          className='inline-block mt-8 p-3 rounded-md bg-[#eee] text-[#999] cursor-not-allowed'
          disabled
        >
          请先连接钱包
        </button>
        <p className='text-center text-black my-4'>
          请移步到{" "}
          <a
            className='text-2xl font-bold text-blue-600'
            href='https://opensea.io'
            target={'_blank'}
            rel="noreferrer"
          >
            OpenSea
          </a> 
          {" "}上查看
        </p>
      </div>

      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
          This is a errpr message!
        </Alert>
      </Snackbar>
    </div>
  )
}

export default Mint