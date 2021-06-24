const express = require('express');
const fileUpload = require('express-fileupload');
const usuario = require('../modelos/usuario');
const Usuario = require('../modelos/usuario');
const Productos = require('../modelos/producto');
let { vereficacionImg } = require('../middlewares/autenticacion');
const fs = require('fs');
const path = require('path');
const app = express();
app.use(fileUpload());
app.put('/upload/:tipo/:id', vereficacionImg, (req, res) => {
    let tipo = req.params.tipo;
    let id = req.params.id;
    if (!req.files) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No fue seleccionado un archivo'
            }
        });
    }
    let tiposValidos = ['productos', 'usuarios'];
    if (tiposValidos.indexOf(tipo) < 0) {
        res.status(400).json({
            ok: false,
            err: {
                message: `El tipo no es valido`
            }
        })
    };
    let archivo = req.files.archivo;
    let nombreCortado = archivo.name.split('.');
    let extension = nombreCortado[nombreCortado.length - 1];
    //Extenciones validas
    let extencionesValidas = ['pnj', 'jpg', 'gif', 'jpeg'];
    if (extencionesValidas.indexOf(extension) < 0) {
        res.status(400).json({
            ok: false,
            err: {
                message: `Las extension  no es permitida`
            }
        })
    };
    //Cambiar nombre del archivo
    let nombreArchivo = `${id}-${ new Date().getMilliseconds()}.${extension}`;
    archivo.mv(`uploads/${ tipo }/${nombreArchivo}`, (err) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (tipo == 'usuarios') {
            imagenUsuario(id, res, nombreArchivo);
        }
        if (tipo == 'productos') {
            imagenProducto(id, res, nombreArchivo)
        }
    });
});
//carga una imagen al usuario
function imagenUsuario(id, res, nombreArchivo) {
    Usuario.findById(id, (err, usuarioDB) => {
        if (err) {
            borraArchivo(nombreArchivo, 'productos')
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!usuarioDB) {
            borraArchivo(nombreArchivo, 'usuarios')
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario de base de datos no existe'
                }
            });
        }
        //Borra una imagen y actualiza la otra
        borraArchivo(usuarioDB.img, 'usuarios')
        usuarioDB.img = nombreArchivo;
        usuarioDB.save((err, usuarioDB) => {
            res.json({
                ok: true,
                usuario: usuarioDB,
                img: nombreArchivo
            })
        })
    });
};

function imagenProducto(id, res, nombreArchivo) {
    Productos.findById(id, (err, productoDB) => {
        if (err) {
            borraArchivo(nombreArchivo, 'productos')
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productoDB) {
            borraArchivo(nombreArchivo, 'productos')
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto de base de datos no existe'
                }
            });
        }
        //Borra una imagen y actualiza la otra
        borraArchivo(productoDB.img, 'productos')
        productoDB.img = nombreArchivo;
        productoDB.save((err, productos) => {
            res.json({
                ok: true,
                productos: productoDB,
                img: nombreArchivo
            })
        })
    });
};

function borraArchivo(nombreImagen, tipo) {
    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`);
    if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen);
    }
}

module.exports = app;