const mongoose = require('mongoose');
const Location = require('./location');

//garage schema
const garageSchema = new mongoose.Schema({
	_id: {type: Number, required: true},
	name: {type: String, required: true},
	location:  { type: Location.schema },
	manager: { type: Number, ref: 'Employee', default: 1 }
});

module.exports = Garage = mongoose.model('Garage' ,garageSchema);