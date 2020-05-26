const express = require('express');
const app = express();
const session = require('express-session');
const MysqlStore = require('express-mysql-session')(session);
const db = require(__dirname + '/db_connect2');
const multer = require('multer');
const upload = require(__dirname + '/upload-module');
const moment = require('moment-timezone');
const cors = require('cors');
// cors session
const whitelist = [undefined, 'http://localhost:5500', 'http://127.0.0.1:5500', 'http://localhost:63342']
const corsOptions = {
    credentials: true,
    origin: function(origin, cb){
        console.log(origin);
        if(whitelist.indexOf(origin) !== -1){
            cb(null, true);
        } else {
            cb(null, false);
        }
    }
};

// 註冊ejs引擎
app.set('view engine', 'ejs')
// 設定views路徑
app.set('views',__dirname+'/../views')

// cors
app.use(cors(corsOptions));

// cors session
const sessionStore = new MysqlStore({}, db);
app.use(session({
    saveUninitialized: false,
    resave: false,
    secret: 'dolkidf;lalsdfjls',
    store: sessionStore,
    cookie: {
        maxAge: 1200000
    }
}));

// login
// app.use(session({
//     saveUninitialized: false,
//     resave: false,
//     secret: 'dolkidf;lalsdfjls',
//     cookie: {
//         maxAge: 1200000
//     }
// }));
app.use((req, res, next)=>{
    res.locals.sess = req.session || {};
    // res.locals.customData = {
    //     name: 'shin',
    //     action: 'edit'
    // }
    next();
});
app.get('/login', (req, res) => {
    res.render('login');
});

// upload.none()
// 使用multer作為middleware，用來解析multipart-data(Json)
app.post('/login', upload.none(), (req, res) => {

    // 設定帳戶資料
    const users = {
        'shin': {
            pass: '12345',
            nick: '小新'
        },
        'ming': {
            pass: '5678',
            nick: '小明'
        },
    };

    // 設定output輸出結果
    const output = {
        success: false,
        body: req.body
    };

    //判斷帳號是否存在&密碼是否正確
    if (users[req.body.account] && users[req.body.account].pass === req.body.password) {

        // 改變output輸出結果
        output.success = true;
        req.session.user = {
            id: req.body.account,
            nickname: users[req.body.account].nick,
        }
        console.log(req.session)
    }
    output.sess_user = req.session.user;

    res.json(output);
});

app.get('/logout', (req, res)=> {
    delete req.session.user;
    res.redirect('/login');
});

// moment

app.get('/try-moment', (req, res)=> {
    const fm = 'YYYY-MM-DD HH:mm:ss';
    const m1 = moment(new Date());
    const m2 = moment(req.session.cookie.expires);
    const m3 = moment('2019-01-02')

    res.json({
        m1: m1.format(fm),
        m2: m2.format(fm),
        m3: m3.format(fm),
        m1a: m1.tz('Europe/London').format(fm),
        m2a: m2.tz('Europe/London').format(fm),
        m3a: m3.tz('Europe/London').format(fm),
    })

});


// upload-module
// const fs = require('fs');
// const upload = require(__dirname + '/upload-module');
// // app.post('/try-upload2', upload.single('avatar'), (req, res)=>{
// //     console.log(req.file)
// //     console.log(req)
// //     res.send('ok')
// // })
// app.post('/try-upload2', upload.single('avatar'), (req, res)=>{
//     res.json({
//         filename: req.file.filename,
//         body: req.body
//     });
// })

