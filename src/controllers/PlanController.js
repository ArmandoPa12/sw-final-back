const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


//----------
exports.getAll = async(req, res) => {
    const userId = parseInt(req.body.userId);

    console.log(userId);

    try {
        const user = await prisma.usuario.findUnique({
            where: { id: userId },
            include: {
                plan: {
                    include: {
                        caracteristicas: {
                            include: {
                                caracteristica: true
                            }
                        }
                    }
                }
            }
        });

        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        if (!user.plan) {
            return res.status(400).json({ error: 'El usuario no tiene un plan asignado' });
        }
        res.json(user.plan);

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


exports.updatePlan = async(req, res) => {
    const userId = parseInt(req.body.userId);
    const planId = parseInt(req.body.planId);

    try {
        const user = await prisma.usuario.findUnique({
            where: { id: userId }
        });

        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        const plan = await prisma.plan.findUnique({
            where: { id: planId }
        });

        if (!plan) {
            return res.status(404).json({ error: 'Plan no encontrado' });
        }

        await prisma.usuario.update({
            where: { id: userId },
            data: {
                planId: planId
            }
        });

        await prisma.suscripcion.updateMany({
            where: {
                usuarioId: userId,
                activo: true
            },
            data: {
                activo: false,
                fechaFin: new Date()
            }
        });

        await prisma.suscripcion.create({
            data: {
                usuarioId: userId,
                planId: planId,
                activo: true,
                fechaInicio: new Date()
            }
        });

        res.json({ message: `Plan actualizado a ${plan.nombre} correctamente.` });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};