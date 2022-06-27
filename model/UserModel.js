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
                    resolve();
                }
            })
        })
    }

    pushOrderDetails(carts){
        return new Promise((resolve, reject)=>{
            this.takeIdOrder()
                .then((data)=>{
                carts.forEach(item=>{
                    let sql = `INSERT INTO orderdetail (oId, pId) VALUES (${data[0].id}, ${item.id})`;
                    console.log(sql);
                    this.con.query(sql, (err, data1)=>{
                        if(err){
                            reject(err);
                        }else{
                            resolve();
                        }
                    })
                })

            })
                .catch((err)=>{

                })
        })
    }

    pushOrd(oid,pid){
        return new Promise((resolve, reject)=>{
            let sql = `INSERT INTO orderdetail (oId, pId) VALUES (${oid}, ${pid})` ;
            this.con.query(sql, (err, data)=>{
                if(err){
                    reject(err);
                }else{
                    resolve(data);
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