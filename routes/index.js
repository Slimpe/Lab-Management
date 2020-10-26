"use strict";

const express = require("express");
const router = express.Router();
const labb = require("../src/labb.js");
const bodyParser = require("body-parser");
const { ifLoggedin } = require("../middleware/index.js");
const urlencodedParser = bodyParser.urlencoded({ extended: false });

router.get("/index", (req, res) => {
    let data = {
        title: "Welcome to Labb Management"
    };

    res.render("labb/index", data);
});

/*router.get("/equipment", async (req, res) => {
    let data = {
        title: "All Equipment"
    };

    data.res = await labb.allEquipment();

    res.render("labb/equipment", data);
});*/

/*router.get("/addEquipment", async (req, res) => {
    let data = {
        title: "Add Equipment"
    };

    res.render("labb/addEquipment", data)
});*/

/*router.post("/addEquipment", urlencodedParser, async (req, res) => {
    await labb.addEquipment(req.body.id, req.body.namn, req.body.model);

    res.redirect("/equipment");
});*/

module.exports = router