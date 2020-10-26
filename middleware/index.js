/**
 * General middleware.
 */

"use strict";

function logIncomingToConsole(req, res, next) {
    console.info(`Got request on ${req.path} (${req.method}).`);
    next();
}

const ifNotLoggedin = (req, res, next) => {
    if(!req.session.isLoggedIn){
        return res.render("labb/login-register");
    }
    next();
}

const ifLoggedin = (req, res, next) => {
    if(req.session.isLoggedIn){
        return res.redirect("/index");
    }
    next();
}

module.exports = {
    logIncomingToConsole: logIncomingToConsole,
    ifNotLoggedin: ifNotLoggedin,
    ifLoggedin: ifLoggedin
};
