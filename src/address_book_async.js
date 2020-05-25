const express = require('express');
const db = require(__dirname + '/db_connect2');

const router = express.Router();

router.get('/', (req, res)=>{
    res.redirect(req.baseUrl + '/list');
});
router.get('/list/:page?', async (req, res)=>{
    const perPage = 5;
    let page = parseInt(req.params.page) || 1;

    const output = {
        // page: page,
        perPage: perPage,
        totalRows: 0, // 總共有幾筆資料
        totalPages: 0, //總共有幾頁
        rows: []
    }
    const [r1] = await db.query("SELECT COUNT(1) num FROM address_book");
    output.totalRows = r1[0].num;
    output.totalPages = Math.ceil(output.totalRows/perPage);
    if(page < 1) page=1;
    if(page > output.totalPages) page=output.totalPages;
    if( output.totalPages===0) page=0;
    output.page = page;

    if(! output.page){
        return res.json(output);
    }

    const sql = `SELECT * FROM address_book LIMIT ${(page-1)*perPage}, ${perPage}`
    const [r2] = await db.query(sql);
    if(r2) output.rows = r2;
    //res.json(output);
    res.render('address-book/list', output);


    // db.query("SELECT * FROM address_book LIMIT 10")
    //     .then(([rows])=>{
    //         res.render('address-book/list', { rows });
    //     })
})

module.exports = router;