// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "./Ownable.sol";

contract GasContract is Ownable {
    uint256 public totalSupply;
    uint256 public paymentCounter;
    mapping(address => uint256) public balances;
    mapping(address => Payment[]) public payments;
    mapping(address => uint256) public whitelist;
    uint256 private constant MAX_ADMINS = 5;
    address[MAX_ADMINS] public administrators;

    enum PaymentType {
        Unknown,
        BasicPayment
    }

    struct Payment {
        uint256 paymentID;
        address recipient;
        uint256 amount;
        string recipientName;
    }

    struct WhiteListPayment {
        bool paymentStatus;
        uint256 amount;
    }

     mapping(address => WhiteListPayment) private whiteListPayments;

    event AddedToWhitelist(address userAddress, uint256 tier);
    event Transfer(address recipient, uint256 amount);
    event WhiteListTransfer(address indexed);

    constructor(address[] memory _admins, uint256 _totalSupply) {
        _transferOwnership(msg.sender);
        totalSupply = _totalSupply;
        balances[owner()] = _totalSupply;

        for (uint256 i = 0; i < 5 && i < _admins.length; i++) {
            if (_admins[i] != address(0)) {
                administrators[i] = _admins[i];
            }
        }
    }

    function checkForAdmin(address _user) public view returns (bool) {
        for (uint256 i = 0; i < MAX_ADMINS; i++) {
            if (administrators[i] == _user) {
                return true;
            }
        }
        return false;
    }

    function balanceOf(address _user) public view returns (uint256) {
        return balances[_user];
    }

    function getPayments(address _user) public view returns (Payment[] memory) {
        return payments[_user];
    }

    function transfer(address _recipient, uint256 _amount, string calldata _name) public returns (bool) {
        require(balances[msg.sender] >= _amount, "Insufficient Balance");
        require(bytes(_name).length <= 8, "Name too long");
        unchecked {
            balances[msg.sender] -= _amount;
            balances[_recipient] += _amount;
            paymentCounter++;
        }

        payments[msg.sender].push(Payment({
            paymentID: ++paymentCounter,
            recipient: _recipient,
            amount: _amount,
            recipientName: _name
        }));

        emit Transfer(_recipient, _amount);
        return true;
    }

    function addToWhitelist(address _userAddrs, uint256 _tier) public onlyOwner {
        require(_tier < 255, "Tier should be less than 255");
        whitelist[_userAddrs] = _tier > 3 ? 3 : (_tier == 0 ? 1 : _tier);
        emit AddedToWhitelist(_userAddrs, _tier);
    }

    function whiteTransfer(address _recipient, uint256 _amount) public {
        require(whitelist[msg.sender] > 0, "Not whitelisted");
        require(balances[msg.sender] >= _amount, "Insufficient Balance");
        require(_amount > 3, "Amount must be greater than 3");

        balances[msg.sender] -= _amount;
        balances[_recipient] += _amount;
        balances[msg.sender] += whitelist[msg.sender];
        balances[_recipient] -= whitelist[msg.sender];

        whiteListPayments[msg.sender] = WhiteListPayment(true, _amount);

        emit WhiteListTransfer(_recipient);
    }

    function getPaymentStatus(address sender) public view returns (bool, uint256) {
        WhiteListPayment memory payment = whiteListPayments[sender];
        return (payment.paymentStatus, payment.amount);
    }
}
