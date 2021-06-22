const mongoose = require('mongoose');
let Schema = mongoose.Schema;
//Roles que puedo poner que se pueden sen validos
let rolesValidos = {
        values: ['ADMIN_ROLE', 'USER_ROLE'],
        message: '{VALUE} no es un rol valido'
    }
    //Objecto el cual crea el usuario y lo imprime en la base en la base de datos
let usuarioSchema = new Schema({
    nombre: {
        type: String,
        unique: true,
        required: [true, 'El nombre es requerido']
    },
    gmail: {
        type: String,
        unique: true,
        required: [true, 'El gmail es necesario']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'El email es necesario']
    },
    password: {
        type: String,
        required: [true, 'La contraseña es necesaria']
    },
    img: {
        type: String,
        required: false
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: rolesValidos
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
});
//Ocultacion de la contraseña para extremar la seguridad del usuario y la base de datos
usuarioSchema.methods.toJSON = function() {
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;
    return userObject;
}
module.exports = mongoose.model('Usuario', usuarioSchema);