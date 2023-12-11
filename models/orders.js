const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// ---------- Define schema a of orders ---------- //
const ordersSchema = new Schema({
  // userId:{type:Schema.Types.ObjectId, ref:'users', required:true}, // Id
  userId: String,
  client: String, // Clienta para quien se creó la orden
  products: Object/*[{
    type:{
      type: Object,
      validate: {
        validator: (objeto) =>
          objeto &&
          typeof objeto === "object" &&
          "productId" in objeto,
        message: "El objeto debe tener los atributos específicos.",
      },
    }
  }]  ([
    {
      qty: Number, // Cantidad
      product: {
        // productId: {type:Schema.Types.ObjectId, ref: 'products'},
        productd: String,
        name: String,
        price: Number,
        image: String, // URL a la imagen
        type: String, // Tipo/Categoría
        dateEntry: String // Fecha de creación
      }
    }
  ]) */,
  status: String, // Estado de la orden [ pending, canceled, delivering, delivered ]
  dateEntry: Date, // Fecha de creación
  dateProcessed: Date, // Fecha de cambio de `status` a `delivered`
});
const Order = mongoose.model('Order', ordersSchema);

// mongoose.connect('mongodb://127.0.0.1:27017/burger-queen-api');

module.exports = Order;


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