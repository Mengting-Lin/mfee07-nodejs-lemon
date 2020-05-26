const express = require('express');                     // express
const moment = require('moment-timezone');              // 日期格式
const upload = require(__dirname + '/upload-module');   // multer
const db = require(__dirname + '/db_connect2');         // 資料庫連線

const router = express.Router();                        // router ??

// 擋住無確實登入者動到通訊錄
router.use((req, res, next)=>{
    const white = ['list', 'login', 'list2', 'api'];
    let u = req.url.split('/')[1];
    u = u.split('?')[0];

    if(!req.session.admin){
        if(white.indexOf(u) !==-1){
            next();
        } else {
            res.status(403).send('叫你滾就滾~');
        }
    } else {
        next();
    }
});

// 根目錄
router.get('/', (req, res)=>{
    res.redirect(req.baseUrl + '/list');
});

// 登入頁面
router.get('/login', (req, res)=>{
    if(req.session.admin){
        res.redirect('/address-book/list');
    } else {
        res.render('address_book/login');
    }
});
router.post('/login', upload.none(), (req, res)=>{
    const output = {
        body: req.body,
        success: false
    }
    //res.render('address-book/login');
    const sql = "SELECT `sid`, `account` FROM admins WHERE account=? AND password=SHA1(?)";
    db.query(sql, [req.body.account, req.body.password])
        .then(([r])=>{
            if(r && r.length){
                req.session.admin = r[0];  // r[0]= `sid`, `account`
                output.success = true;
            }
            res.json(output);
        })

    //res.json(req.body);
});

// 登出頁面

router.get('/logout', (req, res)=>{
    delete req.session.admin;
    res.redirect('/address-book/list');
});


// 刪除資料頁面
router.get('/del/:sid', (req, res)=>{
    let referer = req.get('Referer'); // 從哪裡來
    const sql = "DELETE FROM `address_book` WHERE sid=?";    //delete-->get
    // 查詢：query(sql語法,func())
    // query似同promise，搭配then
    db.query(sql, [req.params.sid])   // [req.params.sid]對應上方?
        .then(([r])=>{
            if(referer){
                // 刪除後，回到該筆資料頁面
                res.redirect(referer)
            } else {
                res.redirect('/address-book/list')
            }
        })
})

//編輯資料頁面
// * 愈嚴謹的路由應放置於上方 ( /edit/:sid > /edit )
router.get('/edit/:sid', (req, res)=>{
    const sql = "SELECT * FROM address_book WHERE sid=?";
    db.query(sql, [req.params.sid])
        .then(([r])=>{
            if(r && r.length){                                                   // r.length-->資料不得為null
                console.log(r);                
                r[0].birthday = moment(r[0].birthday).format('YYYY-MM-DD');      // 調整日期格式
                res.render('address_book/edit', r[0])                            // 渲染頁面
            } else {
                res.redirect('/address_book/list')
            }
        })
})

// multipart-formdata使用multer解析資料
router.post('/edit', upload.none(), (req, res)=>{
    const output = {
        success: false,
        body: req.body
    }
    // console.log(req.body);
    
    let sid = parseInt(req.body.sid);
    if(! sid){                          // 如果資料不存在
        output.error = '沒有資料';       // 將error塞入output中
        return res.json(output);        // 將output以json格式回傳給瀏覽器
    }
    const sql = "UPDATE `address_book` SET ? WHERE sid=?";
    delete req.body.sid;
    db.query(sql, [req.body, sid])
        .then(([r])=>{
            output.results = r;
            if(r.affectedRows && r.changedRows){
                output.success = true;
            }
            res.json(output);
        })
})

//新增資料頁面
router.get('/add', (req, res)=>{
    res.render('address_book/add');
})
router.post('/add', upload.none(), (req, res)=>{
    const output = {
        success: false
    }
    // TODO: 檢查欄位

    const sql = "INSERT INTO address_book set ?, created_at=NOW()";
    //req.body.created_at = new Date();

    db.query(sql, [req.body])
        .then(([r])=>{
            output.results = r;
            if(r.affectedRows && r.insertId){
                output.success = true;
            }
            res.json(output);
        })
    //res.json(req.body);
})

const getDataList = async (req)=>{
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
        return output;
    }
    const sql = `SELECT * FROM address_book ORDER BY sid DESC LIMIT ${(page-1)*perPage}, ${perPage}`
    const [r2] = await db.query(sql);
    if(r2) output.rows = r2;
    for(let i of r2){
        i.birthday = moment(i.birthday).format('YYYY-MM-DD');
    }
    return output;
};


router.get('/list/:page?', async (req, res)=>{
    const output = await getDataList(req);
    if(req.session.admin)
        res.render('address_book/list', output);
    else
        res.render('address_book/list-no-admin', output);
})

router.get('/list2', async (req, res)=>{
    res.render('address_book/list2');
})

router.get('/api/list/:page?', async (req, res)=>{
    const output = await getDataList(req);
    res.json(output);
})

module.exports = router;