// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

contract FundMe {

    uint256 public minimumUsd = 50;

    function fund() public payable{
        require(msg.value >= minimumUsd, "Didn't send enough"); //1e18 wei = 1 Eth
    }

    // function withdraw(){}
}