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
async function question(query) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise(resolve => rl.question(query, ans => {
    rl.close();
    resolve(ans);
  }));
}
async function initSIWE(address, userAgent, caId) {
  try {
    const response = await axios.post(
      'https://privy.babylon.market/api/v1/siwe/init',
      { address },
      {
        headers: {
          'accept': 'application/json',
          'accept-language': 'en-US,en;q=0.9',
          'content-type': 'application/json',
          'privy-app-id': PRIVY_APP_ID,
          'privy-ca-id': caId,
          'privy-client': 'react-auth:3.7.0',
          'origin': 'https://babylon.market',
          'referer': 'https://babylon.market/',
          'user-agent': userAgent,
          'sec-ch-ua': '"Chromium";v="142", "Brave";v="142", "Not_A Brand";v="99"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"Windows"',
          'sec-fetch-dest': 'empty',
          'sec-fetch-mode': 'cors',
          'sec-fetch-site': 'same-site',
        }
      }
    );
    return response.data;
  } catch (error) {
    logger.error(`Failed to init SIWE: ${error.message}`);
    throw error;
  }
}
async function authenticateSIWE(message, signature, userAgent, caId) {
  try {
    const response = await axios.post(
      'https://privy.babylon.market/api/v1/siwe/authenticate',
      {
        message,
        signature,
        chainId: 'eip155:1',
        walletClientType: 'metamask',
        connectorType: 'injected',
        mode: 'login-or-sign-up'
      },
      {
        headers: {
          'accept': 'application/json',
          'accept-language': 'en-US,en;q=0.9',
          'content-type': 'application/json',
          'privy-app-id': PRIVY_APP_ID,
          'privy-ca-id': caId,
          'privy-client': 'react-auth:3.7.0',
          'origin': 'https://babylon.market',
          'referer': 'https://babylon.market/',
          'user-agent': userAgent,
          'sec-ch-ua': '"Chromium";v="142", "Brave";v="142", "Not_A Brand";v="99"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"Windows"',
          'sec-fetch-dest': 'empty',
          'sec-fetch-mode': 'cors',
          'sec-fetch-site': 'same-site',
        }
      }
    );
    return response.data;
  } catch (error) {
    logger.error(`Failed to authenticate: ${error.message}`);
    throw error;
  }
}
async function generateProfile(userAgent, token) {
  try {
    const response = await axios.get(
      'https://babylon.market/api/onboarding/generate-profile',
      {
        headers: {
          'accept': '*/*',
          'accept-language': 'en-US,en;q=0.9',
          'cookie': `privy-token=${token}`,
          'referer': 'https://babylon.market/',
          'user-agent': userAgent,
          'sec-ch-ua': '"Chromium";v="142", "Brave";v="142", "Not_A Brand";v="99"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"Windows"',
          'sec-fetch-dest': 'empty',
          'sec-fetch-mode': 'cors',
          'sec-fetch-site': 'same-origin',
        }
      }
    );
    return response.data;
  } catch (error) {
    const name = generateRandomName();
    return {
      name: name,
      username: name.toLowerCase(),
      bio: generateRandomBio()
    };
  }
}
async function checkUsername(username, userAgent, token) {
  try {
    const response = await axios.get(
      `https://babylon.market/api/onboarding/check-username?username=${username}`,
      {
        headers: {
          'accept': '*/*',
          'accept-language': 'en-US,en;q=0.9',
          'cookie': `privy-token=${token}`,
          'referer': 'https://babylon.market/',
          'user-agent': userAgent,
        }
      }
    );
    return response.data.available;
  } catch (error) {
    return false;
  }
}

async function signupUser(userData, token, userAgent) {
  try {
    const response = await axios.post(
      'https://babylon.market/api/users/signup',
      userData,
      {
        headers: {
          'accept': '*/*',
          'accept-language': 'en-US,en;q=0.9',
          'content-type': 'application/json',
          'cookie': `privy-token=${token}`,
          'referer': 'https://babylon.market/',
          'user-agent': userAgent,
          'sec-ch-ua': '"Chromium";v="142", "Brave";v="142", "Not_A Brand";v="99"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"Windows"',
          'sec-fetch-dest': 'empty',
          'sec-fetch-mode': 'cors',
          'sec-fetch-site': 'same-origin',
        }
      }
    );
    return response.data;
  } catch (error) {
    logger.error(`Failed to signup: ${error.message}`);
    throw error;
  }
}
async function markWaitlist(userId, referralCode, token, userAgent) {
  try {
    const response = await axios.post(
      'https://babylon.market/api/waitlist/mark',
      { userId, referralCode },
      {
        headers: {
          'accept': '*/*',
          'accept-language': 'en-US,en;q=0.9',
          'content-type': 'application/json',
          'authorization': `Bearer ${token}`,
          'cookie': `privy-token=${token}`,
          'referer': 'https://babylon.market/',
          'user-agent': userAgent,
          'sec-ch-ua': '"Chromium";v="142", "Brave";v="142", "Not_A Brand";v="99"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"Windows"',
          'sec-fetch-dest': 'empty',
          'sec-fetch-mode': 'cors',
          'sec-fetch-site': 'same-origin',
        }
      }
    );
    return response.data;
  } catch (error) {
    logger.warn(`Failed to mark waitlist: ${error.message}`);
    return null;
  }
}
async function getWaitlistPosition(userId, userAgent) {
  try {
    const response = await axios.get(
      `https://babylon.market/api/waitlist/position?userId=${userId}`,
      {
        headers: {
          'user-agent': userAgent,
        }
      }
    );
    return response.data;
  } catch (error) {
    return null;
  }
}

