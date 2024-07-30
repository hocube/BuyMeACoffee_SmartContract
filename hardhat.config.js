require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
const BAOBAB_URL = process.env.BAOBAB_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.18",
  defaultNetwork: "hardhat",
  networks: {
    baobab: {
      url: BAOBAB_URL,
      accounts: [PRIVATE_KEY],
    }
  }
};
