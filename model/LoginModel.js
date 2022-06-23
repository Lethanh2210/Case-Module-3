let Database = require('./Database.js')

class LoginModel {
    constructor() {
        this.con = Database.connect();
    }

    loginQuery(email,password) {
        return new Promise((resolve, reject)=>{
            let sql = `SELECT * FROM users WHERE email = '${email}' AND password = '${password}'`;
            this.con.query(sql, (err, data)=>{
                if(err){
                    reject(err);
                }else{
                    resolve(data);
                }
            })
        })
    }

    signUpQuery(name, email, password, role) {
        return new Promise((resolve, reject)=>{
            let sql = `INSERT INTO users(name,email,password,roleID) VALUES ('${name}', '${email}', '${password}', ${role})`;
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

module.exports = LoginModel;