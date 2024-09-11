const express = require('express');
const app = express();
const mysql = require('./conexion');

app.use(express.json());

//Metodo para realizar consultas a la tabla de "Estudiantes"

//Metodo Get para obtener todos los estudiantes de la tabla de "Estudiantes"
app.get('/estudiantes', async (pedido, respuesta) => {
    try {
        //Conectarse a la base de datos
        const conexion = await mysql.connectionDB();
        //Destructuracion del array de execute para solo guardar las filas de vueltas por la consulta 
        const [filas] = await conexion.execute("SELECT * FROM estudiante");
        respuesta.send(filas);
    } catch (error) {
        respuesta.status(500).send(error);
    }
});

//Metodo Get para obtener un solo estudiante por su "numero de Documento"
app.get('/estudiantes/:id', async (parametros, respuesta) => {
    try {
        const conexion = await mysql.connectionDB();
        const id = parametros.params.id;
        const [filas] = await conexion.execute("SELECT * FROM estudiante WHERE documento = ?", [id]);
        if (filas.length === 0) {
            return respuesta.status(404).send({ mensaje: "No existe usuario solicitado" });
        }
        respuesta.send(filas);
        console.log("Estudiante existente.");
    } catch (error) {
        respuesta.status(500).send(error);
    }
});


app.post('/estudiantes/create', async (parametros, respuesta) => {
    try {
        const conexion = await mysql.connectionDB();
        const nowEstudiante = parametros.body;
        if (!nowEstudiante.documento) {
            return respuesta.status(400).send({ mensaje: "Numero documento no puede ser vacio." });
        }
        await conexion.execute("INSERT INTO estudiante(documento,nombre,email) VALUES(?,?,?)", [nowEstudiante.documento, nowEstudiante.nombre, nowEstudiante.email]);
        //respuesta.send("Nuevo estudiante creado.")
        respuesta.status(201).send("Nuevo estudiante creado.");
    } catch (error) {
        respuesta.status(500).send(error);
    }
});

//Metos para realizar consultas a las tablas de 
app.post('/cursos/create', async (parametros, respuesta) => {
    try {
        const conexion = await mysql.connectionDB();
        const nowCurso = parametros.body;
        if (!nowCurso.codigo) {
            return respuesta.status(400).send({ mensaje: "El codigo no puede ser vacio." });
        }
        await conexion.execute("INSERT INTO (codigo, nombre, docente, descripcion) VALUES(?,?,?,?)", [nowCurso.codigo, nowCurso.nombre, nowCurso.docente, nowCurso.despcripcion]);
    }catch(error){
        respuesta.status(500).send(error);
    }
});

app.listen(3000, () => {
    console.log("El servidor esta en linea en el puerto 3000 ");
});