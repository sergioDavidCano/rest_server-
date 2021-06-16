//Conexion local
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;
process.env.PORT = process.env.PORT || 3000;
process.env.SEMILLADETOKEN = process.env.SEMILLADETOKEN || 'este-es-el-seed-desarrollo';
//Entorno 
/*process.env.NODE_ENV = process.env.NODE_ENV || 'dev';
//base de datos
let urlDB;
//if (process.env.NODE_ENV === 'dev') {
//  urlDB = 'mongodb://localhost:27017/cafe';
//} else {
urlDB = 'mongodb+srv://strider:ICg8QHL9kgnD8rOy@cluster0.envlt.mongodb.net/Coffe?retryWrites=true&w=majority'
    //}
process.env.URLDB = urlDB;*/