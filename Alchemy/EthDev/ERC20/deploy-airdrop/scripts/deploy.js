require("dotenv").config();
const { ethers } = require("hardhat");

async function main() {
  const Rajaji = await ethers.getContractFactory("Rajaji");
  const rajaji = await Rajaji.deploy();

  await rajaji.deployed();

  console.log("Token deployed to:", rajaji.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
