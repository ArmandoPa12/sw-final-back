const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


//----------
exports.getAllDates = async(req, res) => {
    const userId = parseInt(req.body.userId);

    console.log(userId);

    try {
        const user = await prisma.usuario.findUnique({
            where: { id: userId },
            include: {
                calendario: true
            }
        });

        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        res.json(user.calendario);

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};



exports.updateCalendario = async (req, res) => {
    const { id } = req.params;
    const { fecha, evento } = req.body;

    try {
        const calendarioExistente = await prisma.calendario.findUnique({
            where: { id: Number(id) }
        });

        if (!calendarioExistente) {
            return res.status(404).json({ error: 'Calendario no encontrado' });
        }

        const calendarioActualizado = await prisma.calendario.update({
            where: { id: Number(id) },
            data: {
                fecha: fecha ? new Date(fecha) : undefined,
                evento: evento ?? undefined
            }
        });

        return res.status(200).json({
            mensaje: 'Calendario actualizado correctamente',
            calendario: calendarioActualizado
        });

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.createCalendario = async (req, res) => {
    const { fecha, evento, usuarioId } = req.body;

    try {
        const usuario = await prisma.usuario.findUnique({
            where: { id: Number(usuarioId) }
        });

        if (!usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        const nuevoCalendario = await prisma.calendario.create({
            data: {
                fecha: new Date(fecha),
                evento,
                usuario: { connect: { id: Number(usuarioId) } }
            }
        });

        return res.status(201).json({
            mensaje: 'Evento de calendario creado correctamente',
            calendario: nuevoCalendario
        });

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


exports.deleteCalendario = async (req, res) => {
    const { id } = req.params;

    try {
        const calendario = await prisma.calendario.findUnique({
            where: { id: Number(id) }
        });

        if (!calendario) {
            return res.status(404).json({ error: 'Evento no encontrado' });
        }

        await prisma.calendario.delete({
            where: { id: Number(id) }
        });

        return res.status(200).json({ mensaje: 'Evento eliminado correctamente' });

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
