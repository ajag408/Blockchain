// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

contract FundMe {

    uint256 public minimumUsd = 50;

    function fund() public payable{
        require(msg.value >= minimumUsd, "Didn't send enough"); //1e18 wei = 1 Eth
    }

    function getPrice() public {
        //ABI
        //Address (Goerli, Eth/usd): 0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e
    }

    function getConversionRate() public {}

    // function withdraw(){}
    //blahblah
}