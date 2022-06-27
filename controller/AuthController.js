let fs = require('fs');
let qs = require('qs');
const cookie = require('cookie');
const url = require("url");


class AuthController {
    constructor() {

    }

    checkAccountLogin(req, res) {
        //b1: lấy cookie từ request của client
        let cookieClient = cookie.parse(req.headers.cookie || '');
        if (cookieClient.user) {

        } else {
            res.writeHead(301, {Location: '/login'});
            res.end();
        }
    }



    deleteTokenSession = function (fileName) {
        fileName = './token/login/' + fileName +'.txt';
        fs.unlink(fileName, err => {
            if (err) throw err;
            console.log('File deleted!');
        });
    }




}
module.exports = AuthController;