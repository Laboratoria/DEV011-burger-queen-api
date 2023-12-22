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
      // Temp coment console.log('c/o getOrderByID Orden en la collección: ', orderByID);
      return orderByID;
    } catch(error){
      // Temp coment console.log('Error al buscar orden por ID: ', error);
      return null;
    }
  },
  postOrder: async(newOrderData) =>{
    try {
      newOrderData.dateEntry = Date.now()
      return await Order(newOrderData).save()
    } catch(error){
      throw error;
    }
  },

  patchOrder: async(idOrderToUpdate, newOrderToUpdate)=>{
    try{
      const orderToUpdate = await module.exports.getOrderByID(idOrderToUpdate);
      // Temp coment console.log('c/o patchOrder: ',orderToUpdate);
      // Temp coment console.log('c/o newOrderToUpdate: ',newOrderToUpdate);
      if(orderToUpdate){
        newOrderToUpdate.dateProcessed = Date.now();
        const maya = await Order.findByIdAndUpdate({'_id': idOrderToUpdate},newOrderToUpdate)
        // Temp coment console.log('maya: ',maya);
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
      // Temp coment console.log('c/o deleteOrder orderToDelete: ', orderToDelete);

      if (orderToDelete){
        await Order.findOneAndDelete({ "_id": idOrderToDelete });
        const orderDeleted = await module.exports.getOrderByID(idOrderToDelete);
        // Temp coment console.log('c/o deleteOrder orderDeleted: ', orderDeleted);
        return (!orderDeleted ? orderToDelete: 'Error al borrar la orden')
      }else{
        return undefined;
      }
    }catch(error){
      throw new Error(`No se pudo borrar la orden con ID: ${idOrderToDelete}`);
    }
  }
}