const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const config = require('../config');
// const mongoose = require ('mongoose');
// const User = require('../models/users');
const { getUsers } = require('../controller/users');

/* mongoose.connect('mongodb://127.0.0.1:27017/burger-queen-api');
mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
mongoose.connection.once('open', () => {
    console.log('r/a-Database connected');
}); */

const { secret } = config;

module.exports = (app, nextMain) => {
  console.log('r/a-async app');
  app.post('/login', (req, resp, next) => {
    console.log('r/a-async app.post');

    const { email, password } = req.body;
    
    if (!email || !password) {
      console.log('400');
      return next(400);
    }
    
    // TODO: Authenticate the user
    // It is necessary to confirm if the email and password
    // match a user in the database
    // If they match, send an access token created with JWT
    
    getUsers()
    .then((users) => {
      // Extraemos el posible usuario existente
      console.log('r/a-users auth:',users);
      const existingUser = users.filter(user => user.email === email);
      // Validamos que la contraseña hasheada sea la misma que la guardada
      if (existingUser.length != 0){
        // compara el psw proporcionado con el existente en la colección
        bcrypt.compare(password, existingUser[0].password, function(err, result) {
          
          // en caso de error
          if (result) {
            console.log('r/a-compare_result:',result);
            // si las credenciales coinciden, se genera y envia el token JWT
            const token = jwt.sign({ uid: existingUser[0]._id, email:existingUser[0].email, admin:existingUser[0].role === 'admin'}, secret, { expiresIn: '4h' });
            console.log('r/a-token:',jwt.verify(token, secret));
            // enviamos la rspuesta del token
            resp.json({ token });
          }else if (err) {
            console.log('r/a-err: ',err);
            // enviamos al respuesta 500 de error con el servidor
            return next({ status: 500, message: 'No hay conincidencia en las credenciales'});
          }})
        } else {
          // si la contraseña es incorrecta enviamos una respuesta de status 401
          return next(401);
        }
    })
    .catch((error) => {
      // si no se logra resolver la promesa de traer la coleción de los usuarios
      // enviamos al respuesta 500 de error con el servidor
      console.log('r/a:error 500 con el servidor')
      return next({ status: 500, message: 'No se pudo cargar a collección de los usuarios'});
    })

    // next();
  });

  return nextMain();
};
