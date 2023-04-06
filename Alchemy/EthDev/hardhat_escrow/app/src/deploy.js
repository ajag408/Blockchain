import { ethers } from "ethers";
import Escrow from "./artifacts/contracts/Escrow.sol/Escrow";

export default async function deploy(signer, arbiter, beneficiary, value) {
  try {
    const factory = new ethers.ContractFactory(
      Escrow.abi,
      Escrow.bytecode,
      signer
    );

    return factory.deploy(arbiter, beneficiary, { value });
  } catch (e) {
    console.log(e);
  }
}
