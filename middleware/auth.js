const jwt = require('jsonwebtoken');
// const { getUsers } = require('../controller/users');



module.exports = (secret) => (req, resp, next) => {
  const { authorization } = req.headers;
  console.log ('m/a-authorization: ', authorization);
  if (!authorization) {
    return next();
  }

  const [type, token] = authorization.split(' ');
  console.log('m/a-type:',type);
  // Instead of the server doing work to validate ``basic`` auth credentials,
  // a server using ``bearer`` tokens needs to do work to validate the token
  if (type.toLowerCase() !== 'bearer') {
    return next();
  }

  jwt.verify(token, secret, (err, decodedToken) => {
    if (err) {
      console.log('m/a-verifiTokenError:', err);
      return next({ status: 403, message: 'Token inválido' });
    }
    console.log('m/a-decodedToken:',decodedToken);
    console.log('m/a-decodedToken.iud:',decodedToken.uid);

    req.uid = decodedToken.uid;
    req.admin = decodedToken.admin === undefined ? false:decodedToken.admin;

    console.log ('m/a-req.uid: ', req.uid);
    console.log ('m/a-req.admin: ', req.admin);
    next()
    // TODO: Verify user identity using `decodeToken.uid`
  });
};

module.exports.isAuthenticated = (req) => (
  // TODO: Decide based on the request information whether the user is authenticated
  !!req.uid
);

module.exports.isAdmin = (req) => (
  !!req.admin
  /* try {
    const allUsers = await getUsers();
    console.log('m/a-isAdmin allUsers: ', allUsers);
    const user = allUsers.filter((user) => (user._id.toString() === req.uid))
    console.log('m/a-isAdmin: ', user && user.role && user.role.admin === true);
    return (user && user.role && user.role.admin === true);
  } catch (error) {
    console.error('Error al verificar si el usuario es administrador:', error);
    throw error;
  } */
  // TODO: Decide based on the request information whether the user is an admin
)

module.exports.requireAuth = (req, resp, next) => {
  const isNotAuth = !module.exports.isAuthenticated(req);
  console.log('m/a-requireAdmin: ',!isNotAuth);
  if (isNotAuth){
    resp.status(401).json({"error": "isAuthenticated(1):false"})
  } else {
    next()
  }
};

module.exports.requireAdmin = (req, resp, next) => {
  // eslint-disable-next-line no-nested-ternary
  const isNotAuth = !module.exports.isAuthenticated(req);
  const isNotAdmin = !module.exports.isAdmin(req);

  console.log('m/a-requireAdmin: ', !isNotAuth, !isNotAdmin);

  if (isNotAuth) {
    return resp.status(401).json({ "error": "isAuthenticated(2):false" });
  }

  if (isNotAdmin) {
    return resp.status(403).json({ "error": "La usuaria no es administradora" });
  }

  // Solo llamar a next() si ninguna de las condiciones anteriores se cumple
  next();
};