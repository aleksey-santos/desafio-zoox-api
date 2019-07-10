const express = require('express');
const router = express.Router();
const Estado = require('./../models/Estado');
router.get('/',async (req, res) => {
    try {
        let sortObject = {};
        let campoOrdenacao = req.query.ord?req.query.ord:'nome'; //Padrão ordenar por nome
        let direcao = req.query.dir?req.query.dir:'1'; //Em ordem crescente
        sortObject[campoOrdenacao] = direcao; //Para poder ordenar dinamicamente, mandando tanto qual o campo quanto a direção por parametros
        let resultados = await Estado.find({
                    'nome':new RegExp(req.query.nome,'i'), //Para filtrar por registros contendo a palavra
                    'abreviacao':new RegExp(req.query.abreviacao,'i')
                }).sort(sortObject);
        if(resultados.length > 0){
            return res.status(200).send({error:false,data:resultados});
        }else{
            return res.status(404).send({error:true,message:'Nenhum estado encontrado!'});
        }
    } catch (ex) {
        res.status(500).send({error:true,message:'Erro inexperado!',erro:ex});
    }
});

router.get('/:id', async (req, res) => {
    try {
        let resultado = await Estado.findById(req.params.id);
        if(resultado){
            return res.status(200).send({error:false,data:resultado});
        }else{
            return res.status(404).send({error:true,message:'Estado não encontrado!'});
        }
    } catch (ex) {
       return res.status(500).send(ex);
    }
});

router.post('/', async (req, res) => {
    try {
        estado = new Estado(req.body);
        estado.data_ultima_alteracao = Date.now();
        await estado.save();
        res.status(200).send({error:false,data:estado});
    } catch (err) {
        res.status(500).send({error:true,message:'Erro ao salvar o estado'});
    }

});

router.put('/:id', async (req, res) => {
    try {
        let estado = await Estado.findById(req.params.id);
        await estado.updateOne({nome:req.body.nome,abreviacao:req.body.abreviacao,data_ultima_alteracao:Date.now()});
        res.status(200).send({error:false,data:estado});
    } catch (ex) {
        res.status(500).send({error:true,message:'Erro ao atualizar o estado'});
    }
});

router.delete('/:id', async (req, res) => {
    try {
        Estado.findByIdAndRemove(req.params.id, (err) => {
            if (err) return res.status(500).send({error:true,message:'Erro ao excluir estado'});
            res.status(200).send({error:false,id:req.params.id});
        })
    } catch (ex) {
        res.status(500).send({error:true, message:'Erro desconhecido'});
    }
});

module.exports = router;
