USE labb;
DROP TABLE IF EXISTS bookedLog;
DROP TABLE IF EXISTS bookedEquipment;
DROP TABLE IF EXISTS currently_booked_equiment;
DROP TABLE IF EXISTS equipmentIndex;
DROP TABLE IF EXISTS equipment;
DROP TABLE IF EXISTS `users`;
DROP PROCEDURE IF EXISTS show_AllEquipment;
DROP PROCEDURE IF EXISTS add_new_equipment;
DROP PROCEDURE IF EXISTS showEquipment;
DROP PROCEDURE IF EXISTS editEquipment;
DROP PROCEDURE IF EXISTS delete_equipment;
DROP PROCEDURE IF EXISTS show_all;
DROP PROCEDURE IF EXISTS show_available_equipment;
DROP PROCEDURE IF EXISTS showUserInfo;
DROP PROCEDURE IF EXISTS show_user_info;
DROP PROCEDURE IF EXISTS add_equipment_to_user;
DROP PROCEDURE IF EXISTS returnEquipment;
DROP PROCEDURE IF EXISTS show_booked_equipment;
DROP PROCEDURE IF EXISTS show_bookedLog;


CREATE TABLE `users` (
 `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
 `name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
 `email` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
 `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
 PRIMARY KEY (`id`),
 UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE equipment (
id int(50) UNSIGNED PRIMARY KEY,
namn char(100)  COLLATE utf8mb4_unicode_ci,
model char(100)  COLLATE utf8mb4_unicode_ci,
stat CHAR(20)  COLLATE utf8mb4_unicode_ci DEFAULT "OK" 
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE equipmentIndex (
equipment_id int(50) UNSIGNED,
equipment_namn char(100)  COLLATE utf8mb4_unicode_ci,
equipment_model char(100)  COLLATE utf8mb4_unicode_ci,
equipment_stat CHAR(20)  COLLATE utf8mb4_unicode_ci DEFAULT "OK" 
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE currently_booked_equiment(
	user_id INT(10) UNSIGNED,
    equipment_id int(50) UNSIGNED,
    
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (equipment_id) REFERENCES equipment(id)
);


CREATE TABLE bookedEquipment(
	eq_id INT unsigned,
    user_id  INT unsigned,
    booked TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    whenToReturn TIMESTAMP DEFAULT NULL,
    returned TIMESTAMP DEFAULT NULL,
    
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(eq_id) REFERENCES equipment(id)
);


CREATE TABLE bookedLog(
	booking_nr INT AUTO_INCREMENT primary key,
	equip_id INT UNSIGNED,
    user_id INT UNSIGNED,
    booked TIMESTAMP DEFAULT NULL,
    whenReturn TIMESTAMP DEFAULT NULL,
    Returned TIMESTAMP DEFAULT NULL,
    
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(equip_id) REFERENCES equipment(id)
);


DELIMITER ;;
CREATE PROCEDURE show_AllEquipment()
BEGIN
	SELECT * FROM equipment
;
END
;;
DELIMITER ;


DELIMITER ;;
CREATE PROCEDURE add_new_equipment(
	a_id INT,
    a_namn CHAR(100),
    a_model CHAR(100),
    a_stat CHAR(100)
)
BEGIN
	INSERT INTO equipment VALUES (a_id, a_namn, a_model, a_stat);
    INSERT INTO equipmentIndex VALUES (a_id, a_namn, a_model, a_stat);
END
;;
DELIMITER ;


DELIMITER ;;
CREATE PROCEDURE showEquipment(
	a_id INT
)
BEGIN
	SELECT * FROM equipment WHERE id = a_id;
END
;;
DELIMITER ;


DELIMITER ;;
CREATE PROCEDURE editEquipment(
	a_id INT,
    a_namn CHAR(100),
    a_model CHAR(100),
    a_stat CHAR(100)
)
BEGIN
	UPDATE equipment SET
		`namn` = a_namn,
        `model` = a_model,
        `stat` = a_stat
	WHERE
		`id` = a_id;
	UPDATE equipmentIndex SET
		`equipment_namn` = a_namn,
        `equipment_model` = a_model,
        `equipment_stat` = a_stat
	WHERE
		`equipment_id` = a_id;
END
;;
DELIMITER ;


DELIMITER ;;
CREATE PROCEDURE delete_equipment(
	e_id INT
)
BEGIN
	DELETE FROM currently_booked_equiment
    WHERE
		equipment_id = e_id;
	DELETE FROM equipment
    WHERE
		id = e_id;
	DELETE FROM equipmentIndex
    WHERE
		equipment_id = e_id;
END
;;
DELIMITER ;


DELIMITER ;;
CREATE PROCEDURE show_all()
BEGIN
	SELECT * FROM equipment;
END
;;
DELIMITER ;


DELIMITER ;;
CREATE PROCEDURE show_available_equipment()
BEGIN
	SELECT * FROM equipmentIndex;
END
;;
DELIMITER ;


DELIMITER ;;
CREATE PROCEDURE showUserInfo(
	u_id INT(10)
)
BEGIN
	SELECT id, name, email FROM users WHERE id = u_id;
END
;;
DELIMITER ;

DELIMITER ;;
CREATE PROCEDURE show_user_info()
BEGIN
	SELECT id, email FROM users;
END
;; 
DELIMITER ;


DELIMITER ;;
CREATE PROCEDURE add_equipment_to_user(
	u_id INT unsigned,
    p_id INT unsigned
)
BEGIN
	INSERT INTO currently_booked_equiment(user_id, equipment_id)
		VALUE(u_id, p_id);
    DELETE FROM equipmentIndex WHERE equipment_id = p_id; 
    INSERT INTO bookedEquipment(user_id, eq_id)
		VALUES (u_id, p_id);
	UPDATE bookedEquipment SET
		booked = current_timestamp()
		WHERE 
			user_id = u_id;
	UPDATE bookedEquipment SET
		whenToReturn = current_timestamp()
		WHERE
			user_id = u_id;
	UPDATE bookedEquipment SET
		whenToReturn=adddate(whenToReturn, INTERVAL 30 DAY)
		WHERE
			user_id = u_id;
	
    INSERT INTO bookedLog(user_id, equip_id)
		VALUES (u_id, p_id);
    UPDATE bookedLog SET
		booked = current_timestamp()
		WHERE 
			user_id = u_id;
	UPDATE bookedLog SET
		whenReturn = current_timestamp()
		WHERE
			user_id = u_id;
	UPDATE bookedLog SET
		whenReturn=adddate(whenReturn, INTERVAL 30 DAY)
		WHERE
			user_id = u_id;
END
;;
DELIMITER ;

DELIMITER ;;
CREATE PROCEDURE returnEquipment(
	e_id INT unsigned,
    u_id INT unsigned
)
BEGIN
	INSERT INTO equipmentIndex(equipment_id, equipment_namn, equipment_model, equipment_stat)
		SELECT id, namn, model, stat FROM equipment WHERE id = e_id;
    DELETE FROM currently_booked_equiment WHERE equipment_id = e_id;
    DELETE FROM bookedEquipment WHERE eq_id = e_id;
    UPDATE bookedLog SET returned = current_timestamp() WHERE equip_id = e_id;
END
;;
DELIMITER ;



DELIMITER ;;
CREATE PROCEDURE show_booked_equipment(
	u_id INT unsigned
)
BEGIN
	SELECT
	cb.user_id,
	cb.equipment_id,
	e.namn,
	e.model,
	e.stat,
	b.booked,
	b.whenToReturn
FROM currently_booked_equiment AS cb
	JOIN equipment AS e 
		ON cb.equipment_id = e.id
	JOIN bookedEquipment AS b
		ON cb.equipment_id = b.eq_id
WHERE
	cb.user_id = u_id
;
END
;;
DELIMITER ;


DELIMITER ;;
CREATE PROCEDURE show_bookedLog()
BEGIN
SELECT
	bl.booking_nr,
	u.id,
	u.`name`,
    u.email,
    e.id as equipment_id,
    e.namn,
    e.model,
    bl.booked,
    bl.whenReturn,
    bl.returned
FROM users AS u
	JOIN bookedLog AS bl
		ON bl.user_id = u.id
	JOIN equipment AS e
		ON e.id = equip_id
;
END
;;
DELIMITER ;



    