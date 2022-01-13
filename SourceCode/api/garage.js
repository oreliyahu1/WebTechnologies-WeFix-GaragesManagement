const Garage = require('../models/garage');
const Counter = require('../models/counter');
const Employee = require('../models/employee');
const Treatment = require('../models/treatment');
const syncUser = require('./sync').sync;

module.exports = function (app, apiLocation) {

	//init garages schema => _id is increment key
	var counter = new Counter({_id: Garage.collection.collectionName});
	counter.save(err => {
		if(err) console.log('Counter of garages is already exists');
	});

	//get garages report
	app.get(apiLocation + '/report', function(req, res) {
		Garage.find({}, (err, result) => {
			if(err) return res.json({response : 'Error'});
			 
			async function processItems(result){
				af = [];
				for(element of result) {
					var fullGarage = element.toJSON();
					const mang = await Employee.findById(fullGarage.manager);
					fullGarage.manager = mang;
					if(fullGarage.manager)
						delete fullGarage.manager.password;
					const emps = await Employee.find({garage: fullGarage._id});
					fullGarage.employees = emps.length;
					const trtms = await getGarageReport(element._id);
					fullGarage.report = trtms;
					af.push(fullGarage);
				}
				return res.json(af);
			};
			processItems(result);
		});
	});

	//get all garages
	app.get(apiLocation, function(req, res) {	
		Garage.find({}, (err, result) => {
			if(err) return res.json({response : 'Error'});
			return res.json(result);
		});
	});
	
	//get garage by id
	app.get(apiLocation + '/:id', function(req, res) {		
		Garage.findById(Number(req.params.id), (err, result) => {
			if(err) return res.json({response : 'Error'});
			if(result == null) return res.json({response : 'Error', msg : 'Garage doesnt exist'}); 
			return res.json(result);
		});
	});

	//get garage report by id
	app.get(apiLocation + '/:id/report', function(req, res) {
		Garage.findById(Number(req.params.id), (err, result) => {
			if(err) return res.json({response : 'Error'});
			if(result == null) return res.json({response : 'Error', msg : 'Garage doesnt exist'}); 
			var fullGarage = result.toJSON();
			Employee.findById(result.manager, (err, result) => {
				if(err) return res.json({response : 'Error'});
				if(result){
					result = result.toJSON();
					delete result.password;
					fullGarage.manager = result;
				}
				Employee.find({garage: fullGarage._id}, async (err, result) => {
					if(err) return res.json({response : 'Error'});
					fullGarage.employees = result.length;
					const report = await getGarageReport(req.params.id);
					fullGarage.report = report;
					return res.json([fullGarage]);
				});
			});
		});
	});

	//get garage full by id
	app.get(apiLocation + '/:id/full', function(req, res) {		
		Garage.findById(Number(req.params.id), (err, result) => {
			if(err) return res.json({response : 'Error'});
			if(result == null) return res.json({response : 'Error', msg : 'Garage doesnt exist'}); 
			var fullGarage = result;
			Employee.findById(result.manager, (err, result) => {
				fullGarage.manager = result;
				Employee.find({garage: result._id}, (err, result) => {
					fullGarage.employees = result;
					Treatment.find({garage: fullGarage._id}, (err, result) => {
						fullGarage.treatments = result;
						return res.json(fullGarage);
					});
				});
			});
		});
	});

	//get garage manager by id
	app.get(apiLocation + '/:id/manager', function(req, res) {		
		Garage.findById(Number(req.params.id), (err, result) => {
			if(err) return res.json({response : 'Error'});
			if(result == null) return res.json({response : 'Error', msg : 'Garage doesnt exist'}); 
			Employee.findById(result.manager, (err, result) => {
				if(err) return res.json({response : 'Error'});
				return res.json(result);
			});
		});
	});

	//get garage employees by id
	app.get(apiLocation + '/:id/employees', function(req, res) {		
		Garage.findById(Number(req.params.id), (err, result) => {
			if(err) return res.json({response : 'Error'});	
			if(result == null) return res.json({response : 'Error', msg : 'Garage doesnt exist'}); 
			Employee.find({garage: result._id}, (err, result) => {
				if(err) return res.json({response : 'Error'});
				return res.json(result);
			});
		});
	});

	//get garage treatments by id
	app.get(apiLocation + '/:id/treatments', function(req, res) {	
		Garage.findById(Number(req.params.id), (err, result) => {
			if(err) return res.json({response : 'Error'});	
			if(result == null) return res.json({response : 'Error', msg : 'Garage doesnt exist'}); 
			Treatment.find({garage: result._id}, (err, result) => {
				if(err) return res.json({response : 'Error'});
				return res.json(result);
			});
		});
	});

	//add garage
	app.post(apiLocation + '/add', function(req, res) {
		Counter.findByIdAndUpdate(counter, { $inc: { seq: 1 } }, { new: true }, (err, result) => {
			if(err) return res.json({response : 'Error'});
			req.body._id = Number(result.seq);
			var newGarage =  new Garage(req.body);
			newGarage.save(err => {
				if(err) return res.json({response : 'Error'})
	
				return res.json({response : 'Success', msg : 'Successfully added garage'});
			});
		});
	});

	//update garage
	app.put(apiLocation + '/:id', function(req, res) {	
		req.body._id = Number(req.params.id);
		var updateGarage =  new Garage(req.body);
		Garage.findByIdAndUpdate(Number(req.params.id), { $set: updateGarage }, (err, result) => {
			if(err) return res.json({response : 'Error'});
			if(result == null) return res.json({response : 'Error', msg : 'Garage doesnt exist'}); 
			return res.json({response : 'Success', msg : 'Garage number ' + updateGarage._id + ' has been updated'}); 
		});
	});
	
	//delete garage
	app.delete(apiLocation + '/:id', function(req, res) {
		Garage.findByIdAndRemove(Number(req.params.id), (err, result) => {
			if (err) return res.json({response : 'Error'});
			if(result == null) return res.json({response : 'Error', msg : 'Garage doesnt exist'}); 

			Employee.find({garage: Number(req.params.id)}, (err, result) => {
				if (err) return res.json({response : 'Error'});
				async function processItems(result){
					for(element of result) {
						await element.updateOne({ $set: { status: 'None', garage: null }});
						syncUser(element._id);
					}
					return res.json({response : 'Success', msg : 'Garage number ' + Number(req.params.id) + ' has been deleted'}); 
				};
				processItems(result);
			});
		});
	});
};

async function getGarageReport(garageid){
	var lastyear = new Date(Date.now());
	lastyear.setMonth(lastyear.getMonth() - 12);
	var now = new Date(Date.now());
	return await Treatment.aggregate([
		{
			$match: {
				garage: Number(garageid),
			},
		},
		{
			$match: {
				date: {
					$gte: lastyear,
					$lte: now
				}
			},
		},
		{
			$project: {
				id: "$garage",
				datemy: {$dateFromParts: {'year' : {$year: "$date"}, 'month' : {$month: "$date"}}},
				cost: "$cost"
			}
		},
		{
			$group: {
				_id : "$datemy",
				count: {
					$sum: { "$sum" : 1 } ,
				},
				cost: {
					$sum: { "$sum" : "$cost" } ,
				}
			},
		},
		{ $sort : {_id: 1}}
	], (err, result) => {
		return result;
	});
}