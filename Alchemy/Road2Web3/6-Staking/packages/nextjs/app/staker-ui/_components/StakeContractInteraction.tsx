"use client";

import { ETHToPrice } from "./EthToPrice";
import humanizeDuration from "humanize-duration";
import { useState } from "react";
import { formatEther, parseEther } from "viem";
import { useAccount } from "wagmi";
import { Address, Balance } from "~~/components/scaffold-eth";
import { useDeployedContractInfo, useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { useTargetNetwork } from "~~/hooks/scaffold-eth/useTargetNetwork";
import { useWatchBalance } from "~~/hooks/scaffold-eth/useWatchBalance";
import {  EtherInput } from "../../../components/scaffold-eth";
export const StakeContractInteraction = ({ address }: { address?: string }) => {
  const [sendValue, setSendValue] = useState("");
  const { address: connectedAddress } = useAccount();
  const { data: StakerContract } = useDeployedContractInfo("Staker");
  const { data: ExampleExternalContact } = useDeployedContractInfo("ExampleExternalContract");
  const { data: stakerContractBalance } = useWatchBalance({
    address: StakerContract?.address,
  });
  const { data: exampleExternalContractBalance } = useWatchBalance({
    address: ExampleExternalContact?.address,
  });

  const { targetNetwork } = useTargetNetwork();

  // Contract Read Actions
  // const { data: threshold } = useScaffoldReadContract({
  //   contractName: "Staker",
  //   functionName: "threshold",
  //   watch: true,
  // });
  const { data: rewardRatePerSecond } = useScaffoldReadContract({
    contractName: "Staker",
    functionName: "rewardRatePerSecond",
    watch: true,
  });
  const { data: withdrawalTimeLeft } = useScaffoldReadContract({
    contractName: "Staker",
    functionName: "withdrawalTimeLeft",
    watch: true,
  });
  const { data: claimPeriodLeft } = useScaffoldReadContract({
    contractName: "Staker",
    functionName: "claimPeriodLeft",
    watch: true,
  });
  // const { data: timeLeft } = useScaffoldReadContract({
  //   contractName: "Staker",
  //   functionName: "timeLeft",
  //   watch: true,
  // });
  const { data: myStake } = useScaffoldReadContract({
    contractName: "Staker",
    functionName: "balances",
    args: [connectedAddress],
    watch: true,
  });
  const { data: isStakingCompleted } = useScaffoldReadContract({
    contractName: "ExampleExternalContract",
    functionName: "completed",
    watch: true,
  });
 console.log("hello")

//  console.log("rewardRatePerSecond: ", rewardRatePerSecond)
//  console.log("claimPeriodLeft: ", claimPeriodLeft)
//  console.log("withdrawalTimeLeft: ", withdrawalTimeLeft)
  const { writeContractAsync } = useScaffoldWriteContract("Staker");

  return (
    <div className="flex items-center flex-col flex-grow w-full px-4 gap-12">
      {isStakingCompleted && (
        <div className="flex flex-col items-center gap-2 bg-base-100 shadow-lg shadow-secondary border-8 border-secondary rounded-xl p-6 mt-12 w-full max-w-lg">
          <p className="block m-0 font-semibold">
            {" "}
            🎉 &nbsp; Staking App triggered `ExampleExternalContract` &nbsp; 🎉{" "}
          </p>
          <div className="flex items-center">
            <ETHToPrice
              value={exampleExternalContractBalance ? formatEther(exampleExternalContractBalance.value) : undefined}
              className="text-[1rem]"
            />
            <p className="block m-0 text-lg -ml-1">staked !!</p>
          </div>
        </div>
      )}
      <div
        className={`flex flex-col items-center space-y-8 bg-base-100 shadow-lg shadow-secondary border-8 border-secondary rounded-xl p-6 w-full max-w-lg ${
          !isStakingCompleted ? "mt-24" : ""
        }`}
      >
        <div className="flex flex-col w-full items-center">
          <p className="block text-2xl mt-0 mb-2 font-semibold">Staker Contract</p>
          <Address address={address} size="xl" />
        </div>
        <div style={{ padding: 8, marginTop: 16 }}>
          {/* <div>Reward Rate Per Second:
         
          {rewardRatePerSecond ? formatEther(rewardRatePerSecond) : 0} ETH </div> */}
          <div>EXPONENTIAL</div>
        </div>
        <div className="flex items-start justify-around w-full">
          {/* <div className="flex flex-col items-center justify-center w-1/2">
            <p className="block text-xl mt-0 mb-1 font-semibold">Time Left</p>
            <p className="m-0 p-0">{timeLeft ? `${humanizeDuration(Number(timeLeft) * 1000)}` : 0}</p>
          </div> */}
          {/* <div className="flex flex-col items-center w-1/2">
            <p className="block text-xl mt-0 mb-1 font-semibold">You Staked</p>
            <span>
              {myStake ? formatEther(myStake) : 0} {targetNetwork.nativeCurrency.symbol}
            </span>
          </div> */}

          <div style={{ padding: 8, marginTop: 16, fontWeight: "bold" }}>
            <div>Claim Period Left:</div>
            {claimPeriodLeft ? `${humanizeDuration(Number(claimPeriodLeft) * 1000)}` : 0}
          </div>
          <div style={{ padding: 8, marginTop: 16, fontWeight: "bold" }}>
            <div>Withdrawal Time Left:</div>
            {withdrawalTimeLeft ? `${humanizeDuration(Number(withdrawalTimeLeft) * 1000)}` : 0}
          </div>
        </div>
        <div className="flex flex-col items-center shrink-0 w-full">
          <p className="block text-xl mt-0 mb-1 font-semibold">Total Available ETH in Contract</p>
          <div className="flex space-x-2">
            {<ETHToPrice value={stakerContractBalance ? formatEther(stakerContractBalance.value) : undefined} />}
            {/* <span>/</span>
            {<ETHToPrice value={threshold ? formatEther(threshold) : undefined} />} */}
          </div>
        </div>
        <div className="flex flex-col items-center shrink-0 w-full">
          <p className="block text-xl mt-0 mb-1 font-semibold">You Staked</p>
          <div className="flex space-x-2">
            {<ETHToPrice value={myStake ? formatEther(myStake) : undefined} />}
            {/* <span>/</span>
            {<ETHToPrice value={threshold ? formatEther(threshold) : undefined} />} */}
          </div>
        </div>
        <div className="flex flex-col space-y-5">
          <div className="flex space-x-7">
            <button
              className="btn btn-primary uppercase"
              onClick={async () => {
                try {
                  await writeContractAsync({ functionName: "execute" });
                } catch (err) {
                  console.error("Error calling execute function");
                }
              }}
            >
              Execute!
            </button>
            <button
              className="btn btn-primary uppercase"
              onClick={async () => {
                try {
                  await writeContractAsync({ functionName: "withdraw" });
                } catch (err) {
                  console.error("Error calling withdraw function");
                }
              }}
            >
              Withdraw
            </button>
          </div>
          { myStake ? <button>Already Staked</button> :
          <div>
          <EtherInput placeholder="Amount to send" value={sendValue} onChange={value => setSendValue(value)} />
          <button
            className="btn btn-primary uppercase"
            onClick={async () => {
              try {
                await writeContractAsync({ functionName: "stake", value: parseEther(sendValue as `${number}`) });
              } catch (err) {
                console.error("Error calling stake function");
              }
            }}
          >
            🔏 Stake {sendValue} ether!
          </button>
          </div>
          }
        </div>
        <div>
          
          <button
              className="btn btn-primary uppercase"
              onClick={async () => {
                try {
                  await writeContractAsync({ functionName: "fund", value: parseEther("5") });
                } catch (err) {
                  console.error("Error calling stake function");
                }
              }}
            >
              Send funds to contract
            </button>
          </div>
          <div>
          
          <button
              className="btn btn-primary uppercase"
              onClick={async () => {
                try {
                  await writeContractAsync({ functionName: "retrieveRepat"});
                } catch (err) {
                  console.error("Error calling stake function");
                }
              }}
            >
              Retrieve claimed funds
            </button>
          </div>
      </div>
    </div>
  );
};
