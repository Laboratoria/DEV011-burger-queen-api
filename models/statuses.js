const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// ---------- Define schema a of status of the status ---------- //
const statusesSchema = new Schema({
  status:String, // Estado de la orden [ pending, canceled, delivering, delivered ]
});
const Status = mongoose.model('Status', statusesSchema);

module.exports = Status;

const allNewStatus = [
  {status:'pending'},
  {status:'canceled'},
  {status:'delivering'},
  {status:'delivered'}
];

// Save the new person to the database
Promise.all(
  allNewStatus.map(newStatus => {
    const eachStatusModel = new Status(newStatus);
    return eachStatusModel.save();
  })
)
  .then(savedStatus => {
    console.log('Status guardados en MongoDB:', savedStatus);
  })
  .catch(error => {
    console.error('Error al guardar status en MongoDB:', error);
  });

// mongoose.connect('mongodb://127.0.0.1:27017/burger-queen-api');


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