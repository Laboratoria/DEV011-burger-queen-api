const mongoose = require ('mongoose');
const User = require('../models/users');

mongoose.connect('mongodb://127.0.0.1:27017/test');

module.exports = {
  getUsers: async(req, resp, next) => {
    try {
      const allUsers = await User.find();
      // console.log('Usuarios de la collección: ',allUsers);
      return allUsers;
    } catch(error){
      console.error('Error al buscar todas las personas:', error);
      throw error;
    }

    // TODO: Implement the necessary function to fetch the `users` collection or table
  },
};
