const mongoose = require('mongoose');

const schema = mongoose.Schema({
    nome: {
        type:String, 
        required:true
    },
    abreviacao: {
        type:String, 
        required:true
    },
    data_ultima_alteracao: { 
        type:Date
    }
 });
schema.virtual('data_cricacao').get(function(){
    return this._id.getTimestamp().toISOString(); // Porque o id gerado pelo mongo ja contem a data de criacao, entao crio uma propriedade virtual para recuperar esta informação
})
schema.set('toJSON',{virtuals: true }); //Instruindo o mongo a incluir nesse schema os campos virtuais
const model = mongoose.model('Estado', schema) 
module.exports = model;