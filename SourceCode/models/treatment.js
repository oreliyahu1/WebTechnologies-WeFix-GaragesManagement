const mongoose = require('mongoose');

//treatment schema
const treatmentSchema = new mongoose.Schema({
	_id: {type: Number, required: true},
	garage: { type: Number, ref: 'Garage', required: true },
	carid: {type: Number, required: true},
	status: {type: String, enum : ['Waiting','In process', 'Done'], default: 'Waiting', required: true},
	details: {type: String, required: true},
	cost: {type: Number, required: true},
	date: {type: Date, default: Date.now, required: true}
});

module.exports = Treatment = mongoose.model('Treatment' ,treatmentSchema);