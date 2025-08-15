// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title DemoNFT
 * @dev A simple ERC-721 NFT contract for demonstrating Account Abstraction features
 * Features gasless minting and simple metadata
 */
contract DemoNFT {
    string public name = "Demo NFT";
    string public symbol = "DNFT";
    
    uint256 private _tokenIdCounter;
    uint256 public maxSupply = 10000;
    
    mapping(uint256 => address) public ownerOf;
    mapping(address => uint256) public balanceOf;
    mapping(uint256 => address) public getApproved;
    mapping(address => mapping(address => bool)) public isApprovedForAll;
    mapping(uint256 => string) public tokenURIs;
    
    event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);
    event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId);
    event ApprovalForAll(address indexed owner, address indexed operator, bool approved);
    event Mint(address indexed to, uint256 indexed tokenId);
    
    constructor() {
        _tokenIdCounter = 1; // Start from token ID 1
    }
    
    /**
     * @dev Mint NFT to any address (for demo purposes)
     * @param to The address to mint to
     * @param metadata The metadata URI for the token
     */
    function mint(address to, string memory metadata) public returns (uint256) {
        require(to != address(0), "Cannot mint to zero address");
        require(_tokenIdCounter <= maxSupply, "Max supply reached");
        
        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter++;
        
        ownerOf[tokenId] = to;
        balanceOf[to]++;
        tokenURIs[tokenId] = metadata;
        
        emit Transfer(address(0), to, tokenId);
        emit Mint(to, tokenId);
        
        return tokenId;
    }
    
    /**
     * @dev Mint NFT to caller with default metadata
     */
    function mintToSelf() public returns (uint256) {
        string memory defaultMetadata = string(
            abi.encodePacked(
                "data:application/json;base64,",
                "eyJuYW1lIjoiRGVtbyBORlQgIywiaW1hZ2UiOiJkYXRhOmltYWdlL3N2Zyt4bWw7YmFzZTY0LFBITjJaeUIzYVdSMGFEMGlNakF3SWlCb1pXbG5hSFE5SWpJd01DSWdlRzFzYm5NOUltaDBkSEE2THk5M2QzY3Vkek11YjNKbkx6SXdNREF2YzNabklpQjJhV1YzUW05NFBTSXdJREFnTWpBd0lESXdNQ0krSUdSbFpuTStQR05wY21Oc1pTQmplRDBpTVRBd0lpQmplVDBpTVRBd0lpQnlQU0kzTUNJZ1ptbHNiRDBpSXpNek16TXpNeUl2UGp3dlpHVm1jejRnUEhSbGVIUWdlRDBpTVRBd0lpQjVQU0k0TUNJZ1ptbHNiRDBpSTNabGRDSWdabTl1ZEMxemFYcGxQU0l4TkNJZ2RHVjRkQzFoYm1Ob2IzSTlJbTFwWkdSc1pTSStSR1Z0YnlCT1JsUWdJeXd2ZEdWNGRENWNQQzl6ZG1jKyJ9"
            )
        );
        
        return mint(msg.sender, defaultMetadata);
    }
    
    /**
     * @dev Transfer NFT from one address to another
     * @param from The current owner
     * @param to The new owner
     * @param tokenId The token ID to transfer
     */
    function transferFrom(address from, address to, uint256 tokenId) public {
        require(to != address(0), "Cannot transfer to zero address");
        require(ownerOf[tokenId] == from, "Not the owner");
        require(
            msg.sender == from || 
            getApproved[tokenId] == msg.sender || 
            isApprovedForAll[from][msg.sender],
            "Not approved"
        );
        
        // Clear approval
        getApproved[tokenId] = address(0);
        
        balanceOf[from]--;
        balanceOf[to]++;
        ownerOf[tokenId] = to;
        
        emit Transfer(from, to, tokenId);
    }
    
    /**
     * @dev Safe transfer with data
     */
    function safeTransferFrom(address from, address to, uint256 tokenId, bytes memory data) public {
        transferFrom(from, to, tokenId);
        
        if (to.code.length > 0) {
            // Check if contract implements onERC721Received
            try IERC721Receiver(to).onERC721Received(msg.sender, from, tokenId, data) returns (bytes4 retval) {
                require(retval == IERC721Receiver.onERC721Received.selector, "ERC721: transfer to non ERC721Receiver implementer");
            } catch (bytes memory reason) {
                if (reason.length == 0) {
                    revert("ERC721: transfer to non ERC721Receiver implementer");
                } else {
                    assembly {
                        revert(add(32, reason), mload(reason))
                    }
                }
            }
        }
    }
    
    /**
     * @dev Safe transfer without data
     */
    function safeTransferFrom(address from, address to, uint256 tokenId) public {
        safeTransferFrom(from, to, tokenId, "");
    }
    
    /**
     * @dev Approve another address to transfer a specific token
     * @param approved The address to approve
     * @param tokenId The token ID to approve
     */
    function approve(address approved, uint256 tokenId) public {
        address owner = ownerOf[tokenId];
        require(approved != owner, "Cannot approve owner");
        require(
            msg.sender == owner || isApprovedForAll[owner][msg.sender],
            "Not approved for all"
        );
        
        getApproved[tokenId] = approved;
        emit Approval(owner, approved, tokenId);
    }
    
    /**
     * @dev Set approval for all tokens
     * @param operator The operator to approve/disapprove
     * @param approved Whether to approve or disapprove
     */
    function setApprovalForAll(address operator, bool approved) public {
        require(operator != msg.sender, "Cannot approve self");
        isApprovedForAll[msg.sender][operator] = approved;
        emit ApprovalForAll(msg.sender, operator, approved);
    }
    
    /**
     * @dev Get token metadata URI
     * @param tokenId The token ID
     * @return The metadata URI
     */
    function tokenURI(uint256 tokenId) public view returns (string memory) {
        require(ownerOf[tokenId] != address(0), "Token does not exist");
        return tokenURIs[tokenId];
    }
    
    /**
     * @dev Get total number of tokens minted
     * @return The total supply
     */
    function totalSupply() public view returns (uint256) {
        return _tokenIdCounter - 1;
    }
    
    /**
     * @dev Check if contract supports interface
     * @param interfaceId The interface ID to check
     * @return Whether the interface is supported
     */
    function supportsInterface(bytes4 interfaceId) public pure returns (bool) {
        return
            interfaceId == 0x01ffc9a7 || // ERC165
            interfaceId == 0x80ac58cd || // ERC721
            interfaceId == 0x5b5e139f;   // ERC721Metadata
    }
}

interface IERC721Receiver {
    function onERC721Received(
        address operator,
        address from,
        uint256 tokenId,
        bytes calldata data
    ) external returns (bytes4);
}