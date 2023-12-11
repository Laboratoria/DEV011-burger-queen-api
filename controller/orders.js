const Order = require('../models/orders');

module.exports = {
  getOrders: async() => {
    try {
      const allOrders = await Order.find();
      // console.log('Ordenes de la collección: ',allOrders);
      return allOrders;
    } catch(error){
      console.error('Error al buscar todas las ordenes:', error);
      throw error;
    }
    },
  
    getOrderByID: async(idOrderToGet) => {
    try {
      const orderByID = await Order.findById({"_id":idOrderToGet});
      console.log('c/o getOrderByID Orden en la collección: ', orderByID);
      return orderByID;
    } catch(error){
      console.error('Error al buscar orden por ID: ', error);
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
        return null;
      }
    }catch(error){
      throw error;
    }
  }
}