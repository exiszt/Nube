const express = require('express');
const { Router } = express;
const router = Router();
const passport = require('passport');
const { login, loginUser, failLogin, signup, signupUser, failSignup, logoutUser, productsAndChat, failRoute } = require('../controllers/appController');
const checkAuthentication = require('../middlewares/auth');

router.get("", login);
router.get("/", login);
router.post("/login",passport.authenticate('login', { failureRedirect: '/faillogin' }), loginUser);
router.get('/faillogin', failLogin);

router.get('/signup', signup);
router.post('/signup', passport.authenticate('signup', { failureRedirect: '/failsignup' }), signupUser);
router.get('/failsignup', failSignup);

router.get("/logout", logoutUser);

router.get('/productos', checkAuthentication, productsAndChat);

router.get("*", failRoute);

module.exports = router;