const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const fs = require('fs');
const path = require('path');


exports.createImage = async (req, res) => {
    const { notaid } = req.body;
    const file = req.file;

    if (!file) {
        return res.status(400).json({ error: 'No se envió ninguna imagen.' });
    }

    const uploadsDir = path.join(__dirname, '..', 'uploads');
    const extension = path.extname(file.originalname);
    const fileName =  `${Date.now()}${extension}`;
    const filePath = path.join(uploadsDir, fileName);

    if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir);
    }

    fs.writeFile(filePath, file.buffer, async (err) => {
        if (err) {
            console.error('Error al guardar la imagen:', err);
            return res.status(500).json({ error: 'Error al guardar la imagen.' });
        }

        const imageUrl = `/uploads/${fileName}`;

        try {
            const notaExistente = await prisma.nota.findUnique({
                where: { id: Number(notaid) }
            });

            if (!notaExistente) {
                return res.status(404).json({ error: 'Nota no encontrada' });
            }

            const nuevaImagen = await prisma.imagen.create({
                data: {
                    ruta: imageUrl,
                    nota: { connect: { id: Number(notaid) } }
                }
            });

            res.status(201).json({
                mensaje: 'Imagen guardada correctamente.',
                imagen: nuevaImagen
            });

        } catch (error) {        
            res.status(400).json({ error: error.message });            
        }
    });
};



exports.deleteImagen = async (req, res) => {
    const { notaId, imagenId } = req.params;


    try {
        const nota = await prisma.nota.findUnique({
            where: { id: Number(notaId) },
            include: {
                imagenes: true
            }   
        });

        if (!nota) {
            return res.status(404).json({ error: 'Nota no encontrada' });
        }

        const imagen = nota.imagenes.find(img => img.id === Number(imagenId));

        if (!imagen) {
            return res.status(404).json({ error: 'Imagen no encontrada para esta nota' });
        }

        const filePath = path.join(__dirname, '..', 'uploads', path.basename(imagen.ruta));
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        await prisma.imagen.delete({
            where: { id: imagen.id }
        });

        res.status(200).json({ message: 'Imagen eliminada correctamente' });

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};



exports.createAudio = async (req, res) => {
    const { notaid } = req.body;
    const file = req.file;

    if (!file) {
        return res.status(400).json({ error: 'No se envió ningún audio.' });
    }

    const uploadsDir = path.join(__dirname, '..', 'audio');
    const extension = path.extname(file.originalname);
    const fileName = `${Date.now()}${extension}`;
    const filePath = path.join(uploadsDir, fileName);

    if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir);
    }

    fs.writeFile(filePath, file.buffer, async (err) => {
        if (err) {
            console.error('Error al guardar el audio:', err);
            return res.status(500).json({ error: 'Error al guardar el audio.' });
        }

        const audioUrl = `/audio/${fileName}`;

        try {
            const notaExistente = await prisma.nota.findUnique({
                where: { id: Number(notaid) }
            });

            if (!notaExistente) {
                return res.status(404).json({ error: 'Nota no encontrada' });
            }

            const nuevoAudio = await prisma.audio.create({
                data: {
                    ruta: audioUrl,
                    nota: { connect: { id: Number(notaid) } }
                }
            });

            res.status(201).json({
                mensaje: 'Audio guardado correctamente.',
                audio: nuevoAudio
            });

        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    });
};


exports.deleteAudio = async (req, res) => {
    const { notaId, audioId } = req.params;

    try {
        const nota = await prisma.nota.findUnique({
            where: { id: Number(notaId) },
            include: {
                audios: true
            }
        });

        if (!nota) {
            return res.status(404).json({ error: 'Nota no encontrada' });
        }

        const audio = nota.audios.find(a => a.id === Number(audioId));

        if (!audio) {
            return res.status(404).json({ error: 'Audio no encontrado para esta nota' });
        }

        const filePath = path.join(__dirname, '..', 'audio', path.basename(audio.ruta));
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        await prisma.audio.delete({
            where: { id: audio.id }
        });

        res.status(200).json({ message: 'Audio eliminado correctamente' });

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
