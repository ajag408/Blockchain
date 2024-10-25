// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

contract Store {

    struct payments {
        // Pack uint256s together (32 bytes each)
        uint256 amount;
        uint256 finalAmount;
        uint256 initialAmount;
        
        // Pack addresses together (20 bytes each)
        address sender;
        address receiver;
        
        // Pack small variables together (1 byte each)
        uint8 paymentType;
        bool valid;
        bool checked;
    }
    
    // Group uint256 together
    uint256 public number;
    mapping(address=>uint256) balances;  // mappings always get their own slot
    
    // Group addresses together (20 bytes each)
    address admin;
    address admin2;
    
    // Pack smaller variables together in a single 32-byte slot
    // uint8 = 1 byte, bool = 1 byte
    uint8 index;
    bool flag1;
    bool flag2;
    bool flag3;
    
    payments[8] topPayments;


    constructor(){

    }


    function setNumber(uint256 newNumber) public {
        number = newNumber;
    }

    function increment() public {
        number++;
    }
}