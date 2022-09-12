import mysql from "mysql"; 

const conector = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'ayawma'
    }
)

const conn = () => {

    conector.connect(err => {
        if(err) throw err; 
        console.log("Database has been connected")
    }
)

}

export {conn}; 