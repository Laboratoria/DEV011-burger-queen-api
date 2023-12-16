const { 
  getProducts,
  getProductByID,
  postProduct,
  patchProduct,
  deleteProduct
} = require("../products");

const Product = require('../../models/products');

/* describe('getProducts', () => {
  it('should get products collection', (done) => {
    done();
  });
}); */

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

// let mockBehavior = 'resolve';

// Mock de las funcionalidades de mongoose
// mock implementation once
jest.mock('../../models/products', () => ({
  find: jest.fn(),
  findById:jest.fn(),
  save: jest.fn(),
  findByIdAndUpdate:jest.fn(),
  findOneAndDelete:jest.fn()
}));

describe('getProducts', () => {
  it('Debe mandar una colección', async () => {
    Product.find.mockResolvedValueOnce(mockProducts)
    await expect(getProducts()).resolves.toEqual(mockProducts);
    expect(Product.find).toHaveBeenCalled();
  });
  it('Debería mandar un error', async () => {
    Product.find.mockRejectedValueOnce(new Error('No se pudo consultar la información de los productos'))
    await expect(getProducts()).rejects.toThrow('No se pudo consultar la información de los productos');
    expect(Product.find).toHaveBeenCalled();
  });
});

describe('getProductByID', () => {
  it('Debe mandar un documento de la colección de productos', async () => {
    Product.findById.mockResolvedValueOnce(mockProductWithId)
    await expect(getProductByID('321654')).resolves.toEqual(mockProductWithId)
    expect(Product.findById).toHaveBeenCalled();
  });
  it('Debería mandar un error', async () => {
    Product.findById.mockRejectedValueOnce(new Error('No se pudo consultar la información del producto con ID: 123456'))
    await expect(getProductByID('123456')).rejects.toThrow('No se pudo consultar la información del producto con ID: 123456');
    expect(Product.findById).toHaveBeenCalled();
  });
});

describe.skip('postProduct', () => {
  it('Debe mandar el documento guardado', async () => {
    Product.save.mockResolvedValueOnce({'_id':'123' ,...mockProduct})
    await expect(postProduct()).resolves.toEqual({'_id':'123' ,...mockProduct})
    expect(Product.save).toHaveBeenCalled();
  });
  it('Debería mandar un error', async () => {
    Product.save.mockRejectedValueOnce(new Error('No se puedo guardar el producto nuevo'))
    await expect(postProduct()).rejects.toThrow('No se puedo guardar el producto nuevo');
    expect(Product.save).toHaveBeenCalled();
  });
});

describe('patchProduct', () => {
  it('Debe mandar un documento actualizado de la colección de productos', async () => {
    Product.findById.mockReset()
    Product.findByIdAndUpdate.mockReset()

    Product.findById.mockResolvedValue(mockProductWithId)
    Product.findByIdAndUpdate.mockResolvedValueOnce(mockProductWithId)

    await expect(patchProduct('321654',mockProduct)).resolves.toEqual(mockProductWithId)
    expect(Product.findById).toHaveBeenCalled();
    expect(Product.findByIdAndUpdate).toHaveBeenCalled();
  });
  it('Debe mandar undefined', async () => {
    Product.findById.mockReset()
    Product.findById.mockResolvedValueOnce(null)

    await expect(patchProduct('321654',mockProduct)).resolves.toEqual(undefined)
    expect(Product.findById).toHaveBeenCalled();
  });
  it('Debería mandar un error', async () => {
    Product.findById.mockReset()
    Product.findByIdAndUpdate.mockReset()

    Product.findById.mockResolvedValue(mockProductWithId)
    Product.findByIdAndUpdate.mockRejectedValueOnce(new Error('No se pudo actualizar la información del producto con ID: 123456'))
    
    await expect(patchProduct('123456',mockProduct)).rejects.toThrow('No se pudo actualizar la información del producto con ID: 123456');
    expect(Product.findById).toHaveBeenCalled();
    expect(Product.findByIdAndUpdate).toHaveBeenCalled();
  });
});

describe('deleteProduct', () => {
  it('Debe mandar un documento de la colección de productos', async () => {
    Product.findById.mockReset()
    Product.findOneAndDelete.mockReset()
    
    Product.findById.mockResolvedValueOnce(mockProductWithId)
    Product.findOneAndDelete.mockImplementationOnce(() => Promise.resolve());;
    Product.findById.mockResolvedValueOnce(null)
    
    await expect(deleteProduct('321654')).resolves.toEqual(mockProductWithId)
    expect(Product.findById).toHaveBeenCalledTimes(2);
    expect(Product.findOneAndDelete).toHaveBeenCalledTimes(1);
  });
  
  it('Debe mandar undefined', async () => {
    Product.findById.mockReset()
    Product.findById.mockResolvedValueOnce(null)
    
    await expect(deleteProduct('321654')).resolves.toEqual(undefined)
    expect(Product.findById).toHaveBeenCalledTimes(1);
  });

  it('Debería mandar un error al borrar el producto (1)', async () => {
    Product.findById.mockReset()
    Product.findOneAndDelete.mockReset()

    Product.findById.mockResolvedValueOnce(mockProductWithId)
    Product.findOneAndDelete.mockImplementationOnce(() => Promise.resolve());;
    Product.findById.mockResolvedValueOnce(mockProductWithId)

    await expect(deleteProduct('123456')).resolves.toEqual('Error al borrar el producto');
    expect(Product.findById).toHaveBeenCalledTimes(2);
    expect(Product.findOneAndDelete).toHaveBeenCalled();
  });

  it('Debería mandar un error al borrar el producto (2)', async () => {
    Product.findById.mockReset()
    Product.findOneAndDelete.mockReset()
    
    Product.findById.mockResolvedValueOnce(mockProductWithId)
    Product.findOneAndDelete.mockImplementationOnce(() => Promise.reject());;

    await expect(deleteProduct('123456')).rejects.toThrow('No se pudo borrar el producto con ID: 123456');
    expect(Product.findById).toHaveBeenCalledTimes(1);
    expect(Product.findOneAndDelete).toHaveBeenCalledTimes(1);
  });


});