// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;  //Do not change the solidity version as it negativly impacts submission grading

contract ExampleExternalContract {

  bool public completed;
  address private stakerContract;

  constructor(){
    stakerContract = msg.sender;
  }
  function complete() public payable {
    completed = true;
  }


  function retrieveRepat() public payable {
    require(msg.sender == stakerContract, "not staker");
        // Transfer all ETH via call! (not transfer) cc: https://solidity-by-example.org/sending-ether
    (bool sent, bytes memory data) = msg.sender.call{value: address(this).balance}("");
    require(sent, "re-deposit failed :( ");
    
  }

}
