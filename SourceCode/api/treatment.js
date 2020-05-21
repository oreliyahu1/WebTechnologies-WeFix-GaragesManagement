const Treatment = require('../models/treatment');
const Counter = require('../models/counter');

module.exports = function (app, pageLocation) {
   
	//init treatment schema => _id is increment key
	var counter = new Counter({_id: Treatment.collection.collectionName});
	counter.save(err => {
		if(err) console.log('Counter of treatment is already exists');
	});

	//get all treatments
	app.get(pageLocation, function(req, res) {		
		Treatment.find({}, (err, result) => {
			if(err) return res.json({response : 'Error'});
			return res.json(result);
		});
	});

	//add new treatment
	app.post(pageLocation + '/add', function(req, res) {	
		Counter.findByIdAndUpdate(counter, { $inc: { seq: 1 } }, { new: true }, (err, result) => {
			if(err) return res.json({response : 'Error'});
			
			req.body._id = result.seq;
			var newTreatment = new Treatment(req.body);
			newTreatment.save((err, result) => {
				if(err) return res.json({response : 'Error'});
				
				return res.json({response : 'Success', msg : 'Treatment number ' + result._id + ' added'}); 
			});
		});
	});
	
	//update treatment
	app.put(pageLocation + '/:id', function(req, res) {	
		req.body._id = req.params.id;
		var updateTreatment =  new Treatment(req.body);
		Treatment.findByIdAndUpdate(updateTreatment, { $set: updateTreatment }, (err, result) => {
			if(err) return res.json({response : 'Error'});
			if(result == null) return res.json({response : 'Error', msg : 'Treatment doesnt exist'}); 
			return res.json({response : 'Success', msg : 'Treatment number ' + updateTreatment._id + ' has been updated'}); 
		});
	});
	
	//delete treatment
	app.delete(pageLocation + '/:id', function(req, res) {
		Treatment.findByIdAndRemove(Number(req.params.id), (err, result) => {
			if (err) return res.json({response : 'Error'});
			
			if(result == null) return res.json({response : 'Error', msg : 'Treatment doesnt exist'}); 
			return res.json({response : 'Success', msg : 'Treatment number ' + Number(req.params.id) + ' has been deleted'}); 
		});
	});
};