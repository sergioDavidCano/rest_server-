//verificacion de un token
const jwt = require('jsonwebtoken');
let vereficacionToken = (req, res, next) => {
    //Vereficacion de un token para acceder a cualquier funcion del backend
    let token = req.get('token');
    jwt.verify(token, process.env.SEMILLADETOKEN, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err
            });
        }
        req.usuario = decoded.usuario
        next();
    });
};
let vereficacionADMIN_ROLE = (req, res, next) => {
    let usuario = req.usuario;
    if (usuario.role === 'ADMIN_ROLE') {
        next();
    } else
        return res.status(401).json({
            ok: false,
            err: {
                message: 'El usuario no es administrador '
            }
        });

}
module.exports = {
    vereficacionToken,
    vereficacionADMIN_ROLE
}