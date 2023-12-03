const jwt = require('jsonwebtoken');
const { getUsers } = require('../controller/users');

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
      return next({ status: 403, message: 'Token inválido' });
    }
    console.log('m/a-decodedToken:',decodedToken);
    console.log('m/a-decodedToken.iud:',decodedToken.uid);

    req.uid = decodedToken.uid;
    console.log ('m/a-req.uid: ', req.uid);
    console.log('m/a-isAuthenticated',!!req.uid);
    next()
    // TODO: Verify user identity using `decodeToken.uid`
  });
};

module.exports.isAuthenticated = (req) => (
  // TODO: Decide based on the request information whether the user is authenticated
  !!req.uid
);

module.exports.isAdmin = async (req) => {
  try {
    const allUsers = await getUsers();
    const user = allUsers.find(u => u._id.toString() === req.uid);
    console.log('m/a-isAdmin: ', user.roles.admin);
    return user && user.roles && user.roles.admin;
  } catch (error) {
    console.error('Error al verificar si el usuario es administrador:', error);
    throw error;
  }
  // TODO: Decide based on the request information whether the user is an admin
}

module.exports.requireAuth = (req, resp, next) => (
  (!module.exports.isAuthenticated(req))
    ? next({ status: 401, message: 'isAuthenticated(1) false' })
    : next()
);

module.exports.requireAdmin = (req, resp, next) => (
  // eslint-disable-next-line no-nested-ternary
  (!module.exports.isAuthenticated(req))
    ? next({ status: 401, message: 'isAuthenticated(2) false' })
    : (!module.exports.isAdmin(req))
      ? next({ status: 401, message: 'isAdmin false' })
      : next()
);
