let LoginModel = require('../model/LoginModel.js');
const qs = require("qs");
const fs = require("fs");

class Login{
    constructor() {
        this.log = new LoginModel();
    }

    login(req,res) {
        let data = ''
        req.on('data', chunk => {
            data += chunk
        })
        req.on('end', () => {
            const product = qs.parse(data);
            this.log.loginQuery(product.loginEmail,product.loginPass).then(dataDB =>{
                if(dataDB.length > 0 && dataDB[0].roleId === 1){
                    res.writeHead(301, {Location: 'http://localhost:8080/admin/home'});
                    res.end();
                }else{
                    readFile(req,res,'./view/login-SignUp/login.html').then(data1 => {
                        data1 = data1.replace('<p style="color: red; display: none">Wrong email or password</p>', '<p style="color: red; display: block">Wrong email or password</p>')
                        res.writeHead(200, {'Content-Type': 'text/html'});
                        res.write(data1);
                        res.end();
                    })
                }
            })
        })
    }

    signUp(req, res) {
        let data = ''
        req.on('data', chunk => {
            data += chunk
        })
        req.on('end', () => {
            const user = qs.parse(data);
            this.log.signUpQuery(user.SignName, user.SignEmail, user.SignPass, user.role).then(dataDB =>{
                res.writeHead(301, {Location: 'http://localhost:8080/login'});
                res.end();
            }).catch(err => {
                readFile(req,res,'./view/login-SignUp/signUp.html').then(data1 => {
                    data1 = data1.replace('<span style="color: red; display: none">Email used</span>', '<span style="color: red; display: block">Email used</span>')
                    res.writeHead(200, {'Content-Type': 'text/html'});
                    res.write(data1);
                    res.end();
                })
            })
        })
    }
}
function readFile(req, res, pathFile) {
    return new Promise((resolve, reject) => {
        fs.readFile(pathFile, 'utf-8', (err, data) => {
            if(err){
                reject(err.message);
            }else {
                resolve(data);
            }
        })
    })
}
module.exports = Login;

