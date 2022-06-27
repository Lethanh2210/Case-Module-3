let fs = require("fs");
const url = require("url");
const UserModel = require("../model/UserModel");
const cookie = require("cookie");

class Cart {
    constructor() {
        this.carts = [];
        this.user = new UserModel();
    }

    addToCart(req,res) {
        const urlPath = url.parse(req.url, true);
        let queryString = urlPath.query;
        let bookId = queryString.id;
        let type = queryString.type;
        this.user.getBookById(bookId).then(dataDB =>{
            let product = {
                id: dataDB[0].id,
                name: dataDB[0].name,
                price: dataDB[0].price,
                SL: 1,
            }
            this.carts.push(product);
            this.cartSession(req, res, this.carts);
            res.writeHead(301, {Location: `http://localhost:8080/user/products?type=${type}`});
            res.end();
        })
    }

    cartSession(req,res,data){
        let nameFile = 'cart';
        //tao session login
        let sessionLogin = {
            'session_name_file': nameFile,
            'data_user_login': data
        };
        fs.writeFile('./token/cart/' + nameFile + '.txt', JSON.stringify(sessionLogin), err => {
            if (err) {
                throw new Error(err.message);
            }
        })
        let cookieLogin = {
            cart: data,
        }
        res.setHeader('Set-Cookie', cookie.serialize('cart', JSON.stringify(cookieLogin)));
    }

    showCartPage(req, res) {
        const urlPath = url.parse(req.url, true);
        let queryString = urlPath.query;
        readFile(req, res, './view/user/cart.html').then(data => {
            let html = '';
            let total = 0;
            this.carts.forEach((item, index) => {
                html += '<tr>'
                html += `<td>${index + 1}</td>`
                html += `<td>${item.name}</td>`
                html += `<td>${item.price}</td>`
                html += `<td>${1}</td>`
                html += '</tr>'
                total += item.price;
            })
            html += `<tr><td colspan="3">Total: ${total}</td><td><a href="/cart/confirm" class="btn btn-success">Confirm</a><a href="/cart?type=cancle" class="btn btn-danger">cancle</a></td></tr>`
            data = data.replace('{list-product}', html);
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(data);
            res.end();
        })

    }

    deleteTokenSession = function (fileName) {
        fileName = './token/cart/' + fileName +'.txt';
        fs.unlink(fileName, err => {
            if (err) throw err;
            console.log('File deleted!');
        });
    }

    sendCart(req,res,id){
        let totalPrice = 0;
        this.carts.forEach((item, index) => {
            totalPrice += item.price;
        })
        this.user.pushOrder(Date.now().toString(), totalPrice, id).then(data => {
            this.carts.forEach((item, index) => {
                this.user.pushOrderDetails(item.id);
            })
            res.writeHead(301, {'Location': 'http://localhost:8080/user/home'})
            res.end();
        });
    }



}

module.exports = Cart;

function readFile(req, res, pathFile) {
    return new Promise((resolve, reject) => {
        fs.readFile(pathFile, 'utf-8', (err, data) => {
            if (err) {
                reject(err.message);
            } else {
                resolve(data);
            }
        })
    })
}