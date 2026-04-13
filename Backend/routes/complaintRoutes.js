const express=require('express');
const {body}=require('express-validator');
const {createComplaint,listMyComplaints,getMyComplaintById}=require('../controllers/complaintController');
const {protect}=require('../middleware/authMiddleware');
const {authorizeRoles}=require('../middleware/roleMiddleware');
const upload=require('../middleware/uploadMiddleware');
const r=express.Router();
r.use(protect,authorizeRoles('student'));
r.post(
  '/',
  upload.single('attachment'),
  [
    body('title').trim().isLength({ min: 10, max: 100 }).withMessage('Title must be between 10 and 100 characters'),
    body('description').trim().isLength({ min: 20, max: 500 }).withMessage('Description must be between 20 and 500 characters'),
    body('category').trim().notEmpty().withMessage('Category is required'),
    body('priority').isIn(['Low', 'Medium']).withMessage('Priority must be Low or Medium'),
  ],
  createComplaint
);
r.get('/mine',listMyComplaints);
r.get('/:id',getMyComplaintById);
module.exports=r;
