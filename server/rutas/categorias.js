const express = require('express');
const _ = require('underscore')
let { vereficacionToken, vereficacionADMIN_ROLE } = require('../middlewares/autenticacion');
let app = express();
let Categoria = require('../modelos/categorias');
let categoria = require('../modelos/categorias');
//Muestra todas las categorias
app.get('/categoria', vereficacionToken, (req, res) => {
    Categoria.find({})
        .sort('descripcion')
        .populate('usuario', 'nombre gmail')
        .exec((err, categorias) => {
            //Vereficacion si el token es invalido
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Token no valido'
                    }
                })
            }
            if (!categorias) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'El id no existe'
                    }
                })
            }
            res.json({
                ok: true,
                categorias
            })
        })
});
//Muestra una categorias por ID
app.get('/categoria/:id', vereficacionToken, (req, res) => {
    let id = req.params.id;
    Categoria.findById(id, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Id no encontrado'
                }
            })
        }
        res.json({
            ok: true,
            categoriaDB
        })
    });
});
//crea una nueva categoria
app.post('/categoria', vereficacionToken, (req, res) => {
    let body = req.body;
    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    })
    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            categoria: categoriaDB
        })
    })
});

//Actualiza una nueva categoria
app.put('/categoria/:id', vereficacionToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;
    //let body = _.pick(req.body, ['descripcion', 'usuario']);
    categoria.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, categoriaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El id es incorrecto'
                }
            });
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No existe en la base de datos'
                }
            });
        }
        res.json({
            ok: true,
            categoria: categoriaDB
        })

    })
});

app.delete('/categoria/:id', vereficacionToken, (req, res) => {
    //solo un administrador puede borrar una categoria
    let id = req.params.id;
    /* let cambiaEstado = {
             estado: false
         }*/
    //Cambia el estado de activo a desactivado en la base e datos
    categoria.findByIdAndRemove(id, (err, categoriaBorrada) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        };
        if (categoriaBorrada === null) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'Categoria no encontrada '
                }
            });
        }
        res.json({
            ok: true,
            categoria: categoriaBorrada
        })
    })
});
module.exports = app;