const hre = require("hardhat");

const buyMeACoffeAddress = "0x2E1EC460bFec17a88E17e1AAB1216ed802E2A874";
const deployerAddress = "0x9520E660BeD40D191e1c4A0AF772bf7eE480e90F";

async function getBalance(address) {
    const balanceBigInt = await hre.ethers.provider.getBalance(address);
    return hre.ethers.utils.formatEther(balanceBigInt)
}

async function main() {
  
  const signer = await hre.ethers.getSigner(deployerAddress);
  const BuyMeACoffee = await hre.ethers.getContractAt("BuyMeACoffee", buyMeACoffeAddress, signer);

  const balanceBefore = await getBalance(signer.address);
  const contractBalance = await getBalance(BuyMeACoffee.address);
  console.log(`Owner balance before withdrawing tips: ${balanceBefore} KLAY`);
  console.log(`Contract balance before withdrawing tips:  ${contractBalance} KLAY`);

    if (contractBalance !== "0.0") {
        console.log("withdrawing funds..")
        const withdrawCoffeTxn = await BuyMeACoffee.withdrawCoffeTips();
        await withdrawCoffeTxn.wait();
        const balanceAfter = await getBalance(signer.address);
        console.log(`Owner balance after withdrawing tips ${balanceAfter} KLAY`);
      } else {
        console.log("no funds to withdraw!");
      }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
