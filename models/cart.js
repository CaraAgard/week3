const fs = require('fs');
const path = require('path');

const p = path.join(
    path.dirname(require.main.filename),
    'data',
    'cart.json'
  );


module.exports = class Cart {
    // constructor() {
    //     this.products = [];
    //     this.totalPrice = 0;
    // }
    static addProduct(id, productPrice) {
        //Fetch the previous cart
        //file system to read a file then get a callback with an error
        fs.readFile(p, (err, fileContent) => {
            let cart = {products: [], totalPrice: 0}
            if(!err) {
                cart = JSON.parse(fileContent)
            }
             //analyze the cart => find existing product
             const existingProductIndex = cart.products.findIndex(prod => prod.id === id);
             const existingProduct = cart.products[existingProductIndex];
             let updatedProduct;
               //add new product and increase the quantity
             if (existingProduct) {
                 updatedProduct = {...existingProduct };
                 updatedProduct.qty = updatedProduct.qty + 1;
                 cart.products = [...cart.products, updatedProduct];
                 cart.products[existingProductIndex] = updatedProduct;
             }else{
                 updatedProduct = { id: id, qty:1};
                 cart.products = [...cart.products, updatedProduct];
             }
             cart.totalPrice = cart.totalPrice + +productPrice;
             fs.writeFile(p, JSON.stringify(cart), (err) => {
                 console.log(err);
             }); 
        });
    }
    static deleteProduct(id, productPrice) {
        fs.readFile(p, (err, fileContent) => {
            if (err) {
                return;
            }
            const updatedCart = {...JSON.parse(fileContent) };
            const product = updatedCart.products.find(prod => prod.id === id);
            if (!product) {
                return;
            }
            const productQty = product.qty;
            updatedCart.products = updatedCart.products.filter(
                prod => prod.id !== id
                );
            updatedCart.totalPrice = updatedCart.totalPrice - productPrice * productQty;
        });
    }

    static getCart(cb) {
        fs.readFile(p, (err, fileContent) => {
            const cart = JSON.parse(fileContent);
            if (err) {
                cb(null);
            } else {
            cb(cart);
            }
        });
    }
};