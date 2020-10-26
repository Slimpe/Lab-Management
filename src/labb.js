module.exports = {
    allEquipment: equipment,
    addEquipment: add,
    showEquipment: showEquipment,
    editEquipment: editEquipment,
    deleteEquipment: deleteEquipment,
    showAll: showAll,
    userTable: userTable,
    userInfo: userInfo,
    addEquipmentToUser: addEquipmentToUser,
    showInfo: showInfo,
    showBookedEq: showBookedEq,
    showUserBookedEq: showUserBookedEq,
    showAvailableEquipment: showAvailableEquipment,
    returnEquipment: returnEquipment,
    showLog: showLog
}

const { body } = require("express-validator");
const mysql = require("promise-mysql");
const config = require("../config/db/labb.json");
const dbConnection = require("../database");
let db;

(async function() {
    db = await mysql.createConnection(config);

    process.on("exit", () => {
        db.end();
    });
})();

async function equipment() {
    let sql = `CALL show_AllEquipment();`;
    let res;

    res = await db.query(sql);

    return res[0];
}

async function add(id, namn, model, stat) {
    let sql = `CALL add_new_equipment(?, ?, ?, ?);`;
    let res;

    res = await db.query(sql, [id, namn, model, stat]);
    console.log(res);
    console.info(`SQL: ${sql} got ${res.length} rows`);
}

async function showEquipment(id) {
    let sql = `CALL showEquipment(?);`;
    let res;

    res = await db.query(sql, [id]);

    return res[0];
}

async function editEquipment(id, namn, model, stat) {
    let sql = `CALL editequipment(?, ?, ?, ?);`;

    await db.query(sql, [id, namn, model, stat]);
}

async function deleteEquipment(id) {
    let sql = `CALL delete_equipment(?);`;

    await db.query(sql, [id]);
}

async function showAll() {
    let sql = `CALL show_all();`;
    let res;

    res = await db.query(sql);
    return res[0];
}

async function userTable(name) {
    let sql = `CALL create_userbased_table(?);`;

    await db.query(sql, [name]);
}
async function userInfo() {
    let sql = `CALL show_user_info();`;

    await db.query(sql);
}

async function addEquipmentToUser(userid, Equipment) {
    let sql = `CALL add_equipment_to_user(?, ?);`;
    let res;

    res = await db.query(sql, [userid, Equipment]);
    console.log(res);
    console.info(`SQL: ${sql} got ${res.length} rows`);
}

async function showInfo(userid) {
    let sql = `CALL showUserInfo(?);`;
    let res;

    res = await db.query(sql, [userid]);
    console.log(res);
    console.info(`SQL: ${sql} got ${res.length} rows`);
}

async function showBookedEq(userID) {
    let sql = `CALL show_booked_equipment(?);`;
    let res;

    res = await db.query(sql, [userID]);
    console.log(res);
    console.info(`SQL: ${sql} got ${res.length} rows`);
}

async function showUserBookedEq(current_user_id) {
    let sql = `CALL show_booked_equipment(?);`;
    let res;

    res = await db.query(sql, [current_user_id]);
    console.log(res);
    console.info(`SQL: ${sql} got ${res.length} rows`);
    return res[0];
}

async function showAvailableEquipment() {
    let sql = `CALL show_available_equipment();`;
    let res;
    res = await db.query(sql);

    console.log(res);
    console.info(`SQL: ${sql} got ${res.length} rows`);
    return res[0];
}

async function returnEquipment(equipmentID, userid) {
    let sql = `CALL returnEquipment(?, ?);`;
    let res;

    res = await db.query(sql, [equipmentID, userid]);
    console.log(res);
    console.info(`SQL: ${sql} got ${res.length} rows`);
    return res;
}

async function showLog() {
    let sql = `CALL show_bookedLog();`;
    let res;
    
    res = await db.query(sql);
    console.log(res);
    console.info(`SQL: ${sql} got ${res.length} rows`);
    return res[0];
}