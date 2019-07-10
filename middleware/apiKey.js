const config = require('config');

const apiKey = (req, res, next) => {
    if(req.method == 'OPTIONS'){
        return next();
    }
    let apiKeyHeader = req.header('X-API-KEY');
    if(!apiKeyHeader){ //Se não tiver o header
        return res.status(401).send('Não autorizado!');
    }
    if(config.apiKeys.indexOf(apiKeyHeader) == -1){ //Checa para ver se chave da api esta entre as cadastradas, normalmente buscaria do banco mais para simplificar...
        return res.status(401).send('Não autorizado!');
    };
    return next();
};
module.exports = apiKey;
