const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const config = require('../config');
const mongoose = require ('mongoose');
// const User = require('../models/users');
const { getUsers } = require('../controller/users');

mongoose.connect('mongodb://127.0.0.1:27017/test');
mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
mongoose.connection.once('open', () => {
    console.log('Database connected');
});

const { secret } = config;

module.exports = async(app, nextMain) => {

  app.post('/login', (req, resp, next) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return next(400);
    }
    
    // TODO: Authenticate the user
    // It is necessary to confirm if the email and password
    // match a user in the database
    // If they match, send an access token created with JWT
    
    getUsers()
    .then((users) => {
      // Extraemos el posible usuario existente
      const existingUser = users.filter(user => user.email === email);
      console.log(existingUser[0].password);
      // Validamos que la contraseña hasheada sea la misma que la guardada
      if (existingUser.length != 0){
        // compara el psw proporcionado con el existente en la colección
        bcrypt.compare(password, existingUser[0].password, function(err, result) {
          console.log('result:',result);
          console.log('err: ',err);

          // en caso de error
          if (err) {
            // enviamos al respuesta 500 de error con el servidor
            return next(500);
            
          } else if (result) {
            // si las credenciales coinciden, se genera y envia el token JWT
            const token = jwt.sign({ userId: existingUser[0]._id }, secret, { expiresIn: '1h' });
            // enviamos la rspuesta del token
            resp.json({ token });
          }})
        } else {
          // si la contraseña es incorrecta enviamos una respuesta de status 401
          return next(401);
        }
  })
    .catch((error) => {
      // si no se logra resolver la promesa de traer la coleción de los usuarios
      // enviamos al respuesta 500 de error con el servidor
      console.log('error 500 con el servidor')
      return next(500);
    })
    // .finally(() => {
      // mongoose.connection.close();
    // });
    next();
  });

  return nextMain();
};
