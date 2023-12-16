const {
  getUsers,
  getUsersJSON,
  getUserByID,
  getUserByEmail,
  saveUser,
  putUser,
  deleteUser
} = require('../users');

const User = require('../../models/users');

/* describe('getUsers', () => {
  it('should get users collection', (done) => {
    done();
  });
}); */

// Mock de la función `find` de Mongoose
jest.mock('../../models/users', () => ({
  find: jest.fn(),
  findById:jest.fn(),
  save: jest.fn(),
  findOneAndUpdate:jest.fn(),
  findOneAndDelete:jest.fn()
}));

const mockUsers = [
  {
    '_id': '951842',
    'email': 'maye@loca',
    'password': '1$m5m%1$a5a$1bb%55%$$a2a25a2am1%15m%m$$m222112b$a$mba1ba$%b1',
    'role': 'chef'
  },
  {
    '_id': '159263',
    'email': 'otro@user',
    'password': 'm$$m222112b$a$mba1ba$%b11$m5m%1$a5a$1bb%55%$$125rd$135fg15m%',
    'role': 'admin'
  }
];

const mockUserWithId = {
  '_id': '159263',
  'email': 'otro@user',
  'password': 'm$$m222112b$a$mba1ba$%b11$m5m%1$a5a$1bb%55%$$125rd$135fg15m%',
  'role': 'admin'
}

const mockUserJson = {
  'id': '159263',
  'email': 'otro@user',
  'role': 'admin'
}

const mockUser =   {
  'email': 'otro@user',
  'password': 'm$$m222112b$a$mba1ba$%b11$m5m%1$a5a$1bb%55%$$125rd$135fg15m%',
  'role': 'admin'
}

