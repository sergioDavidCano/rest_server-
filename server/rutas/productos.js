const express = require('express');
const _ = require('underscore')
let { vereficacionToken, vereficacionADMIN_ROLE } = require('../middlewares/autenticacion');
let Producto = require('../modelos/producto');
let app = express();
//obtener todos los productos 
app.get('/productos', vereficacionToken, (req, res) => {
    let desde = req.query.desde || 0;
    desde = Number(desde);
    let hasta = req.query.hasta || 5;
    hasta = Number(hasta);
    Producto.find({ disponible: true })
        .skip(desde)
        .limit(hasta)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, producto) => {
            //Vereficacion si el token es invalido
            if (err) {
                return res.status(400).json({
                        ok: false,
                        err: {
                            message: 'Token no valido'
                        }
                    })
                    //Cuenta cuantos usuarios ahi en la base de datos 
            } else {
                Producto.count({ estado: true }, (err, conteo) => {
                    res.json({
                        ok: true,
                        producto,
                        cuantos: conteo
                    })
                })
            }
        })
});
//Obtener productos por id 
app.get('/productos/:id', vereficacionToken, (req, res) => {
    //trae todos los productos
    //populate usuario y categorias
    //paginado
    let id = req.params.id;
    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }
            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Id no encontrado'
                    }
                })
            }
            res.json({
                ok: true,
                productoDB
            })
        });
});
//Buscar producto 
app.get('/productos/buscar/:termino', vereficacionToken, (req, res) => {
    let termino = req.params.termino;
    let regex = RegExp(termino, 'i');
    Producto.find({ nombre: regex })
        .populate('categoria', 'descripcion')
        .exec((err, productoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }
            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Id no encontrado'
                    }
                })
            }
            res.json({
                ok: true,
                productoDB
            })
        });
});
//Crea un nuevo producto
app.post('/productos', vereficacionToken, (req, res) => {
    let body = req.body;
    let producto = new Producto({
        usuario: req.usuario._id,
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        categoria: body.categoria
    })
    producto.save((err, productoDB) => {
        //verefica si el token es valido
        if (err) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'token no valido'
                }
            })
        } else {
            res.json({
                ok: true,
                producto: productoDB
            })
        }
    })
});
//Actualiza un  nuevo producto
app.put('/productos/:id', vereficacionToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;
    //Busca y actualiza los datos del usuario en la base de datos
    Producto.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, productoDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'token no valido'
                }
            });
        }
        res.json({
            ok: true,
            producto: productoDB
        })

    })
});
//Borra un producto
app.delete('/productos/:id', vereficacionToken, (req, res) => {
    let id = req.params.id;
    let cambiaEstado = {
        disponible: false
    };
    Producto.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, productoNoDisponible) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        };
        if (productoNoDisponible === null) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'Producto no encontrado'
                }
            });
        }
        res.json({
            ok: true,
            producto: productoNoDisponible
        })
    })
});
module.exports = app;