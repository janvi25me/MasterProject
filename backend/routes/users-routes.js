import express from 'express' 
import { getAllUsers, signUp, login } from '../controllers/users-controllers.js'
import { check } from 'express-validator'
import fileUpload from '../middleware/file-upload.js'


const router = express.Router()

router.get('/', getAllUsers)

router.post('/signup',
    fileUpload.single('image') ,
    [
    check('name').not().isEmpty(),
    check('email').normalizeEmail().isEmail(),
    check('password').isLength({min: 6})
],signUp)

router.post('/login', login)

export default router