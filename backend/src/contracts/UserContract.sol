// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract UserContract {
    address payable[] public addresses;
    uint[] public splits;
    uint public money;

    constructor(address payable[] memory _addresses, uint[] memory _splits) {
        require(_addresses.length == _splits.length, "Arrays length mismatch");

        addresses = _addresses;
        splits = _splits;
    }

    function getContractBalance() public view returns (uint) {
        return address(this).balance;
    }

    function sendMoney(uint index) public {
        uint amount = (money * splits[index]) / 1000;

        require(address(this).balance >= amount, "Insufficient balance");

        addresses[index].transfer(amount);
    }

    event FundsReceived(address indexed sender, uint amount);

    receive() external payable {
        // emit FundsReceived(msg.sender, msg.value);
        money = getContractBalance();
    }
}
