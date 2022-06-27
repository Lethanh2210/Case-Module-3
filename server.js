const http = require('http');
const url = require('url');
const Admin = require('./controller/Admin.js');
const PORT = 8080;
const Login = require('./controller/Login.js');
const AuthController = require('./controller/AuthController.js');
const cookie = require('cookie');
const { Server } = require("socket.io");
const Cart = require('./controller/Cart.js');

let cart = new Cart();
let authContr = new AuthController();
let log = new Login();


let server = http.createServer(function (req, res) {
    let parseUrl = url.parse(req.url, true);
    let path = parseUrl.pathname;
    let trimPath = path.replace(/^\/+|\/+$/g, '');
    let chosenHandler = (typeof (router[trimPath]) !== 'undefined') ? router[trimPath] : handlers.notFound;
    chosenHandler(req, res);

});


server.listen(PORT, function () {
    console.log('server running at localhost: ' + PORT)
});

let handlers = {};

handlers.admin = function (req, res) {
    authContr.checkAccountLogin(req, res);
    let admin = new Admin();
    admin.showHomePage(req, res);
};


handlers.notFound = function (req, res) {
    res.end('404 NOT FOUND');
};

handlers.delete = function (req, res) {
    const urlPath = url.parse(req.url, true);
    let queryString = urlPath.query;
    let index = queryString.id;
    let typeDB = queryString.type;
    let admin = new Admin();
    admin.deleteBook18(index, req, res, typeDB);
};

handlers.add = function (req, res) {
    let admin = new Admin();

    if (req.method === 'GET') {
        admin.showPageAdd(req, res);
    } else {
        const urlPath = url.parse(req.url, true);
        let queryString = urlPath.query;
        let typeDB = queryString.type;
        admin.addBook18(req, res, typeDB);
    }
}


handlers.login = function (req, res) {
    this.carts = [];
    log.login(req, res);
}

handlers.signUp = function (req, res) {
    if (req.method === 'GET') {
        let admin = new Admin();
        admin.showPageSignUp(req, res);
    } else {
        let login = new Login();
        login.signUp(req, res);
    }
}


handlers.products = function (req, res) {
    authContr.checkAccountLogin(req, res);
    let admin = new Admin();
    if (req.method === 'GET') {
        admin.showProduct(req, res);
    } else {
        admin.editBook18(req, res);
    }
}

handlers.logOut = function (req, res) {
    let cookieClient = (cookie.parse(req.headers.cookie || '')).user;
    let fileName = JSON.parse(cookieClient);
    authContr.deleteTokenSession(fileName.session_name_file);
    cart.carts = [];
    res.setHeader('set-cookie', 'user=; max-age=0; cart=; max-age=0');
    // res.setHeader('set-cookie', 'cart=; max-age=0');
    res.writeHead(301, {'Location': '/login'});
    res.end();
}

handlers.Uproducts = function (req,res){
    authContr.checkAccountLogin(req, res);
    let admin = new Admin();
    if (req.method === 'GET') {
        admin.showProductUser(req, res);
    }
}
handlers.user = function (req,res){
    authContr.checkAccountLogin(req, res);
    let admin = new Admin();
    admin.showHomeUser(req, res);
}

handlers.cart = function (req,res){
    const urlPath = url.parse(req.url, true);
    let queryString = urlPath.query;
    if(queryString.type === 'cancle'){
        cart.carts = [];
        res.setHeader('set-cookie', 'cart=; max-age=0');
        res.writeHead(301, {'Location': '/cart'});
        res.end();
    }else{
        cart.showCartPage(req, res);
    }
}
handlers.supOrder = function (req, res) {
    cart.addToCart(req, res);
}

handlers.confirmCart = function (req, res) {
    cart.sendCart(req, res,log.currentUser);
    cart.carts = [];
}

handlers.orders = function (req, res) {
    let admin = new Admin();
    admin.showPageOrder(req, res);
}

handlers.ordersDelete = function (req, res) {
    let admin = new Admin();
    const urlPath = url.parse(req.url, true);
    let queryString = urlPath.query;
    let id = queryString.id;
    admin.deleteAllOrder(id,req,res);
}

let router = {
    'admin/products': handlers.products,
    'admin/home': handlers.admin,
    'admin/products/delete': handlers.delete,
    'admin/add': handlers.add,
    'login': handlers.login,
    'signUp': handlers.signUp,
    'logOut': handlers.logOut,
    'user/products': handlers.Uproducts,
    'user/home': handlers.user,
    'cart' : handlers.cart,
    'cart/confirm': handlers.confirmCart,
    'user/products/supOrder': handlers.supOrder,
    'admin/orders': handlers.orders,
    'admin/orders/delete': handlers.ordersDelete,
}







