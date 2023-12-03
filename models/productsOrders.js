const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// ---------- Define schema a of orders ---------- //
const productsOrdersSchema = new Schema({
  qty: Number, // Cantidad
  product: {
    productId: {type:Schema.Types.ObjectId, ref: 'products'},
    name: String,
    price: Number,
    image: String, // URL a la imagen
    type: String, // Tipo/Categoría
    dateEntry: Date // Fecha de creación
  }
});
const ProductOrder = mongoose.model('ProductOrder', productsOrdersSchema);

// mongoose.connect('mongodb://127.0.0.1:27017/burger-queen-api');

module.exports = ProductOrder;


// Connect to MongoDB

/* //  Model based on the schema
const Order = mongoose.model('Order', orders);

// Example usage
const newOrder = new Order({
  name: 'John Doe',
  age: 25,
  email: 'john@example.com'
});

// Save the new person to the database
newOrder.save()
  .then(result => {
    console.log('Saved to MongoDB:', result);
  })
  .catch(error => {
    console.error('Error saving to MongoDB:', error);
  }); */