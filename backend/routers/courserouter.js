import express from 'express';
import { admin, coursecontroller ,staffDept} from '../controller/coursecontroller.js';

const router=express.Router();

router.route('/subjects').post(coursecontroller);
router.route('/getStaffDept').post(staffDept);
router.route('/admin').get(admin);

export default router;