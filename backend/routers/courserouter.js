import express from 'express';
import { addCourse, admin, coursecontroller ,deleteCourse,staffDept, updateSubjectById} from '../controller/coursecontroller.js';

const router=express.Router();

router.route('/subjects').post(coursecontroller);
router.route('/getStaffDept').post(staffDept);
router.route('/admin').get(admin);
router.route('/admin/addCourse').post(addCourse);
router.route('/admin/deleteCourse').delete(deleteCourse);
router.route('/admin/updateCourse').put(updateSubjectById);

export default router;