class Cart {
    constructor() {
        this.data = {};
        this.data.cartItems = [];
        this.data.totals = 0;
    }

    inCart(cartItem = 0) {
        let found = false;
        this.data.cartItems.forEach(item => {
            if (item._id === cartItem) {
                found = true;
            }
        });
        return found;
    }

    calculateTotals() {
        this.data.totals = 0;
        this.data.cartItems.forEach(item => {
            let price = item.price;
            let qty = item.qty;
            let amount = price * qty;

            this.data.totals += amount;
        })
    }
    addToCart(cartItem = null, qty = 1) {
        if(!this.inCart(cartItem._id)) {
            let prod = {
                id: item._id,
                title: item.title,
                price: item.price,
                qty: qty,
                image: item.pictures.at(0)                
            }
            this.data.cartItems.push(prod);
            this.calculateTotals();
        }
    }
}

module.exports = new Cart();

