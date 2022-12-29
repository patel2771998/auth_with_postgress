const db = require("../models");
const User = db.user;

checkDuplicateUsername = (req, res, next) => {
    User.findAll({ where: { user_name: req.body.user_name } })
        .then(data => {
            if (data.length == 0) {
                next();
            } else {
                return res.status(400).send({
                    status: false,
                    message: "Failed! Username is already in use!"
                });
            }
        })
        .catch(err => {
            return res.status(500).send({
                status: false,
                message: err.message || "Some error occurred while retrieving users."
            });
        });
};


checkDuplicateUserEmail = (req, res, next) => {
    User.findAll({ where: { email: req.body.email } })
        .then(data => {
            if (data.length == 0) {
                next();
            } else {
                return res.status(400).send({
                    status: false,
                    message: "Failed! Email is already in use!"
                });
            }
        })
        .catch(err => {
            return res.status(500).send({
                status: false,
                message: err.message || "Some error occurred while retrieving users."
            });
        });
};


checkRole = (req, res, next) => {
    User.findOne({ where: { id: req.userId } })
        .then(data => {
            if (data.role == "manager" || data.role == "admin") {
                next();
            } else {
                return res.status(400).send({
                    status: false,
                    message: "not access your account!"
                });
            }
        })
        .catch(err => {
            return res.status(500).send({
                status: false,
                message: err.message || "Some error occurred while retrieving users."
            });
        });
};



const verificationUserName = {
    checkDuplicateUsername: checkDuplicateUsername,
    checkDuplicateUserEmail: checkDuplicateUserEmail,
    checkRole : checkRole
};

module.exports = verificationUserName;


