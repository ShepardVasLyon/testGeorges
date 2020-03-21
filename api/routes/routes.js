'use strict';
module.exports = (app) => {
    var userCtrl = require('../controllers/userController');
    var promoCtrl = require('../controllers/promoController');
    
    // User routes
    app.route('/user')
        .post(userCtrl.createUser)

    app.route('/login')
        .put(userCtrl.loginUser)

    app.route('/promo')
        .post(promoCtrl.createCode)
        .put(promoCtrl.validateCode)

};
