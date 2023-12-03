// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract UserContract {
    address payable[] public addresses;
    uint[] public splits;
    uint public eth;

    constructor(address payable[] memory _addresses, uint[] memory _splits) {
        require(_addresses.length == _splits.length, "Arrays length mismatch");

        addresses = _addresses;
        splits = _splits;
    }

    function getContractBalance() public returns (uint) {
        eth = address(this).balance;
        return address(this).balance;
    }

    function sendMoney(uint index) public {
        uint amount = (eth * splits[index]) / 100000;

        require(address(this).balance >= amount, "Insufficient balance");

        (bool sent, bytes memory data) = addresses[index].call{value: amount}(
            ""
        );
        require(sent, "Failed to send Ether");
    }

    event FundsReceived(address indexed sender, uint amount);

    receive() external payable {
        // emit FundsReceived(msg.sender, msg.value);

        eth = getContractBalance();
        for (uint i = 0; i < addresses.length; i++) {
            sendMoney(i);
        }
    }
}
