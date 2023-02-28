const CONTRACT_ADDR = "0x022728AC5F82A00B21c81bCCFC37277A254A0093";

async function main() {
  const contract = await hre.ethers.getContractAt("EmitWinner", CONTRACT_ADDR);

  const tx = await contract.emitWinner(
    "0xcf469d3beb3fc24cee979eff83be33ed50988502"
  );

  await tx.wait();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
