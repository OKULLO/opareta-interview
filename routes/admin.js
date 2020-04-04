const express = require('express');

const router = express.Router();

const { addAdministrator,getAdminDetail,DeleteAdmin ,getAdmin } = require('../controllers/api');


router
  .route('/')
     .post(addAdministrator)
     .get(getAdmin)
     

router
   .route('/:id')
   .get(getAdminDetail)
   .delete(DeleteAdmin);

module.exports = router;