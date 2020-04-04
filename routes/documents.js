const express = require('express')

const router = express.Router()

const { getDocument, addDocument, DeleteDocument,getSingleDocument,editDocument,forwarddoc } = require('../controllers/api');

/*
get products rouets
*/
router.
   route('/')
   .get(getDocument)
   .post(addDocument)
 
router
   .route('/:id')
   .delete(DeleteDocument)
   .get(getSingleDocument)
   
  

router
     .route('/edit/:id')
     .patch(editDocument)

router
     .route('/forward/:id')
     .patch(forwarddoc)




     


module.exports = router;