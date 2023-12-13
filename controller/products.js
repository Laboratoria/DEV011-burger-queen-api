const Product = require('../models/products');

module.exports = {
  getProducts: async() => {
    try {
      const allProducts = await Product.find();
      // console.log('Productos de la collección: ',allOrders);
      return allProducts;
    } catch(error){
      console.error('c/p Error al buscar todos los productos:', error);
      throw error;
    }
  },

  getProductByID: async(idProductToGet) => {
    try {
      const productByID = await Product.findById({"_id":idProductToGet});
      console.log('c/p getProductByID Producto en la collección: ', productByID);
      return productByID;
    } catch(error){
      console.error('c/p Error al buscar producto por ID: ', error);
      throw error;
    }
  },

  postProduct: async(newProductData) =>{
    try {
      return await Product(newProductData).save()
    } catch(error){
      throw error;
    }
  },

  patchProduct: async(idProductToUpdate, newProductToUpdate)=>{
    try{
      const productToUpdate = await module.exports.getProductByID(idProductToUpdate);
      console.log('c/p patchProduct: ',productToUpdate);
      console.log('c/p newProductToUpdate: ',newProductToUpdate);
      if(productToUpdate){
        const maya = await Product.findByIdAndUpdate({'_id': idProductToUpdate},newProductToUpdate)
        console.log('maya: ',maya);
        return await module.exports.getProductByID(idProductToUpdate)
      } else {
        return undefined
      }
    }catch(error){
      throw error;
    }
  },

  deleteProduct: async(idProductToDelete) => {
    try {
      const productToDelete = await module.exports.getProductByID(idProductToDelete);
      console.log('c/o deleteProduct productToDelete: ', productToDelete);

      if (productToDelete){
        await Product.findOneAndDelete({ "_id": idProductToDelete });
        const productDeleted = await module.exports.getProductByID(idProductToDelete);
        console.log('c/o deleteProduct productDeleted: ', productDeleted);
        return (!productDeleted ? productToDelete: undefined)
      }else{
        return null;
      }
    }catch(error){
      throw error;
    }
  }
}