const express = require('express');
const app = express();
const mysql = require('./conexion');

app.use(express.json());

//Endpoints para realizar consultas a la tabla de "Estudiantes"

//Endpoint Get para obtener todos los estudiantes de la tabla de "Estudiantes"
app.get('/estudiantes', async (req, res) => {
    try {
        //Conectarse a la base de datos
        const conexion = await mysql.connectionDB();
        //Destructuracion del array de execute para solo guardar las filas de vueltas por la consulta 
        const [filas] = await conexion.execute("SELECT * FROM estudiante");
        res.status(200).send(filas);
    } catch (error) {
        res.status(500).send(error);
    }
});

//Endpoint Get para obtener un solo estudiante por su "numero de Documento"
app.get('/estudiantes/:id', async (req, res) => {
    try {
        const conexion = await mysql.connectionDB();
        const id = req.params.id;
        const [filas] = await conexion.execute("SELECT * FROM estudiante WHERE documento = ?", [id]);
        if (filas.length === 0) {
            return res.status(404).send({ mensaje: "No existe usuario solicitado" });
        }
        res.status(200).send(filas);
        console.log("Estudiante existente.");
    } catch (error) {
        res.status(500).send(error);
    }
});

//Endpoint Post para crear un solo estudiantes
app.post('/estudiantes/create', async (req, res) => {
    const {documento, nombre, email} = req.body;
    if (!documento || isNaN(documento)) {
        return res.status(400).send({ mensaje: "Numero documento no puede ser vacio." });
    }
    try {
        const conexion = await mysql.connectionDB();
        const nowEstudiante = req.body;
        await conexion.execute("INSERT INTO estudiante(documento,nombre,email) VALUES(?,?,?)", [documento, nombre, email]);
        res.status(201).send("Nuevo estudiante creado.");
    } catch (error) {
        res.status(500).send(error);
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
app.post('/cursos/create', async (req, res) => {
    const {codigo, nombre, docente, descripcion} = req.body;
    if (!codigo || isNaN(codigo)) {
        return res.status(400).send({ mensaje: "El codigo no puede ser vacio." });
    }
    try {
        const conexion = await mysql.connectionDB();
        await conexion.execute("INSERT INTO curso(codigo, nombre, docente, descripcion) VALUES(?,?,?,?)", [codigo, nombre, docente, descripcion]);
        res.status(201).send("Nuevo curso creado.");
    }catch(error){
        console.log(error)
        res.status(500).send(error);
    }
});

//Endpoints parar relaizar consultas a la tabla de notas

//Endpoint Post para crear un nota
app.post('/notas/create', async (req, res) => {
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

//Endpoint PUT para modificar una nota
app.put('/notas/:id/update', async (req, res) => {
    const idNota = req.params.id;
    const {doc_estudiante, codigo_curso, nota, fecha} = req.body;
    if(!idNota || isNaN(idNota)) {
        return res.status(400).send({mensaje: "El id de la nota no puede ser null."})
    }
    try{
        const conexion = await mysql.connectionDB();
        const [filas] = await conexion.execute("UPDATE nota SET documento_estudiante = ?, codigo_curso = ?, nota = ?, fecha = ? WHERE nota.id = ?", [doc_estudiante, codigo_curso, nota, fecha, idNota]);
        if(filas.affectedRows === 0){
            return res.status(404).send("No se encontro un fila para acturalizar.")
        }
        res.status(200).send("Se realizado los cambios a la nota.")
    }catch(error){
        console.log(error)
        res.status(500).send(error);
    }
});

//Endpoint Delete para un nota en especifico
app.delete('/notas/:id/delete', async (req, res) => {
    const idNota = req.params.id;
    console.log(idNota);
    if(!idNota || isNaN(idNota)){
        return res.status(400).send("Id, de la nota no puede ser null,")
    }
    try{
        const conexion = await mysql.connectionDB();
        const [respuesta] = await conexion.execute("DELETE FROM nota WHERE id = ?", [idNota]);
        if(respuesta.affectedRows === 0) {
            return res.status(404).send("No se encontró la nota solicitada.");
        }
        res.status(200).send("El registro de la nota solicitada se a eliminado.");
    }catch(error){
        res.status(500).send(error);
    }
});

//Endpoints Get para obtener lo estudiantes aprobados
app.get("/notas/:codigo/aprobados", async (req, res) => {
    const codigoNotas = req.params.codigo;
    if(!codigoNotas || isNaN(codigoNotas)){
        res.status(400).send("El codigo del curso no puede ser null.")
    }
    try{
        const conexion = await mysql.connectionDB();
        const [filas] = await conexion.execute("SELECT * FROM nota WHERE codigo_curso = ? AND  nota >= 6", [codigoNotas]);
        if(filas.length === 0){
            return res.status(404).send({mensaje:"No se encuentran resgistros en BD."})
        }
        res.status(200).send(filas)
    }catch(error){
        console.log(error)
        res.status(500).send(error);
    }
});

const port = 3000;
app.listen(port, () => {
    console.log("El servidor esta en linea en el puerto: "+ port);
});