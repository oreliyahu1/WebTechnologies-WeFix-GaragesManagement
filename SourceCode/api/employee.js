const Employee = require('../models/employee');
const Garage = require('../models/garage');
const syncUser = require('./sync').sync;

module.exports = function (app, apiLocation) {

	//get all employees
	app.get(apiLocation, function(req, res) {	
		Employee.find({}, (err, result) => {
			if(err) return res.json({response : 'Error'});
			return res.json(result);
		});
	});
	
	//get full all employees
	app.get(apiLocation + '/full', function(req, res) {	
		Employee.find({}, (err, result) => {
			if(err) return res.json({response : 'Error'});
			async function processItems(result){
				for(element of result) {
					if(element.garage == null) {
						const mang = await Employee.findById(1);
						element.manager = mang;
					} else{
						const gara =  await Garage.findById(element.garage);
						element.garage = gara;
						const mang = await Employee.findById(element.garage.manager);
						element.manager = mang;
					}	
				}
				return res.json(result);
			};
			processItems(result);
		});
	});

	//get employee by id
	app.get(apiLocation + '/:id', function(req, res) {	
		Employee.findById(Number(req.params.id),  (err, result) => {
			if(err) return res.json({response : 'Error'});
			if(result == null) return res.json({response : 'Error', msg : 'Employee doesnt exist'}); 
			return res.json(result);
		});
	});

	//get employee full by id
	app.get(apiLocation + '/:id/full', function(req, res) {	
		Employee.findById(Number(req.params.id), async (err, result) => {
			if(err) return res.json({response : 'Error'});
			if(result == null) return res.json({response : 'Error', msg : 'Employee doesnt exist'}); 
			var fullEmployee = result;
			if(fullEmployee.garage == null){
				const mang = await Employee.findById(1);
				fullEmployee.manager = mang;
			}else{
				const gara =  await Garage.findById(fullEmployee.garage);
				fullEmployee.garage = gara;
				const mang = await Employee.findById(Number(fullEmployee.garage.manager));
				fullEmployee.manager = mang;
			}
			return res.json(fullEmployee);
		});
	});

	//get employee manager by id
	app.get(apiLocation + '/:id/manager', function(req, res) {	
		Employee.findById(Number(req.params._id), async (err, result) => {
			if(err) return res.json({response : 'Error'});
			if(result == null) return res.json({response : 'Error', msg : 'Employee doesnt exist'}); 
			if(result.garage == null){
				const mang = await Employee.findById(1);
				return res.json(mang);
			}else{
				const gara =  await Garage.findById(result.garage);
				const mang = await Employee.findById(Number(gara.manager));
				return res.json(mang);
			}
		});
	});

	//get employee garage by id
	app.get(apiLocation + '/:id/garage', function(req, res) {	
		Employee.findById(Number(req.params._id), (err, result) => {
			if(err) return res.json({response : 'Error'});
			if(result == null) return res.json({response : 'Error', msg : 'Employee doesnt exist'}); 
			Garage.findById(result.garage, (err, result) => {
				if(err) return res.json({response : 'Error'});
				return res.json(result);
			});
		});
	});

	//update employee
	app.put(apiLocation + '/:id', function(req, res) {
		var updateEmployee =  new Employee(req.body);
		updateEmployee._id = Number(req.params._id);
		if(req.body.action == 'Permission') {
			Employee.findById(updateEmployee._id, (err, result) => {
				if(err) return res.json({response : 'Error'});
				if(result == null) return res.json({response : 'Error', msg : 'Employee doesnt exist'}); 
				if(updateEmployee.status == 'Admin' || result.status == 'Admin') {
					return res.json({response : 'Error', msg : 'Admin roles cannot be changed!'}); 
				} else if(result.status == 'Manager') {
					if(updateEmployee.status == 'None' || updateEmployee.status == 'New Employee'){
						Garage.findById(result.garage, (err, result) => {
							if((err) || (result == null)) return res.json({response : 'Error'});
							result.manager = 1;
							Garage.findByIdAndUpdate(result._id, { $set: result }, (err, result) => {
								if((err) || (result == null)) return res.json({response : 'Error'});
								updateEmployee.garage = null;
								Employee.findByIdAndUpdate(updateEmployee._id, { $set: updateEmployee }, (err, result) => {
									if(err) return res.json({response : 'Error'});
									syncUser(updateEmployee._id);
									return res.json({response : 'Success', msg : 'Employee number ' + updateEmployee._id + ' has been updated'}); 
								});	
							});
						});
					} else if(updateEmployee.status == 'Employee') {
						Garage.findById(result.garage, (err, result) => {
							if((err) || (result == null)) return res.json({response : 'Error'});
							result.manager = 1;
							Garage.findByIdAndUpdate(result._id, { $set: result }, (err, result) => {
								if((err) || (result == null)) return res.json({response : 'Error'});
								Employee.findByIdAndUpdate(updateEmployee._id, { $set: updateEmployee }, (err, result) => {
									if(err) return res.json({response : 'Error'});
									syncUser(updateEmployee._id);
									return res.json({response : 'Success', msg : 'Employee number ' + updateEmployee._id + ' has been updated'}); 
								});	
							});
						});
					} else if(updateEmployee.status == 'Manager'){
						if(result.garage == updateEmployee.garage){
							return res.json({response : 'Success', msg : 'Employee number ' + updateEmployee._id + ' has been updated'}); 
						} else {
							const oldGarage = result.garage;
							Garage.findById(updateEmployee.garage, (err, result) => {
								if((err) || (result == null)) return res.json({response : 'Error'});
								if(result.manager == 1){
									result.manager = updateEmployee._id;
									Garage.findByIdAndUpdate(result._id, { $set: result }, (err, result) => {
										if((err) || (result == null)) return res.json({response : 'Error'});
										Employee.findByIdAndUpdate(updateEmployee._id, { $set: updateEmployee }, (err, result) => {
											if(err) return res.json({response : 'Error'});
											Garage.findByIdAndUpdate(oldGarage, { $set: {manager: 1} }, (err, result) => {
												if((err) || (result == null)) return res.json({response : 'Error'});
												syncUser(updateEmployee._id);
												return res.json({response : 'Success', msg : 'Employee number ' + updateEmployee._id + ' has been updated'}); 
											});
										});	
									});
								} else {
									return res.json({response : 'Error', msg : result.name + ' garage manager has already been defined'}); 
								}
							});		
						}
					} else {
						return res.json({response : 'Error'});
					}
				} else if ((result.status == 'Employee') || (result.status == 'None') || (result.status == 'New Employee')) {
					if(updateEmployee.status == 'None' || updateEmployee.status == 'New Employee'){
						updateEmployee.garage = null;
						Employee.findByIdAndUpdate(updateEmployee._id, { $set: updateEmployee }, (err, result) => {
							if((err) || (result == null)) return res.json({response : 'Error'});
							syncUser(updateEmployee._id);
							return res.json({response : 'Success', msg : 'Employee number ' + updateEmployee._id + ' has been updated'}); 
						});
					} else if(updateEmployee.status == 'Employee') {
						Garage.findById(updateEmployee.garage, (err, result) => {
							if((err) || (result == null)) return res.json({response : 'Error'});
							Employee.findByIdAndUpdate(updateEmployee._id, { $set: updateEmployee }, (err, result) => {
								if(err) return res.json({response : 'Error'});
								syncUser(updateEmployee._id);
								return res.json({response : 'Success', msg : 'Employee number ' + updateEmployee._id + ' has been updated'}); 
							});				
						});		
					} else if(updateEmployee.status == 'Manager'){
						Garage.findById(updateEmployee.garage, (err, result) => {
							if((err) || (result == null)) return res.json({response : 'Error'});
							if(result.manager == 1){
								result.manager = updateEmployee._id;
								Garage.findByIdAndUpdate(result._id, { $set: result }, (err, result) => {
									if((err) || (result == null)) return res.json({response : 'Error'});
									Employee.findByIdAndUpdate(updateEmployee._id, { $set: updateEmployee }, (err, result) => {
										if(err) return res.json({response : 'Error'});
										syncUser(updateEmployee._id);
										return res.json({response : 'Success', msg : 'Employee number ' + updateEmployee._id + ' has been updated'}); 
									});	
								});
							} else {
								return res.json({response : 'Error', msg : result.name + ' garage manager has already been defined'}); 
							}
						});
					} else {
						return res.json({response : 'Error'});
					}
				}  else {
					return res.json({response : 'Error'});
				}
			});
		} else if(req.body.action == 'Edit' || req.body.action == 'ResetPassword') {
			Employee.findByIdAndUpdate(updateEmployee._id, { $set: updateEmployee }, (err, result) => {
				if(err) return res.json({response : 'Error'});
				if(result == null) return res.json({response : 'Error', msg : 'Employee doesnt exist'}); 
				syncUser(updateEmployee._id);
				return res.json({response : 'Success', msg : 'Employee number ' + updateEmployee._id + ' has been updated'}); 
			});
		} else {
			return res.json({response : 'Error'});
		}
	});
	
	/*
	//delete employee
	app.delete(apiLocation + '/:id', function(req, res) {
		Employee.findByIdAndUpdate(Number(req.params._id), (err, result) => {
			if (err) return res.json({response : 'Error'});
			if(result == null) return res.json({response : 'Error', msg : 'Employee doesnt exist'}); 
			return res.json({response : 'Success', msg : 'Employee number ' + Number(req.params._id) + ' has been deleted'}); 
		});
	});
	*/
};