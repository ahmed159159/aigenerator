// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract ImageFee {
    address public owner;
    uint256 public fee;

    event ImageRequested(
        address indexed user,
        uint256 indexed promptId,
        uint256 amount
    );

    constructor(uint256 _fee) {
        owner = msg.sender;
        fee = _fee;
    }

    function setFee(uint256 _fee) external {
        require(msg.sender == owner, "Not the owner");
        fee = _fee;
    }

    function generateImage(uint256 promptId) external payable {
        require(msg.value >= fee, "Insufficient fee");

        payable(owner).transfer(msg.value);

        emit ImageRequested(msg.sender, promptId, msg.value);
    }
}
