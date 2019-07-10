const express = require('express');
const app = express();
const mongoose = require('mongoose'); //Mongoose
const config = require('config'); //Modulo para configuração
//Middleware de CORS - Cross origin resource sharing
const cors = require('./middleware/cors')
const apiKey = require('./middleware/apiKey');
//Rotas
const estado = require('./routes/Estado');//Rotas do Endpoint de Estado
const cidade = require('./routes/Cidade');//Rotas do Endpoint Cidade
//Configuracao
const port = config.get('porta'); //Porta do Servidor,definido no arquivo config/default.json
const dbUrl = config.get('dbUrl'); // Url de conexao da base de dados,definido no arquivo config/default.json
const dbName = config.get('dbName'); //Nome da base de dados,definido no arquivo config/default.json
require('./models/Cidade');
require('./models/Estado');
mongoose.connect(`${dbUrl}/${dbName}`, { useNewUrlParser: true }); //Conectando na base de dados


app.use(express.static('public')) //Middleware para arquivos estaticos.
app.use(express.json()); //Middleware para retorno em JSON.
app.use(cors); //Middleware de CORS.
app.use(apiKey);
app.use('/api/cidade',cidade); //Endpoints de Cidade
app.use('/api/estado',estado); //Endpoints de Estado
app.listen(port,() => {
    console.log(`Servidor rodando na porta: ${port}`);
});
