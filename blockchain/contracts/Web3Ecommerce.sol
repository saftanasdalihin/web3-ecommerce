// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Web3Ecommerce {

    address public owner;
    uint public productCount = 0;

    struct Product {
        uint id;
        string name;
        string description;
        uint price;
        uint quantity;
        bool isSold;
        address payable seller;
    }

    mapping(uint => Product) public products;

    constructor(){
        owner = msg.sender;
    }

    event ProductAdded(uint id, string name, uint price, uint quantity);

    function addProduct(
        string memory _name, 
        string memory description, 
        uint _price, 
        uint _quantity
        ) public 
        {
            require(bytes(_name).length > 0, "Please fill the name of product");
            require(_price > 0, "Price must be greater than zero");
            require(_quantity > 0, "Quantity must be greater than zero");
            productCount++;
            products[productCount] = Product({
                id: productCount,
                name: _name,
                description: description,
                price: _price,
                quantity: _quantity,
                isSold: false,
                seller: payable(msg.sender)
            });


            emit ProductAdded(productCount, _name, _price, _quantity);

    }

    event ProductPurchased(uint id, address buyer, uint quantityRemaining);

    function buyProduct(uint _id, uint _quantity) payable public {
        Product storage _product = products[_id];

        // 1. Validation
        require(_product.id > 0 && _product.id <= productCount, "Product not found");
        require(_product.quantity >= _quantity, "Not enough quantity");
        require(!_product.isSold, "Product is sold");
        uint totalCost = _product.price * _quantity; // Exact change
        require(msg.value >= totalCost, "Not enough money");

        // 2. State update
        _product.quantity-= _quantity;
        if (_product.quantity == 0) {
        _product.isSold = true;
        }

        // 3. Interaction (transfer)
        (bool success, ) = _product.seller.call{value: totalCost}("");
        require(success, "Failed to transfer to seller");

        // 4. Refund
        uint refund = msg.value - totalCost;
        if (refund > 0) {
            (bool refundSuccess, ) = payable(msg.sender).call{value: refund}("");
            require(refundSuccess, "Refund failed");
        }

        emit ProductPurchased(_id, msg.sender, _product.quantity);
    }
}