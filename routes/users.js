const bcrypt = require('bcrypt');
const mongoose = require ('mongoose');
const User = require('../models/users');

const {
  requireAuth,
  requireAdmin,
  isAdmin,
} = require('../middleware/auth');

const {
  getUsers,
} = require('../controller/users');

const initAdminUser = (app, next) => {
  const { adminEmail, adminPassword } = app.get('config');
  if (!adminEmail || !adminPassword) {
    return next();
  }

  const adminUser = {
    email: adminEmail,
    password: bcrypt.hashSync(adminPassword, 10),
    roles: { admin: true },
  };

  getUsers()
  .then(users => {
    // console.log('Todas las personas:', users);
    const existsUser = users.some(user =>user.email === adminUser.email);
    if (!existsUser){
      const newAdminUserDB = new User(adminUser);
      return newAdminUserDB.save();
    } else {
    console.error(`El usuario ${adminUser.email} ya existe en la base de datos`)
    }
  })
  .catch(error => {
    // Maneja el error si ocurrió durante la búsqueda
    console.error('Error general:', error);
  })
  // .finally(() => {
    // Cierra la conexión a la base de datos después de la consulta
    // mongoose.connection.close();
  // });

  // TODO: Create admin user
  // First, check if adminUser already exists in the database
  // If it doesn't exist, it needs to be saved

  next();
};

// mongoose.connect('mongodb://127.0.0.1:27017/burger-queen-api');

/*
 * Español:
 *
 * Diagrama de flujo de una aplicación y petición en node - express :
 *
 * request  -> middleware1 -> middleware2 -> route
 *                                             |
 * response <- middleware4 <- middleware3   <---
 *
 * la gracia es que la petición va pasando por cada una de las funciones
 * intermedias o "middlewares" hasta llegar a la función de la ruta, luego esa
 * función genera la respuesta y esta pasa nuevamente por otras funciones
 * intermedias hasta responder finalmente a la usuaria.
 *
 * Un ejemplo de middleware podría ser una función que verifique que una usuaria
 * está realmente registrado en la aplicación y que tiene permisos para usar la
 * ruta. O también un middleware de traducción, que cambie la respuesta
 * dependiendo del idioma de la usuaria.
 *
 * Es por lo anterior que siempre veremos los argumentos request, response y
 * next en nuestros middlewares y rutas. Cada una de estas funciones tendrá
 * la oportunidad de acceder a la consulta (request) y hacerse cargo de enviar
 * una respuesta (rompiendo la cadena), o delegar la consulta a la siguiente
 * función en la cadena (invocando next). De esta forma, la petición (request)
 * va pasando a través de las funciones, así como también la respuesta
 * (response).
 */

/*
 * Português Brasileiro:
 *
 * Fluxo de uma aplicação e requisição em node - express:
 *
 * request  -> middleware1 -> middleware2 -> rota
 *                                             |
 * response <- middleware4 <- middleware3   <---
 *
 * A essência é que a requisição passa por cada uma das funções intermediárias
 * ou "middlewares" até chegar à função da rota; em seguida, essa função gera a
 * resposta, que passa novamente por outras funções intermediárias até finalmente
 * responder à usuária.
 *
 * Um exemplo de middleware poderia ser uma função que verifica se uma usuária
 * está realmente registrada na aplicação e tem permissões para usar a rota. Ou
 * também um middleware de tradução, que altera a resposta dependendo do idioma
 * da usuária.
 *
 * É por isso que sempre veremos os argumentos request, response e next em nossos
 * middlewares e rotas. Cada uma dessas funções terá a oportunidade de acessar a
 * requisição (request) e cuidar de enviar uma resposta (quebrando a cadeia) ou
 * delegar a requisição para a próxima função na cadeia (invocando next). Dessa
 * forma, a requisição (request) passa através das funções, assim como a resposta
 * (response).
 */

module.exports = (app, next) => {
  app.use('/user/:test', function(req, res, next) {
    console.log('Test-Request URL:', req.originalUrl);
    next();
  }, function (req, res, next) {
    console.log('Test-Request Type:', req.method);
    next();
  });

  app.get('/users', requireAdmin, async(req, resp) => {
    if (await requireAdmin(req)){
    let allUsers = await getUsers();
    const respUsersGet = [];
    
    allUsers.map((user)=>{
      respUsersGet.push({
        id:user._id,
        email:user.email,
        role:user.roles
      })
    })
    resp.json(respUsersGet)
  } else {
    resp.status(403).json({"error": "No tiene permiso de Administradora"});
  }
    /* next() */
  });

  app.get('/users/:uid', requireAuth, async(req, resp) => {
    console.log('r/u get/:uid params: ',req.params.uid);
    const uidUser = req.params.uid;
    let allUsers = await getUsers();
    const user = allUsers.filter((user) => (user._id.toString() === uidUser));
    console.log('r/u get/:uid user:',user);
    if ( user.length === 0 ){
      resp.status(404).json({"error": "La usuaria solicitada no existe"});
    } else if ( isAdmin(req) === true || req.uid === uidUser){
      resp.json({
        id:user[0]._id,
        email:user[0].email,
        role:user[0].roles
      });
    } else {
      resp.status(403).json({"error": "No tiene permiso de Administradora"});
    }

    /* next() */
  });

  app.post('/users', requireAdmin, async(req, resp, next) => {
    // TODO: Implement the route to add new users
    const newUser = req.body; // Acceder a los datos en el cuerpo de la solicitud
    console.log('r/u post req.body: ',newUser);
    if (!newUser.email || !newUser.password || !newUser.roles) {
      resp.status(400).json({"error": "Falta información"});
    }
  
    const newUserCrypted = {
      email: newUser.email,
      password: bcrypt.hashSync(newUser.password, 10),
      roles: newUser.roles,
    };
  
    getUsers()
    .then(users => {
      // console.log('Todas las personas:', users);
      const existsUser = users.some(user =>user.email === newUserCrypted.email);
      if (!existsUser){
        const newUserDB = new User(newUserCrypted);
        console.log('r/u post newUserDB: ',newUserDB);
        try{
          newUserDB.save();
          console.log('r/u post req.body: ',newUserDB);
          resp.json({'id':newUserDB._id, 'email':newUserDB.email,'role':newUserDB.roles});
        } catch (err){
          console.log('r/u post error:',err);
          resp.status(500).json({'message':'Error interno del servidor, no se pudo guardar el usuario'})
        }
      } else {
        resp.status(403).json({"error": "Email ya registrado"});
        //return next({status:403, message:'Email ya registrado'});
      }
    })
    .catch(error => {
      // Maneja el error si ocurrió durante la búsqueda
      console.error('Error general:', error);
      next({status:500, message:'Error interno del servidor, no se pudo guardar el usuario'})
    })

    
  });

  app.put('/users/:uid', requireAuth, (req, resp, next) => {
  });

  app.delete('/users/:uid', requireAuth, (req, resp, next) => {
  });

  initAdminUser(app, next);
};
