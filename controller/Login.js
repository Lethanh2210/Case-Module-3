let LoginModel = require('../model/LoginModel.js');
const qs = require("qs");
const fs = require("fs");
const cookie = require("cookie");
const AuthController = require("../controller/AuthController.js");
const Admin = require('./Admin.js');

class Login {
    constructor() {
        this.log = new LoginModel();
        this.authContr = new AuthController();
        this.admin = new Admin();
    }

    login(req, res) {
        if (req.method === 'GET') {
            let cookies = cookie.parse(req.headers.cookie || '');
            let nameCookie = '';
            if (cookies.user) {
                nameCookie = (JSON.parse(cookies.user)).sessionId
                fs.exists('./token/' + nameCookie + '.txt', (exists) => {
                    if (exists) {
                        res.writeHead(301, {location: '/admin/home'});
                        res.end();
                    } else {
                        this.admin.showPageLogin(req,res);
                    }
                });
            } else {
                this.admin.showPageLogin(req,res);
            }
            // this.showPage(req, res, './views/login.html');

        }else{
            let data = '';
            req.on('data', chunk => {
                data += chunk
            });
            req.on('end', () => {
                let Data = qs.parse(data);
                this.log.loginQuery(Data.loginEmail, Data.loginPass).then(result => {
                    if (result.length > 0) {
                        //tao luu file session
                        let nameFile = Date.now();
                        //tao session login
                        let sessionLogin = {
                            'session_name_file': nameFile,
                            'data_user_login': result[0]
                        };
                        //ghi file
                        fs.writeFile('./token/' + nameFile + '.txt', JSON.stringify(sessionLogin), err => {
                            if (err) {
                                throw new Error(err.message);
                            }
                        })
                        //tao cookie
                        let cookieLogin = {
                            session_name_file: nameFile
                        }
                        res.setHeader('Set-Cookie', cookie.serialize('user', JSON.stringify(cookieLogin)));
                        console.log(result[0].roleId);
                        if (result[0].roleId === 1) {
                            res.writeHead(301, {location: '/admin/home'})
                            res.end();
                        } else if (result[0].roleId === 2) {
                            res.writeHead(301, {location: '/login'});
                            res.end();
                        }
                    } else {
                        fs.readFile('./view/login.html', 'utf-8', (err, data) => {
                            if (err) {
                                throw new Error(err.message);
                            } else {
                                res.writeHead(200, {'Content-Type': 'text/html'});
                                data = data.replace('hidden', '')
                                res.write(data);
                                res.end();
                            }
                        })
                    }
                })

            })
        }
        // if (req.method === 'GET') {
        //    this.admin.showPageLogin(req,res);
        // } else {
        //     let data = ''
        //     req.on('data', chunk => {
        //         data += chunk
        //     })
        //     req.on('end', () => {
        //         const product = qs.parse(data);
        //         this.log.loginQuery(product.loginEmail, product.loginPass).then(dataDB => {
        //             console.log(dataDB);
        //             if (dataDB.length > 0 && dataDB[0].roleId === 1) {
        //                 let nameFile = Date.now() + 60*60*24;
        //                 let userCookie = {
        //                     sessionId: nameFile,
        //                 }
        //                 let userSession = {
        //                     user: {
        //                         name: product.name,
        //                         email: product.email
        //                     }
        //                 }
        //                 this.authContr.createTokenSession(JSON.stringify(userSession));
        //                 res.setHeader('Set-Cookie', cookie.serialize('user', JSON.stringify(userCookie)))
        //                 res.writeHead(301, {Location: 'http://localhost:8080/admin/home'});
        //                 res.end();
        //             } else {
        //                 readFile(req, res, './view/login-SignUp/login.html').then(data1 => {
        //                     data1 = data1.replace('<p style="color: red; display: none">Wrong email or password</p>', '<p style="color: red; display: block">Wrong email or password</p>')
        //                     res.writeHead(200, {'Content-Type': 'text/html'});
        //                     res.write(data1);
        //                     res.end();
        //                 })
        //             }
        //         })
        //     })
        // }

    }

    signUp(req, res) {
        let data = ''
        req.on('data', chunk => {
            data += chunk
        })
        req.on('end', () => {
            const user = qs.parse(data);
            this.log.signUpQuery(user.SignName, user.SignEmail, user.SignPass).then(dataDB => {
                res.writeHead(301, {Location: 'http://localhost:8080/login'});
                res.end();
            }).catch(err => {
                readFile(req, res, './view/login-SignUp/signUp.html').then(data1 => {
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
            if (err) {
                reject(err.message);
            } else {
                resolve(data);
            }
        })
    })
}

module.exports = Login;

