var md5 = require('md5');
const db = require("../models");
const User = db.user;
var jwt = require('jsonwebtoken');
const config = require('../config/db.config.js');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const sequelize = db.sequelize
const formidable = require('formidable');
const fs = require('fs');
const Item = db.item


exports.register = async (req, res) => {
    if (!req.body.firstName || !req.body.lastName || !req.body.email || !req.body.password || !req.body.dob) {
        return res.status(400).send({
            message: "please enter  a  required field!"
        });
    }
    try {
        const userData = {
            name: req.body.firstName + ' ' + req.body.lastName,
            email: req.body.email,
            password: md5(req.body.password),
            dob: req.body.dob,
            role: !!req.body.role ? req.body.role : "end_user"
        }
        const user = await User.create(userData)
        var token = jwt.sign({ id: user.id }, 'sample_app', {
            expiresIn: 604800 // 7 days
        });
        delete user.password;
        var data = {
            status: true,
            message: "successfully login  !",
            token: token,
            userData: user,
        }
        return res.send(data)
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            status: false,
            message: error.message || "Somthing  went  wrong !"
        });
    }
}


exports.login = async (req, res) => {
    if (!req.body.user_name || !req.body.password) {
        return res.status(400).send({
            message: "please enter user_name or email and password!"
        });
    }
    try {
        var url;
        const findUser = await User.findOne({
            where: { [Op.or]: [{ user_name: req.body.user_name }, { email: req.body.user_name }], password: md5(req.body.password) }
        })
        if (!!findUser) {
            var token = jwt.sign({ id: findUser.id }, 'sample_app', {
                expiresIn: 604800 // 24 hours
            });
            const item = await Item.findOne({ where: { id_user: findUser.id } })
            if (!!item) {
                url = config.url + item.name + '.' + item.ext
            }
            const userObject = {
                id: findUser.id,
                name: findUser.name,
                email: findUser.email,
                state: findUser.state,
                age: !! findUser.dob ? new Date().getUTCFullYear() - findUser.dob.split('-')[0]: '',
                city: findUser.city,
                role: findUser.role,
            }
            delete findUser.password;
            findUser.password = '';
            var data = {
                status: true,
                message: "successfully login  !",
                token: token,
                userData: userObject,
                profileUrl: url
            }
            return res.send(data)
        } else {
            return res.status(500).send({
                status: false,
                message: "please enter a correct username and password"
            });
        }
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            status: false,
            message: error.message || "Somthing  went  wrong !"
        });
    }
}


exports.loginWithGmail = async (req, res) => {
    try {
        const findGmailUser = await User.findOne({ where: { email: req.body.email } })
        if (!!findGmailUser) {
            const sendJson = {
                id: findGmailUser.id,
                email: findGmailUser.email,
                role: findGmailUser.role,
                first_name: findGmailUser.name.split(' ')[0],
                last_name: findGmailUser.name.split(' ')[1],
            }
            var token = jwt.sign({ id: findGmailUser.id, url: req.body.imageUrl }, 'sample_app', {
                expiresIn: 604800 // 24 hours
            });
            var data = {
                status: true,
                message: "successfully login !",
                token: token,
                userData: sendJson,
                profile: req.body.imageUrl
            }
            return res.send(data)

        } else {
            const user = {
                name: req.body.name,
                email: req.body.email,
                role: !!req.body.role ? req.body.role : 'end_user',
            };
            const userData = await User.create(user)
            user.id = userData.id
            var token = jwt.sign({ id: userData.id, url: req.body.imageUrl }, 'sample_app', {
                expiresIn: 604800 // 24 hours
            });
            var data = {
                status: true,
                message: "successfully login !",
                token: token,
                userData: user
            }
            return res.send(data)
        }
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            status: false,
            message: error.message || "Somthing  went  wrong !"
        });
    }
}


