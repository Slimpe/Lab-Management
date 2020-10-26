/**
 * The Express server for SIAE19 eshop
*/

const port = process.env.PORT || 1337;
const path = require("path");
const express = require("express");
const app = express();
const labb = require("./src/labb");

const cookieSession = require("cookie-session");
const { body, validationResult } = require('express-validator');
const dbConnection = require("./database.js");
const bcrypt = require("bcrypt")

const routeIndex = require("./routes/index.js");
const middleware = require("./middleware/index.js");
const { ifNotLoggedin, ifLoggedin } = require("./middleware/index.js");

const bodyParser = require("body-parser");
const { userInfo } = require("os");
const urlencodedParser = bodyParser.urlencoded({ extended: false });


app.set("view engine", "ejs");

app.use(express.urlencoded({extended:false}));
app.use(cookieSession({
    name: 'session',
    keys: ['key1', 'key2'],
    maxAge:  3600 * 1000 // 1hr
}));

app.use(middleware.logIncomingToConsole);
app.use(express.static(path.join(__dirname, "public")));

app.get("/", ifNotLoggedin, (req, res, next) => {
    dbConnection.execute("SELECT `name` FROM `users` WHERE `id`=?", [req.session.userID]).then(([rows]) => {
        res.render("labb/index",{
            name:rows[0].name
        });
    });
});

app.post("/register", ifLoggedin,[
    body('user_email', 'Invalid email adress!').isEmail().custom((value) => {
        return dbConnection.execute("SELECT `email` FROM `users` WHERE `email`=?", [value]).then(([rows]) => {
            if(rows.length > 0) {
                return Promise.reject('This E-mail already in use');
            }
            return true;
        });
    }),
    body('user_name','Username is Empty!').trim().not().isEmpty(),
    body('user_pass','The password must be of minimum length 6 characters').trim().isLength({ min: 6 }),
],
(req, res, next) => {
    const validation_result = validationResult(req);
    const {user_name, user_pass, user_email} = req.body;
    // IF validation_result HAS NO ERROR
    if(validation_result.isEmpty()){
        // password encryption (using bcryptjs)
        bcrypt.hash(user_pass, 12).then((hash_pass) => {
            // INSERTING USER INTO DATABASE
            dbConnection.execute("INSERT INTO `users`(`name`,`email`,`password`) VALUES (?,?,?)",[user_name, user_email, hash_pass])
            .then(result => {
                res.send(`your account has been created successfully, Now you can <a href="/">Login</a>`);
            }).catch(err => {
                // THROW INSERTING USER ERROR'S
                if (err) throw err;
            });
        })
        .catch(err => {
            // THROW HASING ERROR'S
            if (err) throw err;
        })
    }
    else{
        // COLLECT ALL THE VALIDATION ERRORS
        let allErrors = validation_result.errors.map((error) => {
            return error.msg;
        });
        // REDERING login-register PAGE WITH VALIDATION ERRORS
        res.render('labb/login-register',{
            register_error:allErrors,
            old_data:req.body
        });
    }
});

app.post('/', ifLoggedin, [
    body('user_email').custom((value) => {
        return dbConnection.execute('SELECT `email` FROM `users` WHERE `email`=?', [value])
        .then(([rows]) => {
            if(rows.length == 1){
                return true;
                
            }
            return Promise.reject('Invalid Email Address!');
            
        });
    }),
    body('user_pass','Password is empty!').trim().not().isEmpty(),
], (req, res) => {
    const validation_result = validationResult(req);
    const {user_pass, user_email} = req.body;
    if(validation_result.isEmpty()){
        
        dbConnection.execute("SELECT * FROM `users` WHERE `email`=?",[user_email])
        .then(([rows]) => {
            bcrypt.compare(user_pass, rows[0].password).then(compare_result => {
                if(compare_result === true){
                    req.session.isLoggedIn = true;
                    req.session.userID = rows[0].id;

                    res.redirect('/');
                }
                else{
                    res.render('labb/login-register',{
                        login_errors:['Invalid Password!']
                    });
                }
            })
            .catch(err => {
                if (err) throw err;
            });


        }).catch(err => {
            if (err) throw err;
        });
    }
    else{
        let allErrors = validation_result.errors.map((error) => {
            return error.msg;
        });
        // REDERING login-register PAGE WITH LOGIN VALIDATION ERRORS
        res.render('labb/login-register',{
            login_errors:allErrors
        });
    }
});

