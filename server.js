require('dotenv').config();
const ChatController = require('./classes/chatController');
const Products =  require('./classes/productos');

const express = require('express')
const { engine } = require('express-handlebars');
const routerApp = require("./router/router");
const otherRouter = require("./router/othersRouter");
const { Server: HttpServer } = require('http');
const { Server: IOServer } = require('socket.io');

const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');

const parseArgs  = require('minimist');

const logger = require('./utils/logger');

const initServer = () => {

    const app = express();
    const httpserver = new HttpServer(app);
    const io = new IOServer(httpserver);
    
    const args = parseArgs(process.argv.slice(2),  { alias: { p: "PORT", m: "MODE"}, default: { PORT: 8080, MODE: "FORK" } });
    const PORT = args.PORT || 8080;

    app.use((req, res, next)=> {
        logger.info(`Route: ${req.originalUrl} Method: ${req.method}`);
        next();
    });
    
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cookieParser());
    
    app.use(session({
        secret: 'keyboard cat',
        cookie: {
            httpOnly: false,
            secure: false,
            maxAge: 600000
        },
        rolling: true,
        resave: true,
        saveUninitialized: false
    }));
    
    app.use(passport.initialize());
    app.use(passport.session());
    
    app.use(express.static(__dirname + '/public'));
    app.use('/', otherRouter);
    app.use('/', routerApp);
    
    app.engine('hbs', engine({
        extname: '.hbs',
        defaultLayout: 'index.hbs',
        layoutsDir: __dirname + '/views/layouts',
    }));
    
    app.set('views', './views');
    app.set('view engine', 'hbs');
    
    const productos = new Products();
    productos.populateProductos();
    const mensajes = new ChatController('./db/chat.txt');
    
    io.on('connection', async socket => {
    
        io.sockets.emit('products', await productos.getProductos());
        io.sockets.emit('messages', await mensajes.getAll());
    
        socket.on('addProduct', async producto => {
            productos.addProducto(producto);
            io.sockets.emit('products', await productos.getProductos());
        })
    
        socket.on('addMessage', async mensaje => {
            io.sockets.emit('messages', await mensajes.addMessage(mensaje));
        })
    
    });
    
    return {
        listen: () => new Promise((res, rej)=>{
            const server = httpserver.listen(PORT, () => {
                res(server)
            })
            server.on('error', err => rej(err))
        })
    }

}

module.exports = initServer;