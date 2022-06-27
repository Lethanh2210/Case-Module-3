let Database = require('./Database.js');

class UserModel{
    constructor() {
        this.con = Database.connect();
    }

    getBookById(idB){
        return new Promise((resolve, reject)=>{
            let sql = `SELECT * FROM book WHERE id = ${idB}`;
            this.con.query(sql, (err, data)=>{
                if(err){
                    reject(err);
                }else{
                    resolve(data);
                }
            })
        })
    }

    pushOrder(date,totalPrice,cId){
        return new Promise((resolve, reject)=>{
            let sql = `INSERT INTO orders (oDate, totalPrice, cId) VALUES ('${date}', ${totalPrice}, ${cId})`;
            this.con.query(sql, (err, data)=>{
                if(err){
                    reject(err);
                }else{
                    resolve(data);
                }
            })
        })
    }

    pushOrderDetails(pId){
        this.takeIdOrder().then((data)=>{
            let sql = `INSERT INTO orderdetail (oId, pId) VALUES (${data[0].id}, ${pId})`;
            this.con.query(sql, (err, data1)=>{
                if(err){
                    throw new Error(err.message);
                }
            })
        })

    }

    takeIdOrder(){
        return new Promise((resolve, reject)=>{
            let sql = `SELECT * FROM orders ORDER BY id DESC LIMIT 1`;
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

module.exports = UserModel;