const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


//----------
exports.getAllMateria = async(req, res) => {
    const userId = parseInt(req.params.id);
    try {

        //exite el usuario
        const user = await prisma.usuario.findUnique({
            where: { id: userId },
            include: {
                materia: {
                    include: {
                        notas: true
                    }
                }
            }
        });

        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }


        res.json(user.materia);
    } catch (error) {
        res.status(400).json({ error: error.message });

    }
};

//------------------
exports.updateMateria = async(req, res) => {
    const idMateria = parseInt(req.params.id);
    const { nombre, color, usuarioId } = req.body;
    try {
        const user = await prisma.usuario.findUnique({
            where: { id: usuarioId },
            include: { materia: true }
        });

        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        const materia = user.materia.find(m => m.id === idMateria);
        if (!materia) {
            return res.status(404).json({ error: 'Materia no encontrada o no pertenece al usuario' });
        }

        const nombreRepetido = user.materia.find(m =>
            m.nombre.trim().toLowerCase() === nombre.trim().toLowerCase() && m.id !== idMateria
        );

        if (nombreRepetido) {
            return res.status(409).json({ error: 'Ya existe otra materia con ese nombre' });
        }

        const materiaActualizada = await prisma.materia.update({
            where: { id: idMateria },
            data: {
                nombre,
                color
            }
        });

        return res.status(200).json(materiaActualizada);

    } catch (error) {
        res.status(400).json({ error: error.message });

    }
};

//---------------
exports.createMateria = async(req, res) => {
    const { nombre, color, usuarioId } = req.body;

    console.log(nombre, color, usuarioId);

    try {
        const user = await prisma.usuario.findUnique({
            where: { id: usuarioId },
            include: {
                materia: true
            }
        });

        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        const materiaExistente = user.materia.find(m => m.nombre === nombre);

        if (materiaExistente) {
            return res.status(409).json({ error: 'Ya existe una materia con ese nombre' });
        }

        const nuevaMateria = await prisma.materia.create({
            data: {
                nombre,
                color,
                usuario: { connect: { id: usuarioId } }
            }
        });

        return res.status(201).json(nuevaMateria);

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getMateria = async(req, res) => {
    const materiaId = parseInt(req.params.id);

    console.log(materiaId);

    try {
        const materia = await prisma.materia.findUnique({
            where: { id: materiaId },
            include: {
                notas: true
            }
        });

        if (!materia) {
            return res.status(404).json({ error: 'Materia no encontrada' });
        }



        return res.status(201).json(materia);

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

//-------------------------
exports.deleteMateria = async(req, res) => {
    const idMateria = parseInt(req.params.id);
    const { usuarioId } = req.body;

    try {
        const user = await prisma.usuario.findUnique({
            where: { id: usuarioId },
            include: {
                materia: {
                    include: { notas: true }
                }
            }
        });

        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        const materia = user.materia.find(m => m.id === idMateria);

        if (!materia) {
            return res.status(404).json({ error: 'Materia no encontrada o no pertenece al usuario' });
        }

        if (materia.notas.length > 0) {
            return res.status(409).json({ error: 'No se puede eliminar la materia porque contiene notas asociadas' });
        }

        await prisma.materia.delete({
            where: { id: idMateria }
        });

        return res.status(200).json({ message: 'Materia eliminada correctamente' });

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};