exports.listUserProfile = async (req, res) => {
    try {
        var minDate = new Date().toISOString().split('T')[0]
        var maxDate = '1900-01-01'
        var url;

        if (req.body.minAge) {
            var findDobMin = new Date().getFullYear() - req.body.minAge
            minDate = `${findDobMin}-${minDate.split('-')[1]}-${minDate.split('-')[2]}`
        }
        if (req.body.maxAge) {
            var findDobMax = new Date().getFullYear() - req.body.maxAge
            var maxDate = `${findDobMax}-${minDate.split('-')[1]}-${minDate.split('-')[2]}`
        }
        var where = {
            material_status: req.body.material_status ? req.body.material_status : 'unmarried',
            status: "active",
            role: "end_user",
        }
        if (req.body.name) {
            where[Op.or] = [
                { name: { [Op.like]: `%${req.body.name}%` } },
                // { last_name: { [Op.like]: `%${req.body.name}%` } },
                // { user_name: req.body.name },
            ]
        }
        if (req.body.casts) {
            where.casts = req.body.casts
        }
        if (req.body.minAge || req.body.maxAge) {
            where.dob = { [Op.between]: [maxDate, minDate] }
        }
        if (req.body.state) {
            where.state = req.body.state
        }
        console.log(where);
        var limit = parseInt(req.body.limit ? req.body.limit : config.limit)
        var page = parseInt(req.body.page ? (req.body.page - 1) * limit : 0)
        const userProfile = await User.findAndCountAll({
            where: where,
            offset: page,
            limit: limit,
            order: [
                ['id', 'DESC']
            ]
        })
        const List = [];
        for (var i = 0; i < userProfile.rows.length; i++) {
            var url1 = '';
            const findItem = await Item.findOne({ where: { id_user: userProfile.rows[i].id } })
            if (!!findItem) {
                url1 = config.url + findItem.name + '.' + findItem.ext
            }
            const object = {
                id: userProfile.rows[i].id,
                name: !!userProfile.rows[i].name ? userProfile.rows[i].name : '',
                email: !!userProfile.rows[i].email ? userProfile.rows[i].email : '',
                age: !!userProfile.rows[i].dob ? new Date().getUTCFullYear() - userProfile.rows[i].dob.split('-')[0] : '',
                state: !!userProfile.rows[i].state ? userProfile.rows[i].state : '',
                material_status: !!userProfile.rows[i].material_status ? userProfile.rows[i].material_status : '',
                role: !!userProfile.rows[i].role ? userProfile.rows[i].role : '',
                city: !!userProfile.rows[i].city ? userProfile.rows[i].city : '',
                profileUrl: url1
            }
            List.push(object)
        }
        const findItem = await Item.findOne({ where: { id_user: req.userId } })
        if (!!findItem) {
            url = config.url + findItem.name + '.' + findItem.ext
        }
        var data = {
            status: true,
            message: "Users Profile List",
            cuurentPage: !!req.body.page ? req.body.page : 1,
            totalPage: Math.ceil(userProfile.count / limit),
            count: userProfile.count,
            data: List,
            profileUrl: url
        }
        return res.send(data)
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            status: false,
            message: error.message || "Somthing  went  wrong !"
        });
    }
}


exports.viewProfile = async (req, res) => {
    if (!req.body.userId) {
        return res.status(500).send({
            status: false,
            message: 'Please Enter userId !!'
        });
    }
    try {
        var url;
        const user = await User.findByPk(req.body.userId)
        if (!!user) {
            if (!!user.heigth) {
                var findFI = user.heigth.split('.')
                var hegiht = {
                    FT: parseInt(findFI[0]),
                    in: parseInt(findFI[1])
                }
            }
            if (!!user.siblings) {
                var findS = user.siblings.split('.')
                var siblings = {
                    Brothers: parseInt(findS[0]),
                    Sisters: parseInt(findS[1])
                }
            }
            const dataOfProfile = {
                id: user.id,
                email: user.email,
                dob: user.dob,
                state: user.state,
                material_status: user.material_status,
                name: user.name,
                father_name: user.father_name,
                mother_name: user.mother_name,
                city: user.city,
                heigth: !!user.heigth ? hegiht : '',
                gender: user.gender,
                phone1: user.phone1,
                phone2: user.phone2,
                income: user.income,
                occupation: user.occupation,
                education: user.education,
                siblings: !!user.siblings ? siblings : 0,
                address1: user.address1,
                address2: user.address2,
                father_occupations: user.father_occupations,
                father_education: user.father_education,
                mother_occupations: user.occupation,
                mother_education: user.mother_education,
                marriage_budget: user.marriage_budget,
            }
            const findItem = await Item.findOne({ where: { id_user: user.id } })
            if (!!findItem) {
                url = config.url + findItem.name + '.' + findItem.ext
            }
            var data = {
                status: true,
                message: "UserProfile Details Succesfully View",
                data: dataOfProfile,
                profileUrl: url
            }
            return res.send(data)
        } else {
            return res.status(500).send({
                status: false,
                message: "User not found!"
            });
        }

    } catch (error) {
        console.log(error)
        return res.status(500).send({
            status: false,
            message: error.message || "Somthing  went  wrong !"
        });
    }
}


