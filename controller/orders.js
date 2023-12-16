const Order = require('../models/orders');

module.exports = {
  getOrders: async() => {
    try {
      const allOrders = await Order.find();
      // console.log('Ordenes de la collección: ',allOrders);
      return allOrders;
    } catch(error){
      // console.log('Error al buscar todas las ordenes:', error);
      throw error;
    }
  },

  getOrderByID: async(idOrderToGet) => {
    try {
      const orderByID = await Order.findById({"_id":idOrderToGet});
      console.log('c/o getOrderByID Orden en la collección: ', orderByID);
      return orderByID;
    } catch(error){
      console.log('Error al buscar orden por ID: ', error);
      throw error;
    }
  },
  postOrder: async(newOrderData) =>{
    try {
      return await Order(newOrderData).save()
    } catch(error){
      throw error;
    }
  },

  patchOrder: async(idOrderToUpdate, newOrderToUpdate)=>{
    try{
      const orderToUpdate = await module.exports.getOrderByID(idOrderToUpdate);
      console.log('c/o patchOrder: ',orderToUpdate);
      console.log('c/o newOrderToUpdate: ',newOrderToUpdate);
      if(orderToUpdate){
        const maya = await Order.findByIdAndUpdate({'_id': idOrderToUpdate},newOrderToUpdate)
        console.log('maya: ',maya);
        return await module.exports.getOrderByID(idOrderToUpdate)
      } else {
        return undefined
      }
    }catch(error){
      throw error;
    }
  },
  deleteOrder: async(idOrderToDelete) => {
    try {
      const orderToDelete = await module.exports.getOrderByID(idOrderToDelete);
      console.log('c/o deleteOrder orderToDelete: ', orderToDelete);

      if (orderToDelete){
        await Order.findOneAndDelete({ "_id": idOrderToDelete });
        const orderDeleted = await module.exports.getOrderByID(idOrderToDelete);
        console.log('c/o deleteOrder orderDeleted: ', orderDeleted);
        return (!orderDeleted ? orderToDelete: 'Error al borrar la orden')
      }else{
        return undefined;
      }
    }catch(error){
      throw new Error(`No se pudo borrar la orden con ID: ${idOrderToDelete}`);
    }
  }
}