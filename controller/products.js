const Product = require('../models/products');

module.exports = {
  getProducts: async() => {
    try {
      const allProducts = await Product.find();
      // console.log('Productos de la collección: ',allOrders);
      return allProducts;
    } catch(error){
      // console.log('c/p Error al buscar todos los productos:', error);
      throw new Error('No se pudo consultar la información de los productos');
    }
  },

  getProductByID: async(idProductToGet) => {
    try {
      const productByID = await Product.findById({"_id":idProductToGet});
      // console.log('c/p getProductByID Producto en la collección: ', productByID);
      return productByID;
    } catch(error){
      // console.log('c/p Error al buscar producto por ID: ', error);
      // throw new Error(`No se pudo consultar la información del producto con ID: ${idProductToGet}`);
      return null;
    }
  },

  postProduct: async(newProductData) =>{
    try {
      return await Product(newProductData).save()
    } catch(error){
      // mejorar el manejo del error
      throw new Error('No se puedo guardar el producto nuevo');
    }
  },

  patchProduct: async(idProductToUpdate, newProductToUpdate)=>{
    const productToUpdate = await module.exports.getProductByID(idProductToUpdate);
    // console.log('c/p patchProduct: ',productToUpdate);
    // console.log('c/p newProductToUpdate: ',newProductToUpdate);
    try{
      if(productToUpdate){
        // console.log('maya: ');
        const maya = await Product.findByIdAndUpdate({'_id': idProductToUpdate},newProductToUpdate)
        // console.log('maya: ',maya);
        return await module.exports.getProductByID(idProductToUpdate)
      } else {
        return undefined
      }
    }catch(error){
      throw new Error(`No se pudo actualizar la información del producto con ID: ${idProductToUpdate}`);
    }
  },

  deleteProduct: async(idProductToDelete) => {
    try {
      const productToDelete = await module.exports.getProductByID(idProductToDelete);
      // Temp coment console.log('c/p deleteProduct productToDelete: ', productToDelete);

      if (productToDelete){
        await Product.findOneAndDelete({ "_id": idProductToDelete });
        const productDeleted = await module.exports.getProductByID(idProductToDelete);
        console.log('c/p deleteProduct productDeleted: ', productDeleted);
        return (!productDeleted ? productToDelete: 'Error al borrar el producto')
      }else{
        return undefined;
      }
    }catch(error){
      throw new Error(`No se pudo borrar el producto con ID: ${idProductToDelete}`);
    }
  }
}