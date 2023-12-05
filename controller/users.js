// const ObjectId = require ('mongoose').Types.ObjectId;
const User = require('../models/users');
const { isAdmin } = require('../middleware/auth');
// mongoose.connect('mongodb://127.0.0.1:27017/burger-queen-api');

module.exports = {
  getUsers: async() => {
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
  getUserbyID: async(req) => {
    try {
      let user = await User.findById({"_id":req.params.uid});
      console.log('Usuarios de la collección: ',req.uid === req.params.uid);
      if ( (isAdmin(req) || req.uid === req.params.uid) && user != null){
        user ={
          id:user._id,
          email:user.email,
          role:user.roles
        };
      } else if ( (!isAdmin(req) && req.uid != req.params.uid)  && user != null){
        user = undefined
      }
      return user;
    } catch(error){
      console.error('Error al buscar todas las personas:', error);
      throw error;
    }
    // TODO: Implement the necessary function to fetch the `users` collection or table
  },
};
