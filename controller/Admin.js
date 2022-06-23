let fs = require("fs");
const AdminModel = require("../model/AdminModel.js");
let qs = require("qs");
const url = require('url');


class Admin{
    constructor() {
        this.admin = new AdminModel();
        this.editButton = (obj) => {
            return `<button type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModal" data-whatever="@mdo" onclick='getEditButton(${obj})'>Edit</button>`;
        }
    }

    showHomePage(req,res){
        readFile(req,res,'./view/admin/home.html').then(data => {
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(data);
            res.end();
        })
    }
    showProduct(req,res){
        const urlPath = url.parse(req.url, true);
        let queryString = urlPath.query;
        let typeDB = queryString.type;
        this.admin.getbooks(typeDB).then((dataDB) => {
            readFile(req,res,'./view/admin/product.html').then(data => {
                let html = '';
                dataDB.forEach((item,index)=>{
                    html += '<tr>'
                    html += `<td>${index+1}</td>`
                    html += `<td>${item.name}</td>`
                    html += `<td>${item.author}</td>`
                    html += `<td>${item.status}</td>`
                    html += `<td>${item.price}</td>`
                    html += `<td>${item.SL}</td>`
                    html += `<td>
                            <a href="/admin/products/delete?type=${typeDB}&id=${item.id}" class="btn btn-danger">Delete</a>
                            ${this.editButton(JSON.stringify(item))}
                            </td>`
                    html += '</tr>'
                })
                data = data.replace('{list-product}', html);
                data = data.replace('{type}', typeDB);
                res.writeHead(200, {'Content-Type': 'text/html'});
                res.write(data);
                res.end();
            })
        })
    }

    deleteBook18(id,req,res,type) {
        this.admin.deleteBook(id).then(data => {
            res.writeHead(301, {Location: `http://localhost:8080/admin/products?type=${type}`})
            res.end();
        })
    }

    editBook18(req,res,type){
        let data = ''
        req.on('data', chunk => {
            data += chunk
        })
        req.on('end', () => {
            const product = qs.parse(data);
            this.admin.editBook(product.editId,product.editName, product.editAuthor, product.editStatus, product.editPrice, product.editSL).then(data1 =>{
                res.writeHead(301, {Location: `http://localhost:8080/admin/products?type=${product.editType}`});
                res.end();
            })
        })
    }

    addBook18(req,res,page){
        let data = ''
        req.on('data', chunk => {
            data += chunk
        })
        req.on('end', () => {
            const product = qs.parse(data);
            this.admin.addBookQuery(product.addName, product.addAuthor, product.addStatus,product.addType,product.addPrice, product.addSL).then(data =>{
                res.writeHead(301, {Location: `http://localhost:8080/admin/products?type=${product.addType}`});
                res.end();
            })
        })
    }

    showPageAdd(req,res){
        readFile(req,res,'./view/admin/add.html').then(data => {
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(data);
            res.end();
        })
    }

    showPageLogin(req,res){
        readFile(req,res,'./view/login-SignUp/login.html').then(data => {
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(data);
            res.end();
        })
    }

    showPageSignUp(req,res){
        readFile(req,res,'./view/login-SignUp/signUp.html').then(data => {
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(data);
            res.end();
        })
    }

}

module.exports = Admin;

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


