const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {

    //caracterisiticas de planes
    const dibujar = await prisma.caracteristica.create({
        data: {
            nombre: 'dibujar',
            descripcion: 'Permite dibujar',
        },
    });
    const crear_materia = await prisma.caracteristica.create({
        data: {
            nombre: 'Crear Materia',
            descripcion: 'Permite registrar una nueva materia con nombre y color para organizar las clases.',
        },
    });
    const crear_clase_nota = await prisma.caracteristica.create({
        data: {
            nombre: 'registrar nota',
            descripcion: 'Permite registrar una nueva nota',
        },
    });
    const grabar_audio = await prisma.caracteristica.create({
        data: {
            nombre: 'grabar audio',
            descripcion: 'Permite grabar audio',
        },
    });
    const escribir_apunte = await prisma.caracteristica.create({
        data: {
            nombre: 'Escribir Apunte en Clase',
            descripcion: 'Permite escribir contenido con herramientas de formato (negrita, títulos, estilos).',
        },
    });
    const resumen_ia = await prisma.caracteristica.create({
        data: {
            nombre: 'resumir el contenido con IA',
            descripcion: 'Usa IA para generar un resumen del texto o audio asociado a la clase.',
        },
    });
    const mapa_ia = await prisma.caracteristica.create({
        data: {
            nombre: 'Generar Mapa Mental',
            descripcion: 'Crea un mapa mental visual a partir de apuntes o ideas clave.',
        },
    });
    const calendario_personal = await prisma.caracteristica.create({
        data: {
            nombre: 'Ver Calendario Personal',
            descripcion: 'Muestra eventos detectados por IA o creados manualmente',
        },
    });
    const exportarPDF = await prisma.caracteristica.create({
        data: {
            nombre: 'exportar_pdf',
            descripcion: 'Permite exportar notas en formato PDF',
        },
    });
    const notificaciones = await prisma.caracteristica.create({
        data: {
            nombre: 'Recibir Notificaciones',
            descripcion: 'Almacena y muestra alertas de eventos detectados o tareas pendientes.',
        },
    });
    const actualizar_suscription = await prisma.caracteristica.create({
        data: {
            nombre: 'Actualizar Suscripción',
            descripcion: 'Permite cambiar de plan mediante sistema de pago. Habilita las funciones del nuevo plan inmediatamente.',
        },
    });

    //tipos de planes
    const planGratuito = await prisma.plan.create({
        data: {
            nombre: 'Gratuito',
            descripcion: 'Plan gratuito con funciones limitadas',
            precioMensual: 0,
            caracteristicas: {
                create: [
                    { caracteristicaId: crear_clase_nota.id },
                    { caracteristicaId: crear_materia.id },
                    { caracteristicaId: escribir_apunte.id },
                    { caracteristicaId: actualizar_suscription.id },
                ],
            },
        },
    });
    const planBasico = await prisma.plan.create({
        data: {
            nombre: 'Basico',
            descripcion: 'Plan basico con funciones limitadas',
            precioMensual: 15,
            caracteristicas: {
                create: [
                    { caracteristicaId: crear_materia.id },
                    { caracteristicaId: crear_clase_nota.id },
                    { caracteristicaId: grabar_audio.id },
                    { caracteristicaId: escribir_apunte.id },
                    { caracteristicaId: dibujar.id },
                    { caracteristicaId: calendario_personal.id },
                    { caracteristicaId: exportarPDF.id },
                    { caracteristicaId: notificaciones.id },
                    { caracteristicaId: actualizar_suscription.id },

                ],
            },
        },
    });

    const planPremium = await prisma.plan.create({
        data: {
            nombre: 'Premium',
            descripcion: 'Acceso completo a todas las funciones',
            precioMensual: 30,
            caracteristicas: {
                create: [
                    { caracteristicaId: crear_materia.id },
                    { caracteristicaId: crear_clase_nota.id },
                    { caracteristicaId: grabar_audio.id },
                    { caracteristicaId: escribir_apunte.id },
                    { caracteristicaId: dibujar.id },
                    { caracteristicaId: resumen_ia.id },
                    { caracteristicaId: mapa_ia.id },
                    { caracteristicaId: calendario_personal.id },
                    { caracteristicaId: exportarPDF.id },
                    { caracteristicaId: notificaciones.id },
                ],
            },
        },
    });


    //usuario final
    const usuarioPremiun = await prisma.usuario.create({
        data: {
            usuario: 'cliente_premium',
            email: 'p@g.com',
            password: await bcrypt.hash('123', 10),
            esProfesor: true,
            planId: planPremium.id,
        },
    });

    const usuarioBasico = await prisma.usuario.create({
        data: {
            usuario: 'cliente_basico',
            email: 'b@g.com',
            password: await bcrypt.hash('123', 10),
            esProfesor: false,
            planId: planBasico.id,
        },
    });

    const usuarioGratuito = await prisma.usuario.create({
        data: {
            usuario: 'cliente_gratuito',
            email: 'g@g.com',
            password: await bcrypt.hash('123', 10),
            esProfesor: false,
            planId: planGratuito.id,
        },
    });


    await prisma.suscripcion.create({
        data: {
            usuarioId: usuarioPremiun.id,
            planId: planPremium.id,
            activo: true,
            fechaInicio: new Date(),
        },
    });
    await prisma.suscripcion.create({
        data: {
            usuarioId: usuarioBasico.id,
            planId: planBasico.id,
            activo: true,
            fechaInicio: new Date(),
        },
    });
    await prisma.suscripcion.create({
        data: {
            usuarioId: usuarioGratuito.id,
            planId: planGratuito.id,
            activo: true,
            fechaInicio: new Date(),
        },
    });

    console.log('semilla exitoa');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async() => {
        await prisma.$disconnect();
    });