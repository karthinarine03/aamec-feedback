import express from 'express';
import { addCourse, admin, coursecontroller ,staffDept} from '../controller/coursecontroller.js';

const router=express.Router();

router.route('/subjects').post(coursecontroller);
router.route('/getStaffDept').post(staffDept);
router.route('/admin').post(admin);
router.route('/admin/addCourse').post(addCourse);

export default router;