describe('getUsers', () => {
  it('debería obtener usuarios correctamente', async () => {
    // Configurar el comportamiento del mock
    
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

describe('getUsersJSON', () => {
  it('debe retornar un array con formato JSON sin password', async()=>{
    User.find.mockReset();
    User.find.mockResolvedValueOnce([mockUserWithId]);
    await expect(getUsersJSON()).resolves.toEqual([mockUserJson])
  });
  it('Debe mandar un error al buscar todas las personas', async()=>{
    User.find.mockReset();
    User.find.mockRejectedValueOnce(new Error('Error al buscar todas las personas'));
    await expect(getUsersJSON()).rejects.toThrow('Error al buscar todas las personas')
  });

})

describe('getUserByID', () => {
  it('Debe mandar un documento de la colección de usuarios', async () => {
    console.log(mockUserWithId);
    User.findById.mockResolvedValueOnce(mockUserWithId)
    await expect(getUserByID('159263')).resolves.toEqual(mockUserJson)
    expect(User.findById).toHaveBeenCalled();
  });

  it('Debería mandar null', async () => {
    User.findById.mockResolvedValueOnce(null)
    await expect(getUserByID('159263')).resolves.toEqual(null);
    expect(User.findById).toHaveBeenCalled();
  });
 
  it('Debería mandar un error', async () => {
    User.findById.mockRejectedValueOnce(null)
    await expect(getUserByID('159263')).rejects.toThrow('Error al buscar persona por ID: 159263');
    expect(User.findById).toHaveBeenCalled();
  });
});

describe('getUserByEmail', ()=>{
  it('Debe retornar un documento de la colección de usuarios', async()=>{
    User.find.mockReset();
    User.find.mockResolvedValueOnce([mockUserWithId])
    await expect(getUserByEmail()).resolves.toEqual(mockUserJson)
  });

  it('Debería mandar null', async () => {
    User.find.mockResolvedValueOnce([])
    await expect(getUserByEmail('otro@user')).resolves.toEqual(null);
    expect(User.find).toHaveBeenCalled();
  });

  it('Debería mandar un error', async () => {
    User.find.mockRejectedValueOnce()
    await expect(getUserByEmail('otro@user')).rejects.toThrow(`Error al buscar persona por email: otro@user`);
    expect(User.find).toHaveBeenCalled();
  });
})

describe.skip('saveUser', () => {
  it('Debe mandar el documento guardado', async () => {
    User.save.mockResolvedValueOnce(mockUserWithId)
    await expect(saveUser()).resolves.toEqual(mockUserJson)
    expect(User.save).toHaveBeenCalled();
  });

  it('Debería mandar un error', async () => {
    User.save.mockRejectedValueOnce(new Error('No se puedo guardar el usuario nuevo'))
    await expect(saveUser()).rejects.toThrow('No se puedo guardar el usuario nuevo');
    expect(User.save).toHaveBeenCalled();
  });
});

describe('putUser', () => {
  it('Debe mandar un documento actualizado de la colección de usuarios (id)', async () => {
    User.findById.mockReset()
    User.findOneAndUpdate.mockReset()

    User.findById.mockResolvedValue(mockUserWithId)
    User.findOneAndUpdate.mockImplementationOnce(() => Promise.resolve());;

    await expect(putUser('321654',mockUser)).resolves.toEqual(mockUserJson)
    expect(User.findById).toHaveBeenCalled();
    expect(User.findOneAndUpdate).toHaveBeenCalled();
  });

  it('Debe mandar un documento actualizado de la colección de usuarios (email)', async () => {
    User.find.mockReset()
    User.findOneAndUpdate.mockReset()

    User.find.mockResolvedValue([mockUserWithId])
    User.findOneAndUpdate.mockImplementationOnce(() => Promise.resolve());;

    await expect(putUser('otro@user',mockUser)).resolves.toEqual(mockUserJson)
    expect(User.find).toHaveBeenCalled();
    expect(User.findOneAndUpdate).toHaveBeenCalled();
  });

  it('Debe mandar undefined', async () => {
    User.findById.mockReset()
    User.findById.mockResolvedValueOnce(null)

    await expect(putUser('321654',mockUser)).resolves.toEqual(undefined)
    expect(User.findById).toHaveBeenCalled();
  });

  it('Debería mandar un error', async () => {
    User.findById.mockReset()
    User.findOneAndUpdate.mockReset()

    User.findById.mockResolvedValue(mockUserWithId)
    User.findOneAndUpdate.mockImplementationOnce(() => Promise.reject());
    
    await expect(putUser('123456',mockUser)).rejects.toThrow('Error al intentar actualizar la información del usuario: 123456');
    expect(User.findById).toHaveBeenCalled();
    expect(User.findOneAndUpdate).toHaveBeenCalled();
  });
});

describe('deleteUser', () => {
  it('Debe mandar un documento de la colección de usuarios (id)', async () => {
    User.findById.mockReset()
    User.findOneAndDelete.mockReset()
    
    User.findById.mockResolvedValueOnce(mockUserWithId)
    User.findOneAndDelete.mockImplementationOnce(() => Promise.resolve());;
    User.findById.mockResolvedValueOnce(null)
    
    await expect(deleteUser('321654')).resolves.toEqual(mockUserJson)
    expect(User.findById).toHaveBeenCalledTimes(2);
    expect(User.findOneAndDelete).toHaveBeenCalledTimes(1);
  });
  
  it('Debe mandar un documento de la colección de usuarios(email)', async () => {
    User.find.mockReset()
    User.findById.mockReset()
    User.findOneAndDelete.mockReset()
    
    User.find.mockResolvedValueOnce([mockUserWithId])
    User.findOneAndDelete.mockImplementationOnce(() => Promise.resolve());
    User.findById.mockResolvedValueOnce(null)
    
    await expect(deleteUser('otro@user')).resolves.toEqual(mockUserJson)
    expect(User.find).toHaveBeenCalledTimes(1);
    expect(User.findById).toHaveBeenCalledTimes(1);
    expect(User.findOneAndDelete).toHaveBeenCalledTimes(1);
  });

  it('Debe mandar undefined', async () => {
    User.findById.mockReset()
    User.findById.mockResolvedValueOnce(null)
    
    await expect(deleteUser('321654')).resolves.toEqual(undefined)
    expect(User.findById).toHaveBeenCalledTimes(1);
  });

  it('Debería mandar un error al borrar el usuario (1)', async () => {
    User.findById.mockReset()
    User.findOneAndDelete.mockReset()

    User.findById.mockResolvedValueOnce(mockUserWithId)
    User.findOneAndDelete.mockImplementationOnce(() => Promise.resolve());;
    User.findById.mockResolvedValueOnce(mockUserWithId)

    await expect(deleteUser('123456')).resolves.toEqual('Error al borrar a la usuaria');
    expect(User.findById).toHaveBeenCalledTimes(2);
    expect(User.findOneAndDelete).toHaveBeenCalled();
  });

  it('Debería mandar un error al borrar el usuario (2)', async () => {
    User.findById.mockReset()
    User.findOneAndDelete.mockReset()
    
    User.findById.mockResolvedValueOnce(mockUserWithId)
    User.findOneAndDelete.mockImplementationOnce(() => Promise.reject());;

    await expect(deleteUser('123456')).rejects.toThrow('No se pudo borrar el usuario con ID: 123456');
    expect(User.findById).toHaveBeenCalledTimes(1);
    expect(User.findOneAndDelete).toHaveBeenCalledTimes(1);
  });
});