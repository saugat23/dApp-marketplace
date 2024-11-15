// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.27;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract Marketplace {
    struct Item {
        uint id;
        address payable owner;
        string name;
        uint price;
        uint quantity;
        bool isSold;
    }

    // Only mapping and counter, no duplicate declarations
    mapping(uint => Item) public items;  // Mapping of item ID to Item
    uint public itemCount;               // Count of all items listed

    // Events
    event ItemListed(uint id, address owner, string name, uint price, uint quantity);
    event ItemPurchased(uint id, address buyer, uint price, uint quantityLeft);

    // Function to list a new item
    function listItem(string memory name, uint price, uint quantity) public {
        require(price > 0, "Price must be positive");
        require(quantity > 0, "Quantity must be positive");

        itemCount++;  // Increment item count for unique ID
        items[itemCount] = Item(itemCount, payable(msg.sender), name, price, quantity, false);

        // Emit event when an item is listed
        emit ItemListed(itemCount, msg.sender, name, price, quantity);
    }

    // Function to purchase an item
    function purchaseItem(uint id) public payable {
        Item storage item = items[id];
        require(!item.isSold, "Item sold out");
        require(item.quantity > 0, "No items left");
        require(msg.value == item.price, "Incorrect price");

        item.owner.transfer(msg.value);  // Transfer payment to the owner
        item.quantity--;                 // Decrement quantity by 1

        // If quantity reaches 0, mark item as sold out
        if (item.quantity == 0) {
            item.isSold = true;
        }

        // Emit event when an item is purchased
        emit ItemPurchased(id, msg.sender, item.price, item.quantity);
    }

    // Function to fetch all items
    function getItems() public view returns (
        uint[] memory, address[] memory, string[] memory, uint[] memory, uint[] memory, bool[] memory
    ) {
        uint[] memory ids = new uint[](itemCount);
        address[] memory owners = new address[](itemCount);
        string[] memory names = new string[](itemCount);
        uint[] memory prices = new uint[](itemCount);
        uint[] memory quantities = new uint[](itemCount);
        bool[] memory isSolds = new bool[](itemCount);

        for (uint i = 1; i <= itemCount; i++) {
            Item storage item = items[i];
            ids[i - 1] = item.id;
            owners[i - 1] = item.owner;
            names[i - 1] = item.name;
            prices[i - 1] = item.price;
            quantities[i - 1] = item.quantity;
            isSolds[i - 1] = item.isSold;
        }

        return (ids, owners, names, prices, quantities, isSolds);
    }
}
