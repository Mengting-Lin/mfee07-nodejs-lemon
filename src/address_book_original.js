// const express = require('express');
// const db = require(__dirname + '/db_connect2');

// const router = express.Router();

// router.get('/list', (req, res)=>{
//     res.send('ok')
// })

// module.exports = router;

const express = require('express');
const moment = require('moment-timezone');
const db = require(__dirname + '/db_connect2');

const router = express.Router();


router.get('/', (req, res)=>{
    res.redirect(req.baseUrl + '/list');
});
router.get('/list/:page?', (req, res)=>{
    const perPage = 5;
    let page = parseInt(req.params.page) || 1;

    const output = {
        // page: page,
        perPage: perPage,
        totalRows: 0, // 總共有幾筆資料
        totalPages: 0, //總共有幾頁
        rows: []
    }
    db.query("SELECT COUNT(1) num FROM address_book")
        .then(([r])=>{
            output.totalRows = r[0].num;
            output.totalPages = Math.ceil(output.totalRows/perPage);
            if(page < 1) page=1;
            if(page > output.totalPages) page=output.totalPages;
            if( output.totalPages===0) page=0;
            output.page = page;
            if(! output.page){
                return [null];
            } else {
                const sql = `SELECT * FROM address_book LIMIT ${(page-1)*perPage}, ${perPage}`
                return db.query(sql)
            }
        })
        .then(([r])=>{
            if(r) output.rows = r;
            // res.json(output);
            res.render('address_book/list', output);
        })
        .catch(error=>console.log(error))

})

    // db.query("SELECT * FROM address_book LIMIT 10")
    //     .then(([rows])=>{
    //         res.render('address-book/list', { rows });
    //     })

module.exports = router;

// 日期格式
// router.get('/list', (req, res)=>{
//     //moment
//     const fm = 'YYYY-MM-DD';
//
//     db.query("SELECT * FROM address_book")
//         // 將資料庫抓取的資料放入result回傳
//         // json格式
//         .then(([results, fields])=>{
//             console.log(typeof(results[1]['birthday']));
//             console.log(moment(results[1]['birthday']).format(fm));
//             res.json(results);
//         })
//         // address-book/list頁面
//         // .then(([rows])=>{
//         //     res.render('address_book/list', { rows });
//         // })
// })
