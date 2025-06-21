const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// const { use } = require('../routers/userRouter');


//helper
function generateToke(userId) {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '1d',
    });
}

//get all
exports.getAllUsers = async(req, res) => {
    const users = await prisma.usuario.findMany({
        select: { id: true, usuario: true, email: true, createdAt: true, plan: true }
    });
    res.json(users);
};


//create
exports.createUser = async(req, res) => {
    const { usuario, email, password } = req.body;
    try {
        const hash = await bcrypt.hash(password, 10);

        const planGratuito = await prisma.plan.findUnique({
            where: { nombre: 'Gratuito' }
        });

        if (!planGratuito) {
            return res.status(500).json({ error: 'El plan gratuito no existe' });
        }

        const user = await prisma.usuario.create({
            data: {
                usuario,
                email,
                password: hash,
                planId: planGratuito.id
            }
        });
        await prisma.suscripcion.create({
            data: {
                usuarioId: user.id,
                planId: planGratuito.id,
                activo: true,
                fechaInicio: new Date()
            }
        });
        const token = generateToke(user.id);

        res.status(201).json({
            message: 'Usuario creado exitosamente',
            user: {
                id: user.id,
                usuario: user.usuario,
                email: user.email,
            },
            token,
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getUser = async(req, res) => {
    const userId = parseInt(req.params.id);
    try {
        const user = await prisma.usuario.findUnique({
            where: { id: userId },
            include: {
                proyectos: true,
                plan: true
            }
        });
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el usuario' });
    }
}

//login
exports.loginUser = async(req, res) => {
    const { email, password } = req.body;
    try {
        const user = await prisma.usuario.findUnique({ where: { email } });

        if (!user) {
            return res.status(401).json({ error: 'email o contraseña incorrecta' })
        }

        const isMath = await bcrypt.compare(password, user.password);
        if (!isMath) {
            return res.status(401).json({ error: 'email o contraseña incorrecta' })
        }
        const token = generateToke(user.id);

        res.json({
            message: 'Login exitoso',
            user: {
                id: user.id,
                usuario: user.usuario,
                email: user.email,
                profesor: user.esProfesor,
            },
            token,
        });


    } catch (error) {
        res.status(500).json({ error: 'Error al iniciar sesión' });
    }

};