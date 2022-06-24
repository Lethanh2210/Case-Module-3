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

    createTokenSession = function (fileName,data) {
        let time = Date.now();
        fileName = './token/' + time +'.txt';
        fs.writeFile(fileName, JSON.stringify(data), err => {
            if (err){
                console.log(err);
            }
        });
    }


    deleteTokenSession = function (fileName) {
        fileName = './token/' + fileName +'.txt';
        fs.unlink(fileName, err => {
            if (err) throw err;
            console.log('File deleted!');
        });
    }

    readUserCookie(req, res) {
        //lấy sessionId từ cookie
        let sessionId = cookie.parse(req.headers.cookie || '');
        if (sessionId) {
            let sessionString = "";
            let expires = 0;
            //đọc file sessionId tương ứng phía server
            fs.readFile('./token/' + sessionId, 'utf8', (err, data) => {
                if (err) {
                    console.error(err)
                    return
                }
                expires = JSON.parse(data).expires;
                let now = Date.now();
                if (expires < now) {
                    this.deleteTokenSession(sessionId);
                    //Thực hành đăng nhập và lưu lại
                    res.writeHead(301, {'Location': '/login'})
                    res.end();
                } else {
                    // Đã đăng nhập và chưa hết hạn
                    // chuyển sang trang dashboard
                    let parseUrl = url.parse(req.url, true);
                    let path = parseUrl.pathname;
                    let trimPath = path.replace(/^\/+|\/+$/g, '');
                    //Nếu đường dẫn là /logout thì thực hiện xoá session và chuyển về trang login
                    if (trimPath === "logout") {
                        this.deleteTokenSession(sessionId);
                        res.writeHead(301, {'Location': '/login'});
                        res.end();
                    } else {
                        fs.readFile('./view/admin/home.html', 'utf8', function (err, datahtml) {
                            if (err) {
                                console.log(err);
                            }
                            console.log('da dang nhap')
                            res.writeHead(200, {'Content-Type': 'text/html'});
                            res.write(datahtml);
                            return res.end();
                        });
                    }
                }
            })
        }else {
            res.writeHead(301, {'Location': '/login'});
            res.end();
        }
    }
}
module.exports = AuthController;