const expressJwt = require('express-jwt');
const projectConfig = require('./config');
const Employee = require('./models/employee');

function jwt() {
    return expressJwt({ secret : projectConfig.jwtSecret, isRevoked : isRevoked }).unless({
        path: [
            // public routes that don't require authentication
            '/favicon.ico',
            '/api/users/login',
            '/api/users/forgotpassword',
            '/api/users/signup',
            '/api/users/logout'
        ]
    });
}

function isRevoked(req, payload, done) {
    if(!Number(payload.id))
        return done(new Error('Invalid token'));
    Employee.findById(Number(payload.id), (err, result) => {
        if(err) return done(err);
        if (!result) { return done(new Error('missing_secret')); }
        return done(false, null);
        //return done(false, projectConfig.jwtSecret);
    });
};

module.exports = jwt;