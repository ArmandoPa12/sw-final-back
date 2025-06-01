const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


//----------
exports.getAllNotas = async(req, res) => {
    const materiaId = parseInt(req.params.id);
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

        return res.status(201).json(materia.notas);

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


exports.getNota = async(req, res) => {
    // const notaId = parseInt(req.params.id);
    const { notaId } = req.body;


    try {

        const nota = await prisma.nota.findUnique({
            where: { id: notaId },
            include: {
                audios: true,
                imagenes: true
            }
        })
        if (!nota) {
            return res.status(404).json({ error: 'Nota no encontrada' });
        }
        res.json(nota);
    } catch (error) {
        res.status(400).json({ error: error.message });

    }
};

exports.createNota = async(req, res) => {
    const { titulo, contenido, materiaId } = req.body;

    console.log(titulo, contenido, materiaId);  
    

    try {
        const materia = await prisma.materia.findUnique({
            where: { id: materiaId }
        });

        if (!materia) {
            return res.status(404).json({ error: 'materia no encontrada' });
        }

        const nuevaNota = await prisma.nota.create({
            data: {
                titulo,
                contenido,
                contenido_copia: contenido,
                materia: { connect: { id: materiaId } }
            }
        });

        return res.status(201).json(nuevaNota);

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


// //------------------
exports.updateNota = async (req, res) => {
    const { titulo, contenido, mermaid } = req.body;
    const notaIda = parseInt(req.params.id);


    try {
        const notaExistente = await prisma.nota.findUnique({
            where: { id: notaIda }
        });

        if (!notaExistente) {
            return res.status(404).json({ error: 'Nota no encontrada' });
        }

        const notaActualizada = await prisma.nota.update({
            where: { id: notaIda },
            data: {
                titulo: titulo && titulo.trim() !== '' ? titulo : notaExistente.titulo,
                contenido: contenido ?? notaExistente.contenido,
                contenido_copia: contenido ?? notaExistente.contenido_copia,
                mermaid: mermaid ?? notaExistente.mermaid
            }
        });

        return res.status(200).json(notaActualizada);

    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};


// //---------------


// //-------------------------
exports.deleteNota = async(req, res) => {
    const notaId = parseInt(req.params.id);

    try {
        const notaExistente = await prisma.nota.findUnique({
            where: { id: notaId }
        });

        if (!notaExistente) {
            return res.status(404).json({ error: 'Nota no encontrada' });
        }

        await prisma.nota.delete({
            where: { id: notaId }
        });

        return res.status(200).json({ message: 'Nota eliminada correctamente' });

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};