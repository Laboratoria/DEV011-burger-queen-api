const {
  requireAuth,
  requireAdmin,
} = require('../middleware/auth');

const {
  getProducts,
  getProductByID,
  deleteProduct,
  postProduct,
  patchProduct
} = require('../controller/products')

module.exports = (app, nextMain) => {

  app.get('/products', requireAuth, async (req, resp, next) => {
    try {
      const allProducts = await getProducts();
      resp.json(allProducts);
    } catch (error) {
      resp.status(500).json({ 'error': error });
    }
  });

  app.get('/products/:productId', requireAuth, async (req, resp, next) => {
    try {
      const idProduct = req.params.productId;
      // Temp coment console.log('r/p getById idProduct: ', idProduct);
      const productByID = await getProductByID(idProduct);
      // Temp coment console.log('r/p getById productByID: ', productByID);
      if (productByID === null) {
        resp.status(404).json({ 'error': 'El producto solicitado no existe' });
      } else {
        resp.json(productByID);
      }
    } catch (error) {
      resp.status(404).json({ 'error': 'El producto solicitado no existe' });
    }
  });

  app.post('/products', requireAdmin, async (req, resp, next) => {
    try {
      const newProductData = req.body;
      // Temp coment console.log('r/p newProductData.name: ', newProductData.name); // change id to ObjetID
      // Temp coment console.log('r/p newProductData.price: ', newProductData.price); // change id to ObjetID
      // console.log('r/p newProductData: ', newProductData); // change id to ObjetID
      if (!newProductData.name) {
        resp
          .status(400)
          .json({
            error: 'Se intenta crear un producto sin nombre',
          });
      } else if (!newProductData.price) {
        resp
          .status(400)
          .json({
            error: 'Se intenta crear un produco sin precio',
          });
      } else {
        const newProduct = await postProduct(newProductData);
        resp.status(201).json(newProduct);
      }
    } catch (error) {
      // console.log('r/p postProduct error: ', error);
      resp.status(555).json(error);
    }
  });

  app.put("/products/:productId", requireAdmin, async (req, resp, next) => {
    const newProductToUpdate = req.body;
    // console.log('r/p put newProductToUpdate: ', newProductToUpdate);
    const idProductToUpdate = req.params.productId;
    // console.log('r/p put idProductToUpdate: ', idProductToUpdate);
    const productToUpdate = await getProductByID(idProductToUpdate);
    // console.log('r/p put productToUpdate: ', productToUpdate);
    if (Object.keys(newProductToUpdate).length === 0 || (newProductToUpdate.price && isNaN(Number(newProductToUpdate.price)))) {
      resp.status(400).json({ error: "No se indican ninguna propiedad a modificar" });
    } else if (productToUpdate === null) {
      resp.status(404).json({ error: "El producto con productId indicado no existe" });
    } else {
      try {
        const productUpdated = await patchProduct(idProductToUpdate, newProductToUpdate);
        resp.status(200).json(productUpdated);

      } catch (error) {
        // Temp coment console.log('r/p putProduct error: ', error);
        resp.status(555).json(error);
      }
    }
  });

  app.delete('/products/:productId', requireAdmin, async (req, resp, next) => {
    const productId = req.params.productId;
    // Temp coment console.log('r/p delete productId:',productId);
    try {
      const deletedProduct = await deleteProduct(productId);
      // Temp coment console.log('r/p delete deletedProduct: ', deletedProduct);
      if (deletedProduct === undefined) {
        resp.status(404).json({ 'error': 'Error el producto solicitado no existe(4)' });
      } else if (deleteProduct === null) {
        resp.status(500).json({ 'error': 'No se pudo actualizar la información' });
      } else {
        resp.json(deletedProduct);
      }
    } catch (error) {
      resp.status(500).json({ 'error': 'Error interno del servidor, no se pudo actualizar la información' });
    }
  });

  nextMain();
};
