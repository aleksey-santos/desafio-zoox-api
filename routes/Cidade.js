const express = require('express');
const router = express.Router();
const Cidade = require('./../models/Cidade');

router.get('/',async (req, res) => {
    try {
        let sortObject = {};
        let queryObj = {
            'nome': new RegExp(req.query.nome,'i')
        }
        if(req.query.estado){
            queryObj.estado = req.query.estado;
        }
        let campoOrdenacao = req.query.ord?req.query.ord:'nome'; //Padrão ordenar por nome
        let direcao = req.query.dir?req.query.dir:'1'; //Em ordem crescente
        sortObject[campoOrdenacao] = direcao; //Para poder ordenar dinamicamente, mandando tanto qual o campo quanto a direção por parametros
        let resultados = await Cidade.find().where(queryObj).populate('estado','nome').sort(sortObject);
        if(resultados.length > 0){
            return res.status(200).send({error:false,data:resultados});
        }else{
            return res.status(404).send({error:false,message:'Nenhuma cidade encontrada!'});
        }
    } catch (ex) {
        return res.status(500).send({error:true,message:'Erro inexperado!'});
    }
});

router.get('/:id', async (req, res) => {
    try {
        let resultado = await Cidade.findById(req.params.id);
        if(resultado){
            return res.status(200).send({error:false,data:resultado});
        }else{
            return res.status(404).send({error:true,message:'Cidade não encontrada!'});
        }
    } catch (ex) {
       return res.status(500).send(ex);
    }
});

router.post('/', async (req, res) => {
    try {
        let cidade = new Cidade(req.body);
        cidade.data_ultima_alteracao = Date.now();
        await cidade.save();
        return res.status(200).send({error:false,data:cidade});
    } catch (err) {
        return res.status(500).send({error:true,message:'Erro ao salvar a Cidade'});
    }

});

router.put('/:id', async (req, res) => {
    try {
        let cidade = await Cidade.findById(req.params.id);
        await cidade.updateOne({nome:req.body.nome,estado:req.body.estado,data_ultima_atualizacao:Date.now()});
        return res.status(200).send({error:false,data:Cidade});
    } catch (ex) {
        return res.status(500).send({error:true,message:'Erro ao atualizar a cidade',erro:ex});
    }
});

router.delete('/:id', async (req, res) => {
    try {
        Cidade.findByIdAndRemove(req.params.id, (err) => {
            if (err) return res.status(500).send({error:true,message:"Erro ao excluir a cidade!"});
            return res.status(200).send({error:false,data:req.params.id});
        })
    } catch (ex) {
       return res.status(500).send({error:true,message:'Erro inesperado'});
    }
});

module.exports = router;
