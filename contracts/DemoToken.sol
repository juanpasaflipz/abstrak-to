// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title DemoToken
 * @dev A simple ERC-20 token for demonstrating Account Abstraction features
 * Features mint functionality that can be used with gasless transactions
 */
contract DemoToken {
    string public name = "Demo Token";
    string public symbol = "DEMO";
    uint8 public decimals = 18;
    uint256 public totalSupply;
    
    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;
    
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    event Mint(address indexed to, uint256 value);
    
    constructor() {
        // Mint initial supply to deployer
        uint256 initialSupply = 1000000 * 10**decimals; // 1 million tokens
        totalSupply = initialSupply;
        balanceOf[msg.sender] = initialSupply;
        emit Transfer(address(0), msg.sender, initialSupply);
    }
    
    /**
     * @dev Mint tokens to any address (for demo purposes)
     * @param to The address to mint tokens to
     * @param amount The amount of tokens to mint
     */
    function mint(address to, uint256 amount) public {
        require(to != address(0), "Cannot mint to zero address");
        require(amount > 0, "Amount must be greater than 0");
        require(amount <= 1000 * 10**decimals, "Cannot mint more than 1000 tokens at once");
        
        totalSupply += amount;
        balanceOf[to] += amount;
        
        emit Transfer(address(0), to, amount);
        emit Mint(to, amount);
    }
    
    /**
     * @dev Mint a fixed amount (100 tokens) to caller for easy testing
     */
    function mintToSelf() public {
        mint(msg.sender, 100 * 10**decimals);
    }
    
    /**
     * @dev Transfer tokens
     * @param to The address to transfer to
     * @param amount The amount to transfer
     */
    function transfer(address to, uint256 amount) public returns (bool) {
        require(to != address(0), "Cannot transfer to zero address");
        require(balanceOf[msg.sender] >= amount, "Insufficient balance");
        
        balanceOf[msg.sender] -= amount;
        balanceOf[to] += amount;
        
        emit Transfer(msg.sender, to, amount);
        return true;
    }
    
    /**
     * @dev Approve spender to transfer tokens
     * @param spender The address to approve
     * @param amount The amount to approve
     */
    function approve(address spender, uint256 amount) public returns (bool) {
        require(spender != address(0), "Cannot approve zero address");
        
        allowance[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }
    
    /**
     * @dev Transfer tokens from one address to another (requires approval)
     * @param from The address to transfer from
     * @param to The address to transfer to
     * @param amount The amount to transfer
     */
    function transferFrom(address from, address to, uint256 amount) public returns (bool) {
        require(to != address(0), "Cannot transfer to zero address");
        require(balanceOf[from] >= amount, "Insufficient balance");
        require(allowance[from][msg.sender] >= amount, "Insufficient allowance");
        
        balanceOf[from] -= amount;
        balanceOf[to] += amount;
        allowance[from][msg.sender] -= amount;
        
        emit Transfer(from, to, amount);
        return true;
    }
    
    /**
     * @dev Burn tokens from caller's balance
     * @param amount The amount to burn
     */
    function burn(uint256 amount) public {
        require(balanceOf[msg.sender] >= amount, "Insufficient balance");
        
        balanceOf[msg.sender] -= amount;
        totalSupply -= amount;
        
        emit Transfer(msg.sender, address(0), amount);
    }
    
    /**
     * @dev Get token balance of an address
     * @param account The address to check
     * @return The balance of the account
     */
    function getBalance(address account) public view returns (uint256) {
        return balanceOf[account];
    }
}