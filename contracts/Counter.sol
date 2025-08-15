// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title Counter
 * @dev A simple counter contract for testing ERC-4337 account abstraction
 */
contract Counter {
    uint256 public count;
    
    event CounterIncremented(address indexed user, uint256 newCount);
    event CounterReset(address indexed user);
    
    constructor() {
        count = 0;
    }
    
    /**
     * @dev Increment the counter by 1
     * @notice This function can be called by any account
     */
    function increment() public {
        count += 1;
        emit CounterIncremented(msg.sender, count);
    }
    
    /**
     * @dev Reset the counter to 0
     * @notice This function can be called by any account
     */
    function reset() public {
        count = 0;
        emit CounterReset(msg.sender);
    }
    
    /**
     * @dev Get the current count
     * @return The current count value
     */
    function getCount() public view returns (uint256) {
        return count;
    }
    
    /**
     * @dev Increment by a specific amount
     * @param amount The amount to increment by
     */
    function incrementBy(uint256 amount) public {
        require(amount > 0, "Amount must be greater than 0");
        count += amount;
        emit CounterIncremented(msg.sender, count);
    }
}
