require('dotenv').config();
const express = require('express');

const userRoutes = require('../src/routers/userRouter');
const socketIO = require('socket.io');
const path = require('path');
const http = require('http');


var indexRouter = require('./routers/index.js');
var usersRouter = require('./routers/users.js');
var materiaRouter = require('./routers/materia.js');
var notaRouter = require('./routers/nota.js');
var imagenRouter = require('./routers/file.js');
var calendarRouter = require('./routers/calendario.js');

const cors = require('cors')

const app = express();

app.use(express.json());
app.use(cors())
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/materia', materiaRouter);
app.use('/nota', notaRouter);
app.use('/file', imagenRouter);
app.use('/calendario', calendarRouter);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));


app.use('/api/users', userRoutes);
// app.use('/api/proyecto', proyectoRouter);
// app.use('/api/sala', salaRouter);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/audio', express.static(path.join(__dirname, 'audio')));





const server = http.createServer(app);
const io = socketIO(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

require('./services/websocket')(io);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});