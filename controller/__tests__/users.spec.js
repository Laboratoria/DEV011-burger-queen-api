const {
  getUsers,
} = require('../users');

const User = require('../../models/users');

describe('getUsers', () => {
  it('should get users collection', (done) => {
    done();
  });
});

// Mock de la función `find` de Mongoose
jest.mock('../../models/users', () => ({
  find: jest.fn()
}));

describe('getUsers', () => {
  it('debería obtener usuarios correctamente', async () => {
    // Configurar el comportamiento del mock
    const mockUsers = [{
      '_id': '123456789012345678901234',
      'email': 'admin@localhost',
      'password': '1$m5m%1$a5a$1bb%55%$$a2a25a2am1%15m%m$$m222112b$a$mba1ba$%b1',
      'role': 'admin'
    }];
    User.find.mockResolvedValue(mockUsers);

    // Llamar a la función y esperar que devuelva los usuarios simulados
    const result = await getUsers();

    expect(result).toEqual(mockUsers);

    // Opcional: Verificar que la función de Mongoose fue llamada correctamente
    expect(User.find).toHaveBeenCalled();
  });

  it('debería manejar errores correctamente', async () => {
    // Configurar el mock para simular un error
    const mockError = new Error('Error simulado');
    User.find.mockRejectedValue(mockError);

    // Llamar a la función y esperar que lance el error simulado
    await expect(getUsers()).rejects.toThrow(mockError);

    // Opcional: Verificar que la función de Mongoose fue llamada correctamente
    expect(User.find).toHaveBeenCalled();
  });
});