//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IERC20 {
    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) external returns (bool);
}

contract Bucket {
    event Winner(address);

    function drop(address erc20, uint amount) external {
        require(amount > 0);
        require(IERC20(erc20).transferFrom(msg.sender, address(this), amount));
        emit Winner(msg.sender);
    }
}
