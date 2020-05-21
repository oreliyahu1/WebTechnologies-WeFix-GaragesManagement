const jwt = require('jsonwebtoken');
const secret = require('../config').jwtSecret;

const emailHandler = require('../extends/email');
const Employee = require('../models/employee');
const Counter = require('../models/counter');
const syncUser = require('./sync').syncOff;

module.exports = function (app, apiLocation) {

	//init employee schema => _id is increment key
	var counter = new Counter({_id: Employee.collection.collectionName});
	counter.save(err => {
		if(err) console.log('Counter of employees is already exists');
	});

	//new employee
	app.post(apiLocation + '/signup', function(req, res) {
		if(!checkEmailAndPassword(req.body.email, req.body.password)) return res.json({response : 'Error'}); //check signup mail&password like client

		Employee.findOne({email: req.body.email.toLowerCase()}, (err, result) => {
			if(err) return res.json({response : 'Error'});
			if(result) return res.json({response : 'Error', msg : 'Employee already exists in the system'}); 
			
			Counter.findByIdAndUpdate(counter, { $inc: { seq: 1 } }, { new: true }, (err, result) => {
				if(err) return res.json({response : 'Error'});
		
				req.body._id = Number(result.seq);
				var newEmployee = new Employee(req.body);
				newEmployee.email = req.body.email.toLowerCase();
				newEmployee.status = 'New Employee';
				if(Number(result.seq) == 1)
					newEmployee.status = 'Admin';
				newEmployee.save(err => {
					if(err){
						if(err.code == 11000)
							return res.json({response : 'Error', msg : 'Employee already exists in the system'}); 
						return res.json({response : 'Error'})
					}
	
					var text = 'User: ' + req.body.email + '\nPassword: ' + req.body.password;
					emailHandler.sendMail(req.body.email, 'Thank you for registering', newEmployee.firstname, text); //send mail to user about successful registration
					return res.json({response : 'Success', msg : 'Successfully registered to user ' + req.body.email });
				});
			});
		});
	});
	
	//forgotpassword
	app.post(apiLocation + '/forgotpassword', function(req, res) {
		if(req.body.email == null) return res.json({response : 'Error'});
		
		Employee.findOne({email: req.body.email.toLowerCase()}, (err, result) => {
			if(err) return res.json({response : 'Error'});
			if(result == null) return res.json({response : 'Error', msg : 'User ' + req.body.email + ' doesnt in the system'});
			
			var text = 'User: ' + result.email + '\nPassword: ' + result.password;
			emailHandler.sendMail(req.body.email, 'Reset Password', result.firstname, text); //send mail with the password
			return res.json({response : 'Success', msg : 'Password sent to email ' + req.body.email });
		});
	});
	
	//login
	app.post(apiLocation + '/login', function(req, res) {
		if(req.body.email == null) return res.json({response : 'Error'});
	
		Employee.findOne({email: req.body.email.toLowerCase()}, (err, result) => {
			if(err) return res.json({response : 'Error'});
			if((result == null) || (result.password != req.body.password)) return res.json({response : 'Error', msg : 'Incorrect username or password'});
			result = result.toJSON();
			const token = jwt.sign({ id: result._id }, secret);
			delete result.password;
			result.token = token;
			syncUser(result._id);
			return res.json({response : 'Success', msg : 'Login successful', data: result });
		});
	});
	
	//logout from system
	app.post(apiLocation + '/logout', function(req, res) {
		res.json({response : 'Success', msg : 'Logout successful'});
	});
};

//check mail and password
function checkEmailAndPassword(email, pass){
	if(email == null || pass == null) return false;
	if (!email.match(/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/))
		return false;
	if(pass.length < 6){
		return false;
	} else if (!pass.match(/^(?=.*[A-Z])/)){
		return false;
	} else if (!pass.match(/^(?=.*[a-z])/)){
		return false;
	} else if (!pass.match(/^(?=.*\d)/)){
		return false;
	} else if (!pass.match(/^(?=.*[-!$%^&*()_+|~=`{}\[\]:\/;<>?,.@#])/)){
		return false;
	}
	return true;
}