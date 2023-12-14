const {
  getOrders,
  getOrderByID
} = require('../orders');

const Order = require('../../models/orders');

let mockBehavior = 'resolve';

const mockOrders = [
  {
    '_id': '987654',
    'userId': '15254',
    'client': 'Akira',
    'products': [
      {
        'qty': 1,
        'product': {
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
    'products': [
      {
        'qty': 0,
        'product': {
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
const mockOrdertWithId = mockOrders.filter((doc)=>doc._id === '654321')

jest.mock('../../models/orders', () => ({
  find: jest.fn(() => {
    if (mockBehavior === 'resolve') {
      return Promise.resolve(mockOrders);
    } else {
      return Promise.reject(new Error('Error simulado'))
    }
  }),
  findById: jest.fn(({"_id":id})=>{
    if (id === '654321') {
      return Promise.resolve(mockOrdertWithId);
    } else {
      return Promise.reject(new Error(`Error simulado ${id}`));
    }
  }),
}));

describe('getOrders', () => {
  it('Debe mandar una colección', async() => {
    mockBehavior = 'resolve';
    await expect(getOrders()).resolves.toEqual(mockOrders);
    expect(Order.find).toHaveBeenCalled();
  });
  it('Debería mandar un error', async () => {
    mockBehavior = 'reject';
    await expect(getOrders()).rejects.toThrow('Error simulado');
    expect(Order.find).toHaveBeenCalled();
  });
});

describe('getOrderByID', () => {
  it('Debe mandar un documento de la colección de ordenes', async () => {
    await expect(getOrderByID('654321')).resolves.toEqual(mockOrdertWithId)
    expect(Order.findById).toHaveBeenCalled();
  });
  it('Debería mandar un error', async () => {
    await expect(getOrderByID('123456')).rejects.toThrow('Error simulado');
    expect(Order.findById).toHaveBeenCalled();
  });
});