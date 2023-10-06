//SPDX-License-Identifier: Unlicense

// contracts/BuyMeACoffee.sol
pragma solidity ^0.8.0;

// Switch this to your own contract address once deployed, for bookkeeping!
// Example Contract Address on Sepolia: 0xffAf2409E7abE5F3E9EE7c4C3BF78B4385Eec6Bf

contract BuyMeACoffee {
    // Event to emit when a Memo is created.
    event NewMemo(
        address indexed from,
        uint256 timestamp,
        string name,
        string message,
        string size
    );

    // Memo struct.
    struct Memo {
        address from;
        uint256 timestamp;
        string name;
        string message;
        string size;
    }

    // Address of contract deployer. Marked payable so that
    // we can withdraw to this address later.
    address payable ben;

    // List of all memos received from coffee purchases.
    Memo[] memos;

    constructor() {
        // Store the address of the deployer as a payable address.
        // When we withdraw funds, we'll withdraw here.
        ben = payable(msg.sender);
    }

    /**
     * @dev fetches all stored memos
     */
    function getMemos() public view returns (Memo[] memory) {
        return memos;
    }

    /**
     * @dev buy a coffee for owner (sends an ETH tip and leaves a memo)
     * @param _name name of the coffee purchaser
     * @param _message a nice message from the purchaser
     */
    function buyCoffee(
        string memory _name,
        string memory _message
    ) public payable {
        // Must accept more than 0 ETH for a coffee.
        require(msg.value > 0, "can't buy coffee for free!");

        // Add the memo to storage!
        memos.push(Memo(msg.sender, block.timestamp, _name, _message, "Small"));

        // Emit a NewMemo event with details about the memo.
        emit NewMemo(msg.sender, block.timestamp, _name, _message, "Small");
    }

    function buyLargeCoffee(
        string memory _name,
        string memory _message
    ) public payable {
        // Must accept more than 0 ETH for a coffee.
        require(msg.value >= 0.003 ether, "small coffee on dat side!");

        // Add the memo to storage!
        memos.push(Memo(msg.sender, block.timestamp, _name, _message, "Large"));

        // Emit a NewMemo event with details about the memo.
        emit NewMemo(msg.sender, block.timestamp, _name, _message, "Large");
    }

    /**
     * @dev send the entire balance stored in this contract to the owner
     */
    function withdrawTips() public {
        require(ben.send(address(this).balance));
    }

    function updateBen(address newBen) public {
        require(msg.sender == ben, "WHO YOU");
        ben = payable(newBen);
    }

    function getBen() public view returns (address) {
        return ben;
    }
}
