let Database = require('./Database.js');

class AdminModel{
    constructor() {
        this.con = Database.connect();
    }

    getbooks(type){
        return new Promise((resolve, reject)=>{
            let sql = `SELECT * FROM book WHERE type = '${type}'`;
            this.con.query(sql, (err, data)=>{
                if(err){
                    reject(err);
                }else{
                    resolve(data);
                }
            })
        })
    }

    deleteBook(id){
        return new Promise((resolve, reject)=>{
            let sql = `DELETE FROM book WHERE id = ${id}`;
            this.con.query(sql, (err, data)=>{
                if(err){
                    reject(err);
                }else{
                    resolve(data);
                }
            })
        })
    }

    editBook(id,name,author,status,price,sl){
        return new Promise((resolve, reject)=>{
            let sql = `UPDATE book SET name = '${name}', author = '${author}', status = '${status}', price = ${price}, SL = ${sl} WHERE id = ${id}`;
            this.con.query(sql, (err, data)=>{
                if(err){
                    reject(err);
                }else{
                    resolve(data);
                }
            })
        })
    }

    addBookQuery(name,author,status,type,price,sl){
        return new Promise((resolve, reject)=>{
            let sql = `INSERT INTO book(name,author,status,type,price,SL) VALUES ('${name}', '${author}', '${status}','${type}', ${price}, ${sl})`;
            this.con.query(sql, (err, data)=>{
                if(err){
                    reject(err);
                }else{
                    resolve(data);
                }
            })
        })
    }

    getActionBook(){
        return new Promise((resolve, reject)=>{
            let sql = "SELECT * FROM book WHERE type = 'Action'";
            this.con.query(sql, (err, data)=>{
                if(err){
                    reject(err);
                }else{
                    resolve(data);
                }
            })
        })
    }

    getOrderList(){
        return new Promise((resolve, reject)=>{
            let sql = "SELECT * FROM orders ";
            this.con.query(sql, (err, data)=>{
                if(err){
                    reject(err);
                }else{
                    resolve(data);
                }
            })
        })
    }

    deleteOrder(id){
        return new Promise((resolve, reject)=>{
            let sql = `DELETE FROM orders WHERE id = ${id}`;
            this.con.query(sql, (err, data)=>{
                if(err){
                    reject(err);
                }else{
                    resolve(data);
                }
            })
        })
    }

    deleteOrderDetail(id){
        return new Promise((resolve, reject)=>{
            let sql = `DELETE FROM orderdetail WHERE oId = ${id}`;
            this.con.query(sql, (err, data)=>{
                if(err){
                    reject(err);
                }else{
                    resolve(data);
                }
            })
        })
    }
}

module.exports = AdminModel;