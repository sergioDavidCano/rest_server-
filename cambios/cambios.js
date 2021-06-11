//elimina una base de datos
let id = req.params.id;
usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
    if (err) {
        return res.status(400).json({
            ok: false,
            err
        });
    };
    if (usuarioBorrado === null) {
        return res.status(400).json({
            ok: false,
            error: {
                message: 'Usuario no encontrado'
            }
        });
    }
    res.json({
        ok: true,
        usuario: usuarioBorrado
    })
})