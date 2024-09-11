const mysql = require('mysql2/promise')

const connectionDB = async () => {
    try {
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'AnDrEy200509',
            database: 'institucion'
        });
        console.log("Conexion exitosa con mysql.");
        return connection;
    }catch(error){
        console.log("Error en la conexion a la Base Datos: ", error);
        return error;
    }
}

module.exports = {connectionDB}