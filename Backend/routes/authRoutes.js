const express=require('express');
const {body}=require('express-validator');
const {register,login}=require('../controllers/authController');
const r=express.Router();
r.post('/register',[body('name').trim().notEmpty(),body('email').isEmail(),body('password').isLength({min:6}),body('department').trim().notEmpty(),body('studentId').trim().notEmpty(),body('year').trim().notEmpty()],register);
r.post('/login',[body('email').isEmail(),body('password').notEmpty()],login);
module.exports=r;
