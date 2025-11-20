// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract ImageFee {
    uint256 public fee = 0.0002 ether;

    event ImageRequested(address indexed user, uint256 promptId);

    function generateImage(uint256 promptId) public payable {
        require(msg.value >= fee, "Insufficient fee");
        emit ImageRequested(msg.sender, promptId);
    }
}
