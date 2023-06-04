const express =  require('express');
const productController = require('../controller/productCtrl');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');
const router = express.Router();


router.get('/allproducts',productController.getallProducts);
router.post('/create-product',authMiddleware,isAdmin,productController.createProduct);
router.get('/:id',productController.getaProduct);
router.put('/:id',authMiddleware,isAdmin,productController.updateProduct);
router.delete('/:id',authMiddleware,isAdmin,productController.deleteProduct);



module.exports = router;