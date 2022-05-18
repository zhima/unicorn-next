import React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Link from '@mui/material/Link';

const FAQ = () => {
  return (
    <div id='faq' className="w-full min-h-screen bg-[#dae7f8]	 flex flex-col items-center">
        <Typography
          style={{ textAlign: "center", marginTop: '2%' }}
          variant="h3"
          gutterBottom
          component="div"
        >
          问与答
        </Typography>

        <div className='my-8 w-1/2'>

          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{
                
                '& .MuiAccordionSummary-root': {
                  
                  backgroundColor: 'red',
                },
              }}
            >
              <Typography>如何连接钱包？</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2">
                请先安装
                <Link
                  href={"https://metamask.io/"}
                  target="_blank"
                  rel="noreferrer"
                >
                {" "}MetaMask {" "}
                </Link>
                小狐狸浏览器插件，安装完成后创建账户，然后点击「连接钱包」按钮，连接成功后，您的账户地址将会显示在页面右上角。
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion style={{ marginTop: 20 }}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
            >
              <Typography>如何铸造本项目NFT？</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2">
                首先需要连接钱包，连接成功后点击铸造按钮进行铸造。
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion style={{ marginTop: 20 }}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
            >
              <Typography>是否有白名单制度？</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2">
                本项目虽然有白名单功能，但目前没有实施，所以可以认为是没有白名单的。
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion style={{ marginTop: 20 }}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
            >
              <Typography>为什么连接钱包后还是无法铸造？</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2">
                项目还没开始或者你的铸造数量已到达上限
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion style={{ marginTop: 20 }}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
            >
              <Typography>为什么铸造后看到的NFT都是一样的图片？</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2">
                因为项目还处于盲盒状态，等开盲盒后就能看到真正的NFT图片了。
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion style={{ marginTop: 20 }}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
            >
              <Typography>为什么开盲盒后在 OpenSea 看到的还是一样的图片？</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2">
                因为 OpenSea 会缓存 NFT 的 metadata 元数据，需要在 OpenSean 上点击进入 NFT 的详情页面，点击右上角的刷新按钮来更新 metadata，等过几分钟就能看到真正的图片了。
              </Typography>
            </AccordionDetails>
          </Accordion>
        </div>
    </div>
  )
}

export default FAQ