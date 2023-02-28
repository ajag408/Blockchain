//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

interface Winner {
    function attempt() external;
}

contract EmitWinner {
    function emitWinner(address winnerContract) external {
        Winner(winnerContract).attempt();
    }
}
