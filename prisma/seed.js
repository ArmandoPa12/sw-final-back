const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
    // Crea profesor
    const profesor = await prisma.usuario.create({
        data: {
            usuario: 'profe1',
            email: 'profesor@g.com',
            password: await bcrypt.hash('123', 10),
            esProfesor: true,
            materia: {
                create: [{
                    nombre: 'Matemática Avanzada',
                    color: 'azul',
                    notas: {
                        create: [{
                                titulo: 'Tema 1',
                                contenido: 'Introducción al cálculo diferencial',
                                contenido_copia: 'Introducción al cálculo diferencial',
                                mermaid: 'graph TD; A-->B; B-->C;',
                                imagenes: {
                                    create: [
                                        { ruta: 'uploads/imagenes/tema1-img1.png' },
                                        { ruta: 'uploads/imagenes/tema1-img2.png' },
                                    ],
                                },
                                audios: {
                                    create: [
                                        { ruta: 'uploads/audios/tema1-audio1.mp3' },
                                    ],
                                },
                            },
                            {
                                titulo: 'Tema 2',
                                contenido: 'Derivadas e integrales',
                                contenido_copia: 'Derivadas e integrales',

                                mermaid: 'graph LR; X-->Y; Y-->Z;',
                                imagenes: {
                                    create: [
                                        { ruta: 'uploads/imagenes/tema2-img1.png' },
                                    ],
                                },
                            },
                        ],
                    },
                }, ],
            },
            calendario: {
                create: [
                    { fecha: new Date('2025-06-01T10:00:00.000Z'), evento: 'Clase de repaso' },
                    { fecha: new Date('2025-06-15T10:00:00.000Z'), evento: 'Examen final' },
                ],
            },
        },
    });

    // Alumno 1
    const alumno1 = await prisma.usuario.create({
        data: {
            usuario: 'alumno1',
            email: 'alumno1@g.com',
            password: await bcrypt.hash('123', 10),
            esProfesor: false,
            materia: {
                create: [{
                    nombre: 'Historia',
                    color: 'azul',
                    notas: {
                        create: [{
                                titulo: 'Primera nota',
                                contenido: 'Edad Media y Renacimiento',
                                contenido_copia: 'Edad',

                                mermaid: 'graph TD; Edad_Media-->Renacimiento;',
                            },
                            {
                                titulo: 'Segunda nota',
                                contenido: 'Revolución Francesa',
                                contenido_copia: 'Revolución Francesa'

                            },
                        ],
                    },
                }, ],
            },
        },
    });

    // Alumno 2
    const alumno2 = await prisma.usuario.create({
        data: {
            usuario: 'alumno2',
            email: 'alumno2@g.com',
            password: await bcrypt.hash('123', 10),
            esProfesor: false,
            materia: {
                create: [{
                    nombre: 'Física',
                    color: 'azul',
                    notas: {
                        create: [{
                            titulo: 'Movimiento rectilíneo',
                            contenido: 'Velocidad, tiempo y aceleración',
                            contenido_copia: 'Velocidad, tiempo y aceleración',

                            audios: {
                                create: [{ ruta: 'uploads/audios/movimiento1.mp3' }],
                            },
                        }, ],
                    },
                }, ],
            },
        },
    });

    console.log('Usuarios creados con sus materias, notas, imágenes y audios.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async() => {
        await prisma.$disconnect();
    });