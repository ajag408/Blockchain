import { ethers } from "ethers";
import { useEffect, useState } from "react";
import deploy from "./deploy";
import Escrow from "./Escrow";
import { Alchemy, Network } from "alchemy-sdk";
import EscrowContract from "./artifacts/contracts/Escrow.sol/Escrow.json";

const provider = new ethers.providers.Web3Provider(window.ethereum);

const config = {
  apiKey: process.env.REACT_APP_SEPOLIA_API_KEY,
  network: Network.ETH_SEPOLIA,
};

const alchemy = new Alchemy(config);

export async function approve(escrowContract, signer) {
  try {
    const approveTxn = await escrowContract.connect(signer).approve();
    alert("Approval in process");
    await approveTxn.wait();
  } catch (e) {
    console.log(e);
    alert("Make sure you are currently connected with arbiter's wallet");
  }
}

function App() {
  const [escrows, setEscrows] = useState([]);
  const [wallet, setWallet] = useState();
  const [signer, setSigner] = useState();

  useEffect(() => {
    //connect up provider and get currently deployed escrow contract instances by a specified address
    async function getAccounts() {
      const accounts = await provider.send("eth_requestAccounts", []);
      // console.log("accounts: ", accounts);

      setWallet(accounts[0]);
      setSigner(provider.getSigner());

      var currentEscrows = [];

      const transfers = [];

      // Paginate through the results using getAssetTransfers method
      let response = await alchemy.core.getAssetTransfers({
        fromBlock: "0x0",
        toBlock: "latest", // Fetch results up to the latest block
        fromAddress: "0x765077Bbd9a94A9294E475d8CB22A92274992C93", // Filter results to only include transfers from the specified address
        excludeZeroValue: false, // Include transfers with a value of 0
        category: ["external"], // Filter results to only include external transfers
      });
      transfers.push(...response.transfers);

      // Continue fetching and aggregating results while there are more pages
      while (response.pageKey) {
        let pageKey = response.pageKey;
        response = await alchemy.core.getAssetTransfers({
          fromBlock: "0x0",
          toBlock: "latest",
          fromAddress: "0x765077Bbd9a94A9294E475d8CB22A92274992C93",
          excludeZeroValue: false,
          category: ["external"],
          pageKey: pageKey,
        });
        transfers.push(...response.transfers);
      }

      // Filter the transfers to only include contract deployments (where 'to' is null)
      const deployments = transfers.filter((transfer) => transfer.to === null);
      const txHashes = deployments.map((deployment) => deployment.hash);

      // Fetch the transaction receipts for each of the deployment transactions
      const promises = txHashes.map((hash) =>
        alchemy.core.getTransactionReceipt(hash)
      );

      // Wait for all the transaction receipts to be fetched
      const receipts = await Promise.all(promises);
      const contractAddresses = receipts.map(
        (receipt) => receipt?.contractAddress
      );

      //connect to already deployed contracts
      for (var i = 0; i < contractAddresses.length; i++) {
        const this_contract = new ethers.Contract(
          contractAddresses[i],
          EscrowContract.abi,
          provider
        );

        const arbiter = await this_contract.arbiter();
        const beneficiary = await this_contract.beneficiary();
        const balance = await provider.getBalance(contractAddresses[i]);

        let approved = await this_contract.isApproved();

        // if (approved) {
        //   approved = "True";
        // } else {
        //   approved = "False";
        // }

        const escrow = {
          address: contractAddresses[i],
          arbiter,
          beneficiary,
          value: ethers.utils.formatEther(balance).toString(),
          approved,
          handleApprove: async () => {
            this_contract.on("Approved", () => {
              document.getElementById(this_contract.address).className =
                "complete";
              document.getElementById(this_contract.address).innerText =
                "✓ It's been approved!";
            });

            await approve(this_contract, signer);
          },
        };

        console.log("approved?: ", escrow.approved);

        currentEscrows.push(escrow);
      }
      setEscrows(currentEscrows);
    }

    getAccounts();
  }, [wallet]);

  async function newContract() {
    const beneficiary = document.getElementById("beneficiary").value;
    const arbiter = document.getElementById("arbiter").value;
    //catch new contract deposit amount error
    try {
      // const value = ethers.BigNumber.from(document.getElementById("wei").value);
      const value = ethers.utils.parseUnits(
        document.getElementById("eth").value
      );
      //catch arbiter and beneficiary address errors
      try {
        var escrowContract = await deploy(signer, arbiter, beneficiary, value);
        alert("Escrow deployment in progress");

        await escrowContract.deployed();

        const escrow = {
          address: escrowContract.address,
          arbiter,
          beneficiary,
          value: ethers.utils.formatEther(value).toString(),
          approved: false,
          handleApprove: async () => {
            escrowContract.on("Approved", () => {
              document.getElementById(escrowContract.address).className =
                "complete";
              document.getElementById(escrowContract.address).innerText =
                "✓ It's been approved!";
            });

            await approve(escrowContract, signer);
          },
        };

        setEscrows([...escrows, escrow]);
      } catch (e) {
        console.log(e);
        alert(
          "Make sure arbiter and beneficiary addresses are valid; and that you have enough funds to deposit"
        );
      }
    } catch (e) {
      console.log(e);
      alert("Enter a valid deposit value in eth");
    }
  }

  return (
    <>
      <div className="contract">
        <h1> New Contract </h1>
        <label>
          Arbiter Address
          <input type="text" id="arbiter" />
        </label>

        <label>
          Beneficiary Address
          <input type="text" id="beneficiary" />
        </label>

        <label>
          Deposit Amount (in Eth)
          <input type="text" id="eth" />
        </label>

        <div
          className="button"
          id="deploy"
          onClick={(e) => {
            e.preventDefault();

            newContract();
          }}
        >
          Deploy
        </div>
      </div>

      <div className="existing-contracts">
        <h1> Existing Contracts </h1>

        <div id="container">
          {escrows.map((escrow) => {
            return <Escrow key={escrow.address} {...escrow} />;
          })}
        </div>
      </div>
    </>
  );
}

export default App;
