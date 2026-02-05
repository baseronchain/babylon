# Babylon Auto - Airdrop Insiders

This Node.js automation script is designed for bulk account registration on the Babylon Market platform. It handles the complete onboarding workflow, including wallet generation, SIWE authentication, profile setup, and waitlist registration.

## Features

* **Automated Wallet Generation**: Creates unique Ethereum wallets for every account session using ethers.js.
* **SIWE Authentication**: Implements the Sign-In with Ethereum protocol, including message signing and token-based authentication.
* **Randomized Profile Setup**: Generates random usernames, bios, and selects profile/banner images to create unique account identities.
* **Waitlist Automation**: Automatically joins the waitlist using a specified referral code and retrieves current points and position.
* **Detection Evasion**: Uses randomized User-Agents and includes artificial delays between account creations to mimic human behavior.
* **Output Logging**: Saves all account credentials, including private keys and mnemonics, to a local JSON file.

## Prerequisites

* Node.js (LTS Version recommended)
* NPM

## Installation

1. **Clone the Repository**
```bash
git clone https://github.com/your-username/babylon-auto.git
cd babylon-auto

```


2. **Install Dependencies**
The project requires axios and ethers.
```bash
npm install

```



## Usage

Start the program by running:

```bash
node index.js

```

### Configuration Steps:

1. **Referral Code**: Enter the referral code when prompted (Defaults to 'vikitoshi' if none provided).
2. **Account Quantity**: Specify how many accounts you wish to create.
3. **Execution**: The script will initialize the process, showing status updates for initialization, signing, and registration for each account.

## Data Persistence

All generated account data is saved to `wallets.json`. Each entry includes:

* Wallet address and private key.
* Mnemonic phrase.
* Generated username and user ID.
* Waitlist position and points earned.

## Disclaimer

This software is for educational purposes only. Users are responsible for complying with the Terms of Service of the target platform. The developers assume no liability for account bans or restrictions.

---

**Developed with love

---

Would you like me to show you how to add a proxy rotation feature to this script?