exports.delete = async (req, res) => {
    if (!req.body.userId) {
        return res.status(500).send({
            status: false,
            message: 'Please Enter user_id !!'
        });
    }
    try {
        const userData = await User.findOne({ where: { id: req.userId } })
        if (userData.role == "admin" || userData.role == "manager") {
            const user = await User.update({ status: "cancelled" }, { where: { id: req.body.userId } })
            var data = {
                status: true,
                message: req.body.userId + " is delete successfully"
            }
            return res.send(data)
        }
        return res.status(500).send({
            status: false,
            message: "not access user account delete!"
        });
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            status: false,
            message: error.message || "Somthing  went  wrong !"
        });
    }
}


exports.upload = async (req, res) => {
    try {
        let form = new formidable.IncomingForm();
        var fExt;
        form.uploadDir = __dirname + '/../../public'
        form.keepExtensions = true;
        form.multiples = false;
        form.maxFileSize = config.max_file_size;
        form.on('file', async function (field, file) {
            fExt = file.originalFilename.split(".");
            console.log(fExt[fExt.length - 1])
            fs.rename(file.filepath, form.uploadDir + "/" + file.newFilename + '.' + fExt[fExt.length - 1], (err) => {
                if (err) {
                    console.log(err);
                }
            });
        });
        const files = await new Promise(async function (resolve, reject) {
            form.parse(req, async function (err, fields, files) {
                if (err) {
                    console.error("Error Reject Promise", err);
                    reject(err);
                } else {
                    resolve(files);
                }
            })
        });
        files.file.filepath = files.file.newFilename + '.' + fExt[fExt.length - 1];
        if (!!files) {
            const itemData = {
                name: files.file.newFilename,
                ext: fExt[fExt.length - 1],
                id_user: req.userId,
            }
            const itemFind = await Item.findOne({ where: { id_user: req.userId } })
            console.log(itemFind);
            if (!!itemFind) {
                const updateItem = await Item.update(itemData, { where: { id: itemFind.id } })
            } else {
                console.log(itemData);
                const item = await Item.create(itemData)
                console.log(item);
            }
            const url = config.url + files.file.filepath
            var data = {
                status: true,
                url: url
            }
            return res.send(data)
        } else {
            return res.status(500).send({
                status: false,
                message: "plese uplaod  a  file"
            });
        }

    } catch (error) {
        console.log(error)
        return res.status(500).send({
            status: false,
            message: error.message || "Somthing  went  wrong !"
        });
    }
}


exports.editProfile = async (req, res) => {
    try {
        var url = !!req.imageUrl ? req.imageUrl : '';
        const profileData = {
            name: req.body.name,
            father_name: req.body.father_name,
            mother_name: req.body.mother_name,
            dob: req.body.dob,
            state: req.body.state,
            city: req.body.city,
            casts: req.body.casts,
            heigth: req.body.heigth,
            gender: req.body.gender,
            phone1: req.body.phone1,
            phone2: req.body.phone2,
            email: req.body.email,
            income: req.body.income,
            occupation: req.body.occupation,
            education: req.body.education,
            siblings: req.body.siblings,
            address1: req.body.address1,
            address2: req.body.address2,
            father_occupations: req.body.father_occupations,
            father_education: req.body.father_education,
            mother_occupations: req.body.occupation,
            mother_education: req.body.mother_education,
            marriage_budget: req.body.marriage_budget,
            password: md5(req.body.password)
        }
        delete req.body.password;
        const updateUser = await User.update(profileData, { where: { id: req.userId } })
        const findItem = await Item.findOne({ where: { id_user: req.userId } })
        if (!!findItem) {
            url = config.url + findItem.name + '.' + findItem.ext
        }
        var data = {
            status: true,
            message: "Users Profile created successfully !",
            data: req.body,
            profileUrl: url
        }
        return res.send(data)

    } catch (error) {
        console.log(error)
        return res.status(500).send({
            status: false,
            message: error.message || "Somthing  went  wrong !"
        });
    }
}