app.get('/logout',(req,res)=>{
    //session destroy
    req.session = null;
    res.redirect('/');
});

app.get("/index", ifNotLoggedin, (req, res) => {
    let data = {
        title: "Welcome to Labb Management"
    };

    res.render("labb/index", data);
});

app.get("/equipment",ifNotLoggedin, async (req, res) => {
    let data = {
        title: "All Equipment"
    };

    data.res = await labb.allEquipment();

    res.render("labb/equipment", data);
});

app.get("/addEquipment",ifNotLoggedin, async (req, res) => {
    let data = {
        title: "Add Equipment"
    };

    res.render("labb/addEquipment", data)
});

app.post("/addEquipment", ifNotLoggedin, urlencodedParser, async (req, res) => {
    await labb.addEquipment(req.body.id, req.body.namn, req.body.model, req.body.stat);

    res.redirect("/equipment");
});

app.get('/profile', ifNotLoggedin, async (req,res,next) => {
    dbConnection.execute("SELECT `id`, `name`, `email`  FROM `users` WHERE `id`=?",[req.session.userID])
    .then(([rows]) => {
        res.render('labb/profile',{
            name:rows[0].name,
            id:rows[0].id,
            email:rows[0].email
        });
    });
});


app.get("/edit", ifNotLoggedin, async (req, res) => {
    let data = {
        title: "All equipment"
    }
    data.res = await labb.showAll();
    res.render("labb/edit", data);
});

app.get("/edit/:id", ifNotLoggedin, async (req, res) => {
    let id = req.params.id;
    let data = {
        product: id
    };

    data.res = await labb.showEquipment(id);
    console.log(data.res);
    res.render("labb/editEquipment", data);
});

app.post("/edit", ifNotLoggedin, urlencodedParser, async (req, res) => {
    await labb.editEquipment(req.body.id, req.body.namn, req.body.model, req.body.stat);

    res.redirect("/equipment")
});

app.get("/delete/:id", ifNotLoggedin, async (req, res) => {
    let id = req.params.id;
    let data = {
        product: id
    };

    data.res = await labb.showEquipment(id);
    console.log(data.res);
    res.render("labb/delete", data);
});

app.post("/delete", ifNotLoggedin, urlencodedParser, async (req, res) => {
    await labb.deleteEquipment(req.body.id);

    res.redirect("/equipment");
})

app.get("/bookEquipment", ifNotLoggedin, async (req, res) => {
    let id = req.session.userID;
    let data = {
        title: "Book Equipment",
        userid: id
    }

    data.res = await labb.showAvailableEquipment();
    console.log(data.res);

    res.render("labb/bookEquipment", data);
});

app.post("/bookEquipment", ifNotLoggedin, urlencodedParser, async (req, res) =>{
    console.log(req.body.userid, req.body.Equipment)

    await labb.addEquipmentToUser(req.body.userid, req.body.Equipment);

    res.redirect("/currentlyBooked");

});

app.get("/currentlyBooked", ifNotLoggedin, async (req, res) =>{
    current_user_id = req.session.userID;
    let data = {
        title: "My bookings",
        userid: current_user_id
    };
    
    data.res = await labb.showUserBookedEq(current_user_id);
    console.info(data.res);

    res.render("labb/currentlyBooked", data)
});

app.post("/currentlyBooked", ifNotLoggedin, urlencodedParser, async (req, res) =>{
    console.log(req.body.userid, req.body.equipmentID)

    await labb.returnEquipment(req.body.EquipmentID, req.body.userid);

    res.redirect("/currentlyBooked")
});

app.get("/bookingLog", ifNotLoggedin, async (req, res) => {
    let data = {
        title: "Log"
    }

    data.res = await labb.showLog();
    console.log(data.res);

    res.render("labb/bookingLog", data)
});


app.listen(port, logStartUpDetailsToConsole);

function logStartUpDetailsToConsole() {
    let routes = [];

    // Find what routes are supported
    app._router.stack.forEach((middleware) => {
        if (middleware.route) {
            // Routes registered directly on the app
            routes.push(middleware.route);
        } else if (middleware.name === "router") {
            // Routes added as router middleware
            middleware.handle.stack.forEach((handler) => {
                let route;

                route = handler.route;
                route && routes.push(route);
            });
        }
    });

    console.info(`Server is listening on port ${port}.`);
    console.info("Available routes are:");
    console.info(routes);
}
