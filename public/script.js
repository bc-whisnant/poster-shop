let loadNum = 4;
let watcher;

new Vue({
  el: "#app",
  data: {
    total: 0,
    products: [],
    cart: [],
    search: "cat",
    lastSearch: "",
    loading: false,
    results: []
  },
  methods: {
    addToCart: function(product) {
      // increase total by price of product added to cart
      this.total += product.price;
      var found = false;
      // does product already exist in cart?
      for (let i = 0; i < this.cart.length; i++) {
        if (this.cart[i].id === product.id) {
          this.cart[i].qty++;
          found = true;
        } 
      }
      // push product into cart - if not already found
      if (!found) {
        this.cart.push({
          id: product.id,
          title: product.title,
          price: product.price,
          qty: 1
        });
      }
      
      console.log(this.cart);
    },
    inc: function(item) {
      item.qty ++;
      this.total += item.price;
    },
    dec: function(item) {
      item.qty --;
      this.total -= item.price;
      if (item.qty <= 0) {
        var i = this.cart.indexOf(item);
        this.cart.splice(i, 1);
      }
    },
    onSubmit: function() {
      this.products = [];
      this.results = [];
      this.loading = true;
      let path = '/search?q='.concat(this.search)
      this.$http.get(path).then(response => {
        this.results = response.body;      
        this.lastSearch = this.search;
        this.appendResults();
        this.loading = false;

        
      })
    },
    appendResults: function() {
      if(this.products.length < this.results.length) {
        let toAppend = this.results.slice(this.products.length, loadNum + this.products.length);
        this.products = this.products.concat(toAppend);
      }
    }
  },
  filters: {
    currency: function(price) {
      // exactly two digits after decimal point
      return '$'.concat(price.toFixed(2));
    }
  },
  created: function() {
    this.onSubmit();
  },
  updated: function() {
    let sensor = document.querySelector('#product-list-bottom');
    watcher = scrollMonitor.create(sensor);
    // use enterViewport to activate the listener
    watcher.enterViewport(this.appendResults);
  },
  beforeUpdate: function() {
    if(watcher) {
      watcher.destroy();
      watcher = null;
    }
  }
})
