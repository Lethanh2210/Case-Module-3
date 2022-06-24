const http = require('http');
const url = require('url');
const Admin = require('./controller/Admin.js');
const PORT = 8080;
const Login = require('./controller/Login.js');
const AuthController = require('./controller/AuthController.js');
const cookie = require('cookie');

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
    console.log('server running at localhost: '+ PORT)
});

let handlers = {};

handlers.admin = function (req, res) {
    authContr.checkAccountLogin(req, res);
    let admin = new Admin();
    admin.showHomePage(req,res);
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
    admin.deleteBook18(index,req,res,typeDB);
};

handlers.add = function (req,res){
    let admin = new Admin();

    if(req.method === 'GET'){
        admin.showPageAdd(req,res);
    }else{
        const urlPath = url.parse(req.url, true);
        let queryString = urlPath.query;
        let typeDB = queryString.type;
        admin.addBook18(req,res,typeDB);
    }
}



handlers.login = function (req, res) {
   log.login(req,res);
}

handlers.signUp = function (req, res) {
    if(req.method === 'GET'){
        let admin = new Admin();
        admin.showPageSignUp(req,res);
    }else{
        let login = new Login();
        login.signUp(req,res);
    }
}


handlers.products = function (req, res) {
    authContr.checkAccountLogin(req, res);
    let admin = new Admin();
    if(req.method === 'GET'){
        admin.showProduct(req,res);
    }else{
        admin.editBook18(req,res);
    }
}

handlers.logout = function (req, res) {
    let cookieClient = (cookie.parse(req.headers.cookie || '')).user;
        let fileName = JSON.parse(cookieClient);
        authContr.deleteTokenSession(fileName.session_name_file);
        res.writeHead(301, {'Location': '/login'});
        res.end();
}

let router = {
    'admin/products': handlers.products,
    'admin/home': handlers.admin,
    'admin/products/delete': handlers.delete,
    'admin/add': handlers.add,
    'login': handlers.login,
    'signUp': handlers.signUp,
    'logout': handlers.logout
}



