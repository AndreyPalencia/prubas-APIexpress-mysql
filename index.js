const express = require('express');
const app = express();
const mysql = require('./conexion');

app.use(express.json());

//Endpoints para realizar consultas a la tabla de "Estudiantes"

//Endpoint Get para obtener todos los estudiantes de la tabla de "Estudiantes"
app.get('/estudiantes', async (parametros, respuesta) => {
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

//Endpoint Get para obtener un solo estudiante por su "numero de Documento"
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

//Endpoint Post para crear un solo estudiantes
app.post('/estudiantes/create', async (parametros, respuesta) => {
    try {
        const conexion = await mysql.connectionDB();
        const nowEstudiante = parametros.body;
        if (!nowEstudiante.documento) {
            return respuesta.status(400).send({ mensaje: "Numero documento no puede ser vacio." });
        }
        await conexion.execute("INSERT INTO estudiante(documento,nombre,email) VALUES(?,?,?)", [nowEstudiante.documento, nowEstudiante.nombre, nowEstudiante.email]);
        respuesta.status(201).send("Nuevo estudiante creado.");
    } catch (error) {
        respuesta.status(500).send(error);
    }
});

//Endpoints para realizar consultas a la tablas de cursos

//Endpoint para obtener todos los cursos
app.get('/cursos', async (req, res) => {
    try {
        const conexion = await mysql.connectionDB();
        const [filas] = await conexion.execute("SELECT * FROM curso");
        if(filas.length === 0){
            return res.status(404).send({mensaje : "No se encontraron registros."});
        }
        res.status(200).send(filas)
    }catch(error){
        res.status(500).send(error);
    }
})

//Endpoint para crear un curso 
app.post('/cursos/create', async (parametros, respuesta) => {
    const {codigo, nombre, docente, descripcion} = parametros.body;
    if (!codigo) {
        return respuesta.status(400).send({ mensaje: "El codigo no puede ser vacio." });
    }
    try {
        const conexion = await mysql.connectionDB();
        await conexion.execute("INSERT INTO curso(codigo, nombre, docente, descripcion) VALUES(?,?,?,?)", [codigo, nombre, docente, descripcion]);
        respuesta.status(201).send("Nuevo curso creado.");
    }catch(error){
        console.log(error)
        respuesta.status(500).send(error);
    }
});

//Endpoints parar relaizar consultas a la tabla de notas

//Endpoint Post para crear un nota
app.post('/nota/create', async (req, res) => {
    const {doc_estudiante, codigo_curso, nota, fecha} = req.body;
    if (!doc_estudiante || !codigo_curso){
        return res.status(400).send({mensaje: "El documento estudiante y codigo del curso no pueden ser vacio."});
    }
    try{
        const conexion = await mysql.connectionDB();
        await conexion.execute("INSERT INTO nota(id, documento_estudiante, codigo_curso, nota, fecha) VALUES(NULL,?,?,?,?)", [doc_estudiante, codigo_curso, nota, fecha]);
        res.status(201).send("Nueva nota creada.")
    }catch(error){
        res.status(500).send(error);
    }
});

//Endpoints PUT para modificar una nota
app.put('/notas/:id/update', async (req, res) => {
    const idNota = req.params.id;
    const {doc_estudiante, codigo_curso, nota, fecha} = req.body;
    if(!idNota) {
        return res.status(400).send({mensaje: "El id de la nota no puede ser null."})
    }
    try{
        const conexion = await mysql.connectionDB();
        await conexion.execute("UPDATE nota SET documento _estudiante = ?, codigo_curso = ?, nota = ?, fecha = ? WHERE nota.id = ?", [doc_estudiante, codigo_curso, nota, fecha, idNota]);
        res.status(200).send("Se realizado los cambios a la nota.")
    }catch(error){
        console.log(error)
        res.status(500).send(error);
    }
});

const port = 3000;
app.listen(port, () => {
    console.log("El servidor esta en linea en el puerto: "+ port);
});