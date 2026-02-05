const axios = require('axios');
const { ethers } = require('ethers');
const fs = require('fs').promises;
const readline = require('readline');

const colors = {
  reset: "\x1b[0m",
  cyan: "\x1b[36m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
  white: "\x1b[37m",
  bold: "\x1b[1m",
  magenta: "\x1b[35m",
};
const logger = {
  info: (msg) => console.log(`${colors.white}[✓] ${msg}${colors.reset}`),
  warn: (msg) => console.log(`${colors.yellow}[⚠] ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}[✗] ${msg}${colors.reset}`),
  success: (msg) => console.log(`${colors.green}[✅] ${msg}${colors.reset}`),
  loading: (msg) => console.log(`${colors.cyan}[→] ${msg}${colors.reset}`),
  banner: () => {
    console.log(`${colors.cyan}${colors.bold}`);
    console.log(`--------------------------------------`);
    console.log(`    Babylon SATSET   `);
    console.log(`--------------------------------------${colors.reset}`);
  },
};
const USER_AGENTS = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:125.0) Gecko/20100101 Firefox/125.0",
];
function getRandomUserAgent() {
  return USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];
}
function generateRandomBio() {
  const bios = [
    "Yolo, but make it blockchain 🦍💸",
    "Web3 enthusiast | Crypto native 🚀",
    "Building the future, one block at a time ⛓️",
    "DeFi maximalist | HODL forever 💎🙌",
    "Exploring the metaverse 🌐✨",
    "NFT collector | Digital artist 🎨",
    "Blockchain believer | Decentralization advocate 🔐",
    "Crypto trader | Market watcher 📈",
    "Smart contract developer | Web3 builder 👨‍💻",
    "Token hunter | Airdrop farmer 🌾"
  ];
  return bios[Math.floor(Math.random() * bios.length)];
}
function generateRandomName() {
  const adjectives = ['Cool', 'Smart', 'Fast', 'Brave', 'Bold', 'Quick', 'Wise', 'Wild', 'Epic', 'Mega'];
  const nouns = ['Tiger', 'Eagle', 'Dragon', 'Wolf', 'Shark', 'Lion', 'Bear', 'Hawk', 'Fox', 'Panther'];
  const numbers = Math.floor(Math.random() * 999);
  return `${adjectives[Math.floor(Math.random() * adjectives.length)]}${nouns[Math.floor(Math.random() * nouns.length)]}${numbers}`;
}
