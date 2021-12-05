const mongoose = require('mongoose');
const MongooseErrors = require('mongoose-errors');   // Plugin Mongoose-errors

const errorsSchema = new mongoose.Schema({
    requiredField: { type: String, required: true }
});

errorsSchema.plugin(MongooseErrors);

module.exports = mongoose.model('ModelName', errorsSchema);