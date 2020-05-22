// const express = require('express');
// const db = require(__dirname + '/db_connect2');

// const router = express.Router();

// router.get('/list', (req, res)=>{
//     res.send('ok')
// })

// module.exports = router;

const express = require('express');
const db = require(__dirname + '/db_connect2');
const moment = require('moment-timezone');

const router = express.Router();

router.get('/list', (req, res)=>{
    //moment
    const fm = 'YYYY-MM-DD';    

    db.query("SELECT * FROM address_book")
        // 將資料庫抓取的資料放入result回傳
        // json格式
        .then(([results, fields])=>{
            console.log(typeof(results[1]['birthday']));
            console.log(moment(results[1]['birthday']).format(fm));            
            res.json(results);
        })
        // address-book/list頁面
        // .then(([rows])=>{
        //     res.render('address_book/list', { rows });
        // })
})

module.exports = router;