import { ethers } from "ethers";
import { useEffect, useState } from "react";
import deploy from "./deploy";
import Escrow from "./Escrow";

// const provider = new ethers.providers.JsonRpcProvider(
//   process.env.REACT_APP_SEPOLIA_URL
// );

const provider = new ethers.providers.Web3Provider(window.ethereum);

let privateKey = process.env.REACT_APP_PRIVATE_KEY;

let arbKey = process.env.REACT_APP_ARBITER;

let myWallet = new ethers.Wallet(privateKey, provider);

let myArbiter = new ethers.Wallet(arbKey, provider);

export async function approve(escrowContract, signer) {
  const approveTxn = await escrowContract.connect(signer).approve();
  await approveTxn.wait();
}

function App() {
  const [escrows, setEscrows] = useState([]);
  const [wallet, setWallet] = useState();
  const [signer, setSigner] = useState();

  useEffect(() => {
    async function getAccounts() {
      setWallet(myWallet);
      setSigner(myArbiter);

      // const accounts = await provider.send("eth_requestAccounts", []);
      // setWallet(accounts[0]);
      // setSigner(provider.getSigner());
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
        var escrowContract = await deploy(wallet, arbiter, beneficiary, value);
        alert("Escrow deployment in progress");

        await escrowContract.deployed();

        const escrow = {
          address: escrowContract.address,
          arbiter,
          beneficiary,
          value: ethers.utils.formatEther(value).toString(),
          handleApprove: async () => {
            alert("Approval in process");
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
