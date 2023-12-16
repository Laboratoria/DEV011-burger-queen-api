const { 
  getOrders,
  getOrderByID,
  postOrder,
  patchOrder,
  deleteOrder
} = require("../orders");

const Order = require('../../models/orders');


/* describe('getOrders', () => {
  it('should get orders collection', (done) => {
    done();
  });
}); */

const mockOrders = [
  {
    '_id': '987654',
    'userId': '15254',
    'client': 'Akira',
    'orders': [
      {
        'qty': 1,
        'order': {
          'id': 1214,
          'name': 'café',
          'price': 220,
          'type': 'Desayuno',
          'dateEntry': '2022-03-05 15:14:10'
        }
      }
    ],
    'status': 'pending',
  },
  {
    '_id': '654321',
    'userId': '753861',
    'client': 'Gasper',
    'orders': [
      {
        'qty': 0,
        'order': {
          'id': 1214,
          'name': 'Quesadilla',
          'price': 50,
          'type': 'Desayuno',
          'dateEntry': '2022-03-05 15:14:10'
        }
      }
    ],
    'status': 'delivered',
  }
]
const mockOrderWithId = mockOrders.filter((doc)=>doc._id === '654321')

const mockOrder =   {
  '_id': '987654',
  'userId': '15254',
  'client': 'Akira',
  'orders': [
    {
      'qty': 1,
      'order': {
        'id': 1214,
        'name': 'café',
        'price': 220,
        'type': 'Desayuno',
        'dateEntry': '2022-03-05 15:14:10'
      }
    }
  ],
  'status': 'pending',
}

// let mockBehavior = 'resolve';

// Mock de las funcionalidades de mongoose
// mock implementation once
jest.mock('../../models/orders', () => ({
  find: jest.fn(),
  findById:jest.fn(),
  save: jest.fn(),
  findByIdAndUpdate:jest.fn(),
  findOneAndDelete:jest.fn()
}));

describe('getOrders', () => {
  it('Debe mandar una colección', async () => {
    Order.find.mockResolvedValueOnce(mockOrders)
    await expect(getOrders()).resolves.toEqual(mockOrders);
    expect(Order.find).toHaveBeenCalled();
  });
  it('Debería mandar un error', async () => {
    Order.find.mockRejectedValueOnce(new Error('No se pudo consultar la información de las ordenes'))
    await expect(getOrders()).rejects.toThrow('No se pudo consultar la información de las ordenes');
    expect(Order.find).toHaveBeenCalled();
  });
});

describe('getOrderByID', () => {
  it('Debe mandar un documento de la colección de las ordenes', async () => {
    Order.findById.mockResolvedValueOnce(mockOrderWithId)
    await expect(getOrderByID('321654')).resolves.toEqual(mockOrderWithId)
    expect(Order.findById).toHaveBeenCalled();
  });
  it('Debería mandar un error', async () => {
    Order.findById.mockRejectedValueOnce(new Error('No se pudo consultar la información del ordero con ID: 654321'))
    await expect(getOrderByID('654321')).rejects.toThrow('No se pudo consultar la información del ordero con ID: 654321');
    expect(Order.findById).toHaveBeenCalled();
  });
});

describe.skip('postOrder', () => {
  it('Debe mandar el documento guardado', async () => {
    Order.save.mockResolvedValueOnce({'_id':'123' ,...mockOrder})
    await expect(postOrder()).resolves.toEqual({'_id':'123' ,...mockOrder})
    expect(Order.save).toHaveBeenCalled();
  });
  it('Debería mandar un error', async () => {
    Order.save.mockRejectedValueOnce(new Error('No se puedo guardar la orden nueva'))
    await expect(postOrder()).rejects.toThrow('No se puedo guardar la orden nueva');
    expect(Order.save).toHaveBeenCalled();
  });
});

describe('patchOrder', () => {
  it('Debe mandar un documento actualizado de la colección de las ordenes', async () => {
    Order.findById.mockReset()
    Order.findByIdAndUpdate.mockReset()

    Order.findById.mockResolvedValue(mockOrderWithId)
    Order.findByIdAndUpdate.mockResolvedValueOnce(mockOrderWithId)

    await expect(patchOrder('321654',mockOrder)).resolves.toEqual(mockOrderWithId)
    expect(Order.findById).toHaveBeenCalled();
    expect(Order.findByIdAndUpdate).toHaveBeenCalled();
  });
  it('Debe mandar undefined', async () => {
    Order.findById.mockReset()
    Order.findById.mockResolvedValueOnce(null)

    await expect(patchOrder('321654',mockOrder)).resolves.toEqual(undefined)
    expect(Order.findById).toHaveBeenCalled();
  });
  it('Debería mandar un error', async () => {
    Order.findById.mockReset()
    Order.findByIdAndUpdate.mockReset()

    Order.findById.mockResolvedValue(mockOrderWithId)
    Order.findByIdAndUpdate.mockRejectedValueOnce(new Error('No se pudo actualizar la información del ordero con ID: 654321'))
    
    await expect(patchOrder('654321',mockOrder)).rejects.toThrow('No se pudo actualizar la información del ordero con ID: 654321');
    expect(Order.findById).toHaveBeenCalled();
    expect(Order.findByIdAndUpdate).toHaveBeenCalled();
  });
});

describe('deleteOrder', () => {
  it('Debe mandar un documento de la colección de las ordenes', async () => {
    Order.findById.mockReset()
    Order.findOneAndDelete.mockReset()
    
    Order.findById.mockResolvedValueOnce(mockOrderWithId)
    Order.findOneAndDelete.mockImplementationOnce(() => Promise.resolve());;
    Order.findById.mockResolvedValueOnce(null)
    
    await expect(deleteOrder('321654')).resolves.toEqual(mockOrderWithId)
    expect(Order.findById).toHaveBeenCalledTimes(2);
    expect(Order.findOneAndDelete).toHaveBeenCalledTimes(1);
  });
  
  it('Debe mandar undefined', async () => {
    Order.findById.mockReset()
    Order.findById.mockResolvedValueOnce(null)
    
    await expect(deleteOrder('321654')).resolves.toEqual(undefined)
    expect(Order.findById).toHaveBeenCalledTimes(1);
  });

  it('Debería mandar un error al borrar la orden (1)', async () => {
    Order.findById.mockReset()
    Order.findOneAndDelete.mockReset()

    Order.findById.mockResolvedValueOnce(mockOrderWithId)
    Order.findOneAndDelete.mockImplementationOnce(() => Promise.resolve());;
    Order.findById.mockResolvedValueOnce(mockOrderWithId)

    await expect(deleteOrder('654321')).resolves.toEqual('Error al borrar la orden');
    expect(Order.findById).toHaveBeenCalledTimes(2);
    expect(Order.findOneAndDelete).toHaveBeenCalled();
  });

  it('Debería mandar un error al borrar la orden (2)', async () => {
    Order.findById.mockReset()
    Order.findOneAndDelete.mockReset()
    
    Order.findById.mockResolvedValueOnce(mockOrderWithId)
    Order.findOneAndDelete.mockImplementationOnce(() => Promise.reject());;

    await expect(deleteOrder('654321')).rejects.toThrow('No se pudo borrar la orden con ID: 654321');
    expect(Order.findById).toHaveBeenCalledTimes(1);
    expect(Order.findOneAndDelete).toHaveBeenCalledTimes(1);
  });

});