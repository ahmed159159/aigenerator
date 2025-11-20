import hardhat from "hardhat";
const { ethers } = hardhat;

async function main() {
  const fee = ethers.parseEther("0.0001");
  const ImageFee = await ethers.getContractFactory("ImageFee");
  const imageFee = await ImageFee.deploy(fee);

  await imageFee.waitForDeployment();
  console.log("ImageFee deployed at:", await imageFee.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
