
export const breakpoint_md = 1024;

export function formatAddress(address) {
  return `${address.substring(0, 6)}...${address.substring(
    address.length - 4
  )}`;
}

export function getChainName(chainId) {
  switch (chainId) {
    case 1: return "以太坊 Ethereum";
    case 4: return "Rinkeby";
    case 56: return "币安智能链";
    case 137: return "Polygon";
    default: return "Unknown";
  }
}