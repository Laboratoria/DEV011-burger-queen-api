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
      console.log('m/a-verifiTokenError:', err);
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

const allUsersDB = getUsers().then(usr => usr);
module.exports.isAdmin = async (req,allUsers = allUsersDB) => {
  try {
    console.log('m/a-isAdmin allUsers: ', allUsers);
    const user = allUsers.filter((user) => (user._id.toString() === req.uid))
    console.log('m/a-isAdmin: ', user && user.roles && user.roles.admin === true);
    return (user && user.roles && user.roles.admin === true);
  } catch (error) {
    console.error('Error al verificar si el usuario es administrador:', error);
    throw error;
  }
  // TODO: Decide based on the request information whether the user is an admin
}

module.exports.requireAuth = (req, resp, next) => (
  (!module.exports.isAuthenticated(req))
    ? resp.status(401).json({"error": "isAuthenticated(1):false"})
    // ? next({ status: 401, message: 'isAuthenticated(1) false' })
    : next()
);

module.exports.requireAdmin = async (req, resp, next) => (
  // eslint-disable-next-line no-nested-ternary
  (!module.exports.isAuthenticated(req))
    ? resp.status(401).json({"error": "isAuthenticated(2):false"})
    // ? next({ status: 401, message: 'isAuthenticated(2) false' })
    : (module.exports.isAdmin(req) != true)
      ? resp.status(403).json({"error": "isAdmin:false"})
      : next()
      // ? next({ status: 401, message: 'isAdmin false' })
);
