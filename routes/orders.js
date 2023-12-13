const { requireAuth } = require('../middleware/auth');
// const mongoose = require('mongoose');
// const ObjectId = mongoose.Types.ObjectId;

const {
  getOrders,
  getOrderByID,
  postOrder,
  deleteOrder,
  patchOrder,
} = require('../controller/orders');

module.exports = (app, nextMain) => {
  app.get('/orders', requireAuth, async (req, resp, next) => {
    try {
      const allOrders = await getOrders();
      resp.json(allOrders);
    } catch (error) {
      resp.status(500).json({ 'error': error });
    }
  });

  app.get('/orders/:orderId', requireAuth, async (req, resp, next) => {
    try {
      const idOrder = req.params.orderId;
      console.log('r/c getById idOrder: ', idOrder);
      const orderByID = await getOrderByID(idOrder);
      console.log('r/o getById orderByID: ', orderByID);
      if (orderByID === null) {
        resp.status(404).json({ 'error': 'la orden solicitada no existe' });
      } else {
        resp.json(orderByID);
      }
    } catch (error) {
      resp.status(404).json({ 'error': 'la orden solicitada no existe' });
    }
  });

  app.post('/orders', requireAuth, async (req, resp, next) => {
    try {
      const newOrderData = req.body;
      console.log('r/o newOrderData.userId: ', newOrderData.userId); // change id to ObjetID
      console.log('r/o newOrderData.products: ', newOrderData.products); // change id to ObjetID
      console.log('r/o newOrderData: ', newOrderData.status); // change id to ObjetID
      if (!newOrderData.userId) {
        resp.status(400).json({ error: 'no se indica userId' });
      } else if (!newOrderData.products || !newOrderData.status) {
        resp
          .status(400)
          .json({
            error: 'Se intenta crear una orden sin productos o/y sin status',
          });
      } else if (!newOrderData.userId) {
        resp
          .status(400)
          .json({
            error: 'Se intenta crear una orden sin userId',
          });
      } else {
        const newOrder = await postOrder(newOrderData);
        resp.status(201).json(newOrder);
      }
    } catch (error) {
      console.log('r/o postOrder error: ', error);
      resp.status(555).json(error);
    }
  });

  app.put('/orders/:orderId', requireAuth, async (req, resp, next) => {
    const newOrderToUpdate = req.body;
    const idOrderToUpdate = req.params.orderId;
    const statuses = ['pending', 'canceled', 'delivering', 'delivered']

    try {
      if (Object.keys(newOrderToUpdate).length === 0) {
        resp.status(400).json({'error':'No se indican ninguna propiedad a modificar'})
      }else if (newOrderToUpdate.status && !statuses.includes(newOrderToUpdate.status)) {
        resp.status(400).json({'error':'La propiedad status no es valida'});
      } else {
        const orderUpdated = await patchOrder(idOrderToUpdate, newOrderToUpdate);
        if (orderUpdated === undefined) {
          resp
            .status(404)
            .json({ error: 'La order con orderId indicado no existe' });
        } else {
          resp.json(orderUpdated);
        }
      }
    } catch (error) {
      console.log('r/o putOrder error: ', error);
      resp.status(555).json(error);
    }
  });

  app.delete('/orders/:orderId', requireAuth, async (req, resp, next) => {
    const orderId = req.params.orderId;
    try {
      const deletedOrder = await deleteOrder(orderId);
      console.log('r/u delete deletedUser: ', deletedOrder);
      if (deletedOrder === null) {
        resp
          .status(404)
          .json({ error: 'Error la orden solicitada no existe(4)' });
      } else {
        resp.json(deletedOrder);
      }
    } catch (error) {
      resp
        .status(500)
        .json({
          error:
            'Error interno del servidor, no se pudo actualizar la información',
        });
    }
  });

  nextMain();
};
