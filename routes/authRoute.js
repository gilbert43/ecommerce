const express =  require('express');
const userController = require('../controller/userCtrl');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/register',userController.createUser);
router.put('/password',authMiddleware,userController.updatePassword);
router.post('/forgot-password-token',userController.forgotPasswordToken);
router.put('/reset-password/:token',userController.resetPassword);
router.post('/login',userController.loginUserCtrl);
router.get('/allusers',userController.getallUsers);
router.get('/refresh',userController.handleRefreshToken);
router.get('/:id',authMiddleware,isAdmin,userController.getaUser);
router.get('/logout',userController.logout);
router.delete('/:id',userController.deleteaUser);
router.put('/edit-user',authMiddleware,userController.updateaUser);
router.put('/block-user/:id',authMiddleware,isAdmin,userController.blockUser);
router.put('/unblock-user/:id',authMiddleware,isAdmin,userController.unblockUser);





module.exports = router;