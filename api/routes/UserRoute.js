const { authJwt, verificationUserName } = require("../middleware");

module.exports = app => {
    const users = require("../controllers/UserController.js")

    //app.post("/api/user/login",users.login);

    // app.post("/api/user/register",[verificationUserName.checkDuplicateUserEmail],users.register);

    // //app.post("/api/login/gmail",users.loginWithGmail);

    // app.post("/api/user/profile/list",[authJwt.verifyToken],[verificationUserName.checkPayment],[verificationUserName.checkStatus],users.listUserProfile);

    // app.post("/api/user/profile/view",[authJwt.verifyToken],[verificationUserName.checkPayment],[verificationUserName.checkStatus],users.viewProfile);

    // app.post("/api/user/delete",[authJwt.verifyToken],[verificationUserName.checkPayment],[verificationUserName.checkStatus],[verificationUserName.checkRole],users.delete);

    // app.post("/api/upload/image",[authJwt.verifyTokenUpdate],users.upload);

    // app.post("/api/user/profile/update",[authJwt.verifyTokenUpdate],users.editProfile);
};

