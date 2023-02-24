//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract ModifyVariable {
    uint public x;
    string public y;

    constructor(uint _x, string memory _y) {
        x = _x;
        y = _y;
    }

    function modifyToLeet() public {
        x = 1337;
    }

    function modifyString() public {
        y = "fack";
    }
}
