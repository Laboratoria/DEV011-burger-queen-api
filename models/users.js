const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// ---------- Define schema a of users ---------- //
const usersSchema = new Schema({
  email:{type:String, unique:true},
  password:String,
  role:String, // Rol asignado [ admin, waiter, chef ]
});
const User = mongoose.model('User', usersSchema);

// mongoose.connect('mongodb://127.0.0.1:27017/burger-queen-api');

module.exports = User;


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