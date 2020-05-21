const mongoose = require('mongoose');

//location schema
const locationSchema = new mongoose.Schema({
	country: {type: String, required: true},
	city: {type: String, required: true},
	street: {type: String, required: true},
	position: { type: {
		lat:  { type: Number },
		lng:  { type: Number }
	}},
});

module.exports = Location = mongoose.model('Location', locationSchema);