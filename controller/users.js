const User = require('../models/users');
// const ObjectId = require ('mongoose').Types.ObjectId;
//const { isAdmin } = require('../middleware/auth');
// mongoose.connect('mongodb://127.0.0.1:27017/burger-queen-api');

module.exports = {
  getUsers: async() => {
    try {
      const allUsers = await User.find();
      // console.log('Usuarios de la collección: ',allUsers);
      return allUsers;
    } catch(error){
      console.log('c/u Error al buscar todas las personas:', error);
      throw error;
    }
    // TODO: Implement the necessary function to fetch the `users` collection or table
  },

  getUsersJSON: async() => {
    try {
      const allUsers = await User.find();
      // console.log('Usuarios de la collección: ',allUsers);
      const respUsersGet = [];
    
      allUsers.map((user)=>{
        respUsersGet.push({
          id:user._id,
          email:user.email,
          role:user.role
        })
      })
      return respUsersGet;
    } catch(error){
      console.log('Error al buscar todas las personas:', error);
      throw new Error('Error al buscar todas las personas');
    }
    // TODO: Implement the necessary function to fetch the `users` collection or table
  },

  getUserByID: async(idUserToGet) => {
    try {
      const userByID = await User.findById({"_id":idUserToGet});
      console.log('c/u getUserByID Usuarios de la collección: ',userByID !== null);
      if (userByID !== null){
        return {
          id:userByID._id.toString(),
          email:userByID.email,
          role:userByID.role
        };
      }
      return userByID;
    } catch(error){
      console.log('Error al buscar persona por ID: ', error);
      throw new Error(`Error al buscar persona por ID: ${idUserToGet}`);
    }
  },

  getUserByEmail: async(email) => {
    try {
      const userByEmail = await User.find({"email":email});
      console.log(`Usuarios en la collección con ${email}: `, userByEmail);
      if ( userByEmail.length > 0 ){
        return {
          id:userByEmail[0]._id,
          email:userByEmail[0].email,
          role:userByEmail[0].role
        };
    }
      return null;
    } catch(error){
      console.log('Error al buscar persona por email: ', error);
      throw new Error(`Error al buscar persona por email: ${email}`);
    }
  },

  saveUser: async(user) => {
    try{
      const newUser =await User(user).save();
      const savedUser = {'id':newUser._id.toString(), 'email':newUser.email,'role':newUser.role}
      return savedUser;
    } catch (error){
      throw error;
    }
  },

  putUser: async(userIdentifier, newUserData) => {
    console.log('c/u putUser userIdentifier: ', userIdentifier);
    try{
      const userToUpdate = (userIdentifier.includes('@'))? await module.exports.getUserByEmail(userIdentifier) : await module.exports.getUserByID(userIdentifier);
        if(userToUpdate){
          const idUserToUpdate = userToUpdate.id
          console.log('c/u putUser userToUpdate: ', userToUpdate);
          await User.findOneAndUpdate(
            { "_id": userToUpdate.id },
            {
              $set: {
                "email": newUserData.email,
                "password": newUserData.password,
                "role": newUserData.role,
              },
            }
          );
          const updatedUserBD = await module.exports.getUserByID(idUserToUpdate);
          console.log('c/u putUser updatedUserBD: ', updatedUserBD);
          return updatedUserBD;
        } else {
          return undefined
        }
    }catch(error){
      console.log('c/u putUser error: ', error);
      throw new Error(`Error al intentar actualizar la información del usuario: ${userIdentifier}`);
    }
  },

  deleteUser: async(userIdentifier) => {
    try{
      const userToDelete = (userIdentifier.includes('@'))? await module.exports.getUserByEmail(userIdentifier) : await module.exports.getUserByID(userIdentifier);
      if (userToDelete === null){
        return undefined;
      } else {
        const idUserToUpdate = userToDelete.id
        console.log('c/u deleteUser userToDelete: ', userToDelete);
        await User.findOneAndDelete(
          { "_id": userToDelete.id }
        );
        const userToDeleteBD = await module.exports.getUserByID(idUserToUpdate);
        console.log('c/u putUser userToDeleteBD: ', userToDeleteBD);
        return (userToDeleteBD === null ? userToDelete:'Error al borrar a la usuaria');
      }

    }catch(error){
      console.log('c/u putUser error: ', error);
      throw new Error(`No se pudo borrar el usuario con ID: ${userIdentifier}`);
    }
  },
};
