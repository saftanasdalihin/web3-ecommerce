const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Ecommerce Contract", function () {
  async function deployEcommerceFixture() {
    const [owner, pembeli] = await ethers.getSigners();
    const Web3Ecommerce = await ethers.getContractFactory("Web3Ecommerce");
    const ecommerce = await Web3Ecommerce.deploy();

    // Add a product
    await ecommerce.addProduct(
        "Vivo X200", 
        "RAM 16GB, ROM 1TB", 
        ethers.parseEther("0.1"), 
        10
    );

    return { ecommerce, owner, pembeli };
  }

  it("Must have 10 stock initially", async function () {
    const { ecommerce } = await deployEcommerceFixture();
    const produk = await ecommerce.products(1);
    expect(produk.quantity).to.equal(10);
  });

  it("Must reduce stock after purchase", async function () {
    const { ecommerce, pembeli } = await deployEcommerceFixture();
    
    // Buy 2 units of product with ID 1
    await ecommerce.connect(pembeli).buyProduct(1, 2, { 
      value: ethers.parseEther("0.2") 
    });

    const produk = await ecommerce.products(1);
    expect(produk.quantity).to.equal(8); // 10 - 2 = 8
  });

  it("Must fail if not enough money", async function () {
    const { ecommerce, pembeli } = await deployEcommerceFixture();

    // Attempt to buy 1 unit of product with insufficient funds
    await expect(
      ecommerce.connect(pembeli).buyProduct(1, 1, { value: ethers.parseEther("0.01") })
    ).to.be.revertedWith("Not enough money"); 
  });
});