const http = require('http');
const url = require('url');
const Admin = require('./controller/Admin.js');
const PORT = 8080;
const Login = require('./controller/Login.js');
const path1 = require('node:path');


let server = http.createServer(function (req, res) {
    let parseUrl = url.parse(req.url, true);
    let path = parseUrl.pathname;
    let a = path1.basename(path, '');
    console.log(a);
    let trimPath = path.replace(/^\/+|\/+$/g, '');
    let chosenHandler = (typeof (router[trimPath]) !== 'undefined') ? router[trimPath] : handlers.notFound;
    chosenHandler(req, res);
});


server.listen(PORT, function () {
    console.log('server running at localhost: '+ PORT)
});

let handlers = {};

handlers.admin = function (req, res) {
    let admin = new Admin();
    admin.showHomePage(req,res);
};


handlers.notFound = function (req, res) {

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
    if(req.method === 'GET'){
        let admin = new Admin();
        admin.showPageLogin(req,res);
    }else{
        let login = new Login();
        login.login(req,res);
    }

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
    let admin = new Admin();
    if(req.method === 'GET'){
        admin.showProduct(req,res);
    }else{
        admin.editBook18(req,res);
    }
}

let router = {
    'admin/products': handlers.products,
    'admin/home': handlers.admin,
    'admin/products/delete': handlers.delete,
    'admin/add': handlers.add,
    'login': handlers.login,
    'signUp': handlers.signUp,
    'admin/action' : handlers.action
}