async function saveWallet(walletData) {
  try {
    let wallets = [];
    try {
      const data = await fs.readFile(WALLETS_FILE, 'utf8');
      wallets = JSON.parse(data);
    } catch (error) {
    }
    
    wallets.push(walletData);
    await fs.writeFile(WALLETS_FILE, JSON.stringify(wallets, null, 2));
    logger.success(`Wallet saved to ${WALLETS_FILE}`);
  } catch (error) {
    logger.error(`Failed to save wallet: ${error.message}`);
  }
}
async function registerAccount(referralCode) {
  const userAgent = getRandomUserAgent();
  const caId = generateCAID();
  
  try {
    logger.loading('Creating new wallet...');
    const wallet = ethers.Wallet.createRandom();
    logger.info(`Address: ${wallet.address}`);

    logger.loading('Initializing SIWE...');
    const siweData = await initSIWE(wallet.address, userAgent, caId);
    logger.info(`Nonce: ${siweData.nonce.substring(0, 10)}...`);

    const siweMessage = `babylon.market wants you to sign in with your Ethereum account:
${wallet.address}

By signing, you are proving you own this wallet and logging in. This does not initiate a transaction or cost any fees.

URI: https://babylon.market
Version: 1
Chain ID: 1
Nonce: ${siweData.nonce}
Issued At: ${new Date().toISOString()}
Resources:
- https://privy.io`;

    logger.loading('Signing message...');
    const signature = await wallet.signMessage(siweMessage);
    logger.info(`Signature: ${signature.substring(0, 20)}...`);

    logger.loading('Authenticating...');
    const authData = await authenticateSIWE(siweMessage, signature, userAgent, caId);
    const token = authData.token;
    const userId = authData.user.id;
    
    logger.success('Authentication successful!');
    logger.info(`User ID: ${userId}`);

    await delay(1000);

    logger.loading('Generating profile...');
    const profileData = await generateProfile(userAgent, token);
    logger.info(`Generated username: ${profileData.username}`);

    let username = profileData.username;
    let isAvailable = await checkUsername(username, userAgent, token);
    
    if (!isAvailable) {
      username = `${username}_${Math.floor(Math.random() * 9999)}`;
      logger.warn(`Username taken, using: ${username}`);
    }
   logger.loading('Signing up user...');
   const signupData = {
     username: username,
     displayName: profileData.name || username,
     bio: profileData.bio || generateRandomBio(),
     profileImageUrl: `https://babylon.market/assets/user-profiles/profile-${profileImageIndex}.jpg`,
     coverImageUrl: `https://babylon.market/assets/user-banners/banner-${bannerIndex}.jpg`,
     importedFrom: null,
     twitterId: null,
     twitterUsername: null,
     farcasterFid: null,
     farcasterUsername: null,
     tosAccepted: true,
     privacyPolicyAccepted: true,
     referralCode: referralCode,
     identityToken: authData.identity_token
   };
   
   const signupResult = await signupUser(signupData, token, userAgent);
   logger.success(`User created: @${username}`);

   await delay(1500);

   logger.loading('Joining waitlist...');
   const waitlistData = await markWaitlist(userId, referralCode, token, userAgent);
   
   if (waitlistData) {
     logger.success(`Waitlist position: ${waitlistData.waitlistPosition}`);
     logger.success(`Points earned: ${waitlistData.points}`);
     logger.success(`Invite code: ${waitlistData.inviteCode}`);
   }

   await delay(1000);
   const position = await getWaitlistPosition(userId, userAgent
    const profileImageIndex = getRandomProfileImage();
    const bannerIndex = getRandomBannerImage();
    const walletData = {
      address: wallet.address,
      privateKey: wallet.privateKey,
      mnemonic: wallet.mnemonic.phrase,
      username: username,
      userId: userId,
      referralCode: referralCode,
      inviteCode: waitlistData?.inviteCode || username,
      points: position?.points || waitlistData?.points || 0,
      waitlistPosition: position?.waitlistPosition || waitlistData?.waitlistPosition || 'Unknown',
      createdAt: new Date().toISOString()
    };
    
    await saveWallet(walletData);
    
    logger.success('✅ Registration completed successfully!\n');
    
    return walletData;
    
  } catch (error) {
    logger.error(`Registration failed: ${error.message}`);
    if (error.response?.data) {
      logger.error(`Response: ${JSON.stringify(error.response.data)}`);
    }
    return null;
  }
}
async function main() {
  logger.banner();
  
  try {
    const refCode = await question(`${colors.white}Enter referral code : ${colors.reset}`);
    const referralCode = refCode.trim() || 'vikitoshi';
    logger.info(`Using referral code: ${referralCode}`);

    const numAccountsInput = await question(`${colors.white}How many accounts to create? ${colors.reset}`);
    const numAccounts = parseInt(numAccountsInput) || 1;
    
    logger.info(`Creating ${numAccounts} account(s)...\n`);
    
    let successCount = 0;
    let failCount = 0;
    
    for (let i = 1; i <= numAccounts; i++) {
      logger.info(`${colors.yellow}[Account ${i}/${numAccounts}]${colors.reset}`);
      
      const result = await registerAccount(referralCode);
      
      if (result) {
        successCount++;
        logger.success(`Account ${i} created successfully!`);
      } else {
        failCount++;
        logger.error(`Account ${i} failed!`);
      }

      if (i < numAccounts) {
        const delayTime = 3000 + Math.random() * 2000;
        logger.loading(`Waiting ${(delayTime / 1000).toFixed(1)}s before next account...`);
        await delay(delayTime);
      }
    }