// multer
// https://www.npmjs.com/package/multer
// const multer = require('multer');
// const upload = multer({dest: 'tmp_uploads/'})
// const fs = require('fs');
// app.get('/try-upload', (req, res)=>{
//     res.render('try-upload');
// })
// app.post('/try-upload', upload.single('avatar'), (req, res)=>{
//     const output = {
//         success: false,
//         uploadedImg: '',
//         nickname: '',
//         errorMsg: ''
//     }
//     output.nickname = req.body.nickname || '';
//     if(req.file && req.file.originalname){
//         // https://developer.mozilla.org/zh-TW/docs/Web/HTTP/Basics_of_HTTP/MIME_types
//         switch(req.file.mimetype){
//             case 'image/png':
//             case 'image/jpeg':
//                 fs.rename(req.file.path, './public/img/'+ req.file.originalname, error=>{
//                     if(!error){
//                         output.success = true;
//                         output.uploadedImg = '/img/' + req.file.originalname;
//                     }
//                     res.render('try-upload', output);
//                 })
//                 break;
//             default:
//                 fs.unlink(req.file.path, error=>{
//                     output.errorMsg = '檔案類型錯誤'
//                     res.render('try-upload', output);
//                 })
//         }
//     }
// });

// 新增ejs路由
// app.get('/', (req, res)=>{    
//     res.render('home',{name:'Lemon'})
// });


// session
// app.use(session({
//     saveUninitialized: false,
//     resave: false,
//     secret: 'dolkidf;lalsdfjls',
//     cookie: {
//         maxAge: 1200000
//     }
// }));
app.get('/try-session', (req, res)=>{
    req.session.my_var = req.session.my_var || 0;
    req.session.my_var++;

    res.json({
        my_var: req.session.my_var,
        session: req.session
    })
})


// top-level middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
// next
// app.use((req, res, next) => {
//     res.locals.customData = {
//         name: 'shin',
//         action: 'edit'
//     }
//     next();
// });


app.get('/try-post-form', (req, res) => {   // get --> enter
    res.render('try-post-form', { pageTitle: 'Lemon' });
})
app.post('/try-post-form', (req, res) => {  // post --> 重整頁面
    res.locals.pageTitle = '測試表單-Lemon';
    res.json(req.body);
})
app.post('/try-json-post', (req, res) => {
    req.body.contentType = req.get('Content-Type'); // 取得檔頭
    res.json(req.body);
})


app.get('/', (req, res) => {
    res.send('express is ready');
});

app.get('/pending', (req, res) => {

});
app.get('/ok', (req, res) => {
    res.send('ok');
});

// json + ejs
app.get('/json-sales', (req, res) => {
    const sales = require(__dirname + '/../data/json-sales.json');
    // res.json(sales[2]);
    res.render('json-sales', {
        sales: sales
    });
});

// queryString
app.get('/try-qs', (req, res) => {
    res.json(req.query);
})

// middleware
// const urlencodedParser = express.urlencoded({extended: false});
// const func2 = (req, res)=>{
//     req.body.haha = 'shin';
//     res.json(req.body);
// }
// app.post('/try-post', urlencodedParser, func2)


// try-post-form
// app.get('/try-post-form', (req, res)=>{
//     // res.render('try-post-form');
//     res.json(req.query);
// })
// const urlencodedParser = express.urlencoded({extended: false});
// app.post('/try-post-form', urlencodedParser, func2)


// 用正規表達式設定路由
// 1
app.get('/my-params1/:action?/:id?', (req, res) => {
    res.json(req.params)
})
// 2：手機號碼
app.get(/^\/mobile\/09\d{2}-?\d{3}-?\d{3}$/, (req, res) => {
    let url = req.url.slice(8).split('?')[0];
    url = url.split('-').join('');
    res.send('Mobile: ' + url)
})


// app.use


//模組化
// 1
// const admin2Router = require(__dirname+'/admins/admin2');
// app.use(admin2Router);
// 2
app.use('/my', require(__dirname + '/admins/admin2'));

// address_book
app.use('/address-book', require(__dirname+'/address_book'))

app.use(express.static('public'));
// app.use('/aaa',express.static('public'));

app.use((req, res) => {
    res.status(404);
    res.send(`<h2>找不到找不到找不到</h2><img src="https://sites.google.com/site/avatarstarvnage/404_OhMyGod"></img>`);
})

// app.listen

app.listen(3001, () => {
    console.log('server started')
})