const mysql = require('mysql');

class Database{
    constructor() {
    }

    static connect(){
        return mysql.createConnection({
            'host': 'localhost',
            'user': 'root',
            'password': 'Anhyeuem.123',
            'database': 'book',
            'charset': 'utf8_general_ci'
        })
    }
}

module.exports = Database;