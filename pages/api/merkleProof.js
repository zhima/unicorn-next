// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const { MerkleTree } = require('merkletreejs');
import { ethers } from "ethers";
const { keccak256 } = ethers.utils;

const accounts = [
  '0xaE8BE7d8dB019B104156790A99bc46E25e9650c1',
  '0x4f5B321a30026578C35e0c80Cfa5568979E8c604',
  '0x340Ed92548068CCC71fC7F668Adda65FAAa3f373'
]

const leaves = accounts.map(account => keccak256(account));
const tree = new MerkleTree(leaves, keccak256, { sort: true });

export default function handler(req, res) {
  const {leaf} = req.query;
  if (leaf) {
    const merkleProof = tree.getHexProof(keccak256(leaf));
    res.status(200).json({ proof: merkleProof });
  } else {
    res.status(400).json({ 
      code: -1,
      msg: "invalid leaf param"
     });
  }
}
