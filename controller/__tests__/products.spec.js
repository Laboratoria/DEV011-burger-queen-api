const { 
  getProducts,
  getProductByID,
  postProduct
} = require("../products");

const Product = require('../../models/products');

const mockProducts = [{
  '_id': '111111',
  'name': 'Agua',
  'price': 10,
  'type': 'Bebida',
  'dateEntry': '2023-08-05',
},
{
  '_id': '321654',
  'name': 'Bolillo',
  'price': 15,
  'type': 'Desayuno',
  'dateEntry': '2023-10-05',
},
{
  '_id': '333333',
  'name': 'Quesadilla',
  'price': 20,
  'type': 'Comida',
  'dateEntry': '2022-12-05',
}];

const mockProductWithId = mockProducts.filter((doc)=>doc._id === '321654')
const mockProduct = {
  'name': 'Quesadilla',
  'price': 20,
  'type': 'Comida',
  'dateEntry': '2022-12-05',
}

let mockBehavior = 'resolve';

// Mock de las funcionalidades de mongoose
jest.mock('../../models/products', () => ({
  find: jest.fn(()=>{
    if (mockBehavior === 'resolve') {
      return Promise.resolve(mockProducts);
    } else {
      return Promise.reject(new Error('Error simulado'));
    }
  }),
  findById: jest.fn(({"_id":id})=>{
    if (id === '321654') {
      return Promise.resolve(mockProductWithId);
    } else {
      return Promise.reject(new Error(`Error simulado ${id}`));
    }
  }),
    save:jest.fn(()=>{
      if (mockBehavior === 'resolve') {
        return Promise.resolve({'_id':'123' ,...mockProduct});
      } else {
        return Promise.reject(new Error('Error simulado'))
      }
    })
}));

describe('getProducts', () => {
  it('Debe mandar una colección', async () => {
    mockBehavior = 'resolve';
    await expect(getProducts()).resolves.toEqual(mockProducts);
    expect(Product.find).toHaveBeenCalled();
  });
  it('Debería mandar un error', async () => {
    mockBehavior = 'reject';
    await expect(getProducts()).rejects.toThrow('Error simulado');
    expect(Product.find).toHaveBeenCalled();
  });
});

describe('getProductByID', () => {
  it('Debe mandar un documento de la colección de productos', async () => {
    await expect(getProductByID('321654')).resolves.toEqual(mockProductWithId)
    expect(Product.findById).toHaveBeenCalled();
  });
  it('Debería mandar un error', async () => {
    await expect(getProductByID('123456')).rejects.toThrow('Error simulado');
    expect(Product.findById).toHaveBeenCalled();
  });
})

describe('postProduct', () => {
  it('Debe mandar el documento guardado', async () => {
    mockBehavior = 'resolve';
    await expect(postProduct()).resolves.toEqual(mockProduct)
    //expect(Product.save).toHaveBeenCalled();
  });
  it('Debería mandar un error', async () => {
    mockBehavior = 'reject';
    await expect(postProduct()).rejects.toThrow('Error simulado');
    //expect(Product.save).toHaveBeenCalled();
  });
})