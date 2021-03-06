const express = require('express');

const rp = require('request-promise');


const router = express.Router();


// get fiat currencies

router
  .get('/get_currency',async(req, res, next)=>{

   try {


      const requestOptions = {
        method: 'GET',
        uri: 'https://pro-api.coinmarketcap.com/v1/fiat/map',
        qs: {
          'start': '1',
          'limit': '5',
          'sort': 'id'
        },
        headers: {
          'X-CMC_PRO_API_KEY': process.env.API_KEY
        },
        json: true,
        gzip: true
      };

      await rp(requestOptions).then(response => {
        return res.status(200).json({
          data:response.data
        })
      })
      .then(data=>{}).catch((err) => {
        console.log('API call error:', err.message);
      });

  } catch (error) {
    next(error)
  }

  })

  //get crypto currencies

  router
  .get('/crypto',async(req, res, next)=>{

   try {


      const requestOptions = {
        method: 'GET',
        uri: 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/map',
        qs: {
          'listing_status': 'active',
          'limit': '5',
          'sort': 'id'
        },
        headers: {
          'X-CMC_PRO_API_KEY': process.env.API_KEY
        },
        json: true,
        gzip: true
      };

      await rp(requestOptions).then(response => {

        return res.status(200).json({
          data:response.data
        })
      })
      .then(data=>{}).catch((err) => {
        console.log('API call error:', err.message);
      });

  } catch (error) {
    next(error)
  }

  })

  //--------------------------convert between currencies
  router.get('/convert',async(req, res, next)=>{
      try {
      console.log(req.query)

      const requestOptions = {

        method: 'GET',
        uri: 'https://pro-api.coinmarketcap.com/v1/tools/price-conversion',
        qs: {
          'amount':req.query.amount,
          'id': req.query.id,
          'convert':req.query.convert
        },

        headers: {
          'X-CMC_PRO_API_KEY': process.env.API_KEY
        },
        json: true,
        gzip: true
      };

      await rp(requestOptions).then(response => {
        // console.log(response.data)
        return res.status(200).json({
          data:response.data
        })
      })
      .then(data=>{}).catch((err) => {
        console.log('API call error:', err.message);
      });

  } catch (error) {
    next(error)
  }
  })

     

module.exports = router;