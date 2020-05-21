const express = require('express');
const app = express();

// upload-module
const fs = require('fs');
const upload = require(__dirname + '/upload-module');
// app.post('/try-upload2', upload.single('avatar'), (req, res)=>{
//     console.log(req.file)
//     console.log(req)
//     res.send('ok')
// })
app.post('/try-upload2', upload.single('avatar'), (req, res)=>{
    res.json({
        filename: req.file.filename,
        body: req.body
    });
})

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

// 註冊ejs引擎
app.set('view engine','ejs')
// 設定views路徑
// app.set('views',__dirname+'/../views')

// 新增ejs路由
// app.get('/', (req, res)=>{    
//     res.render('home',{name:'Lemon'})
// });

// top-level middleware
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.get('/try-post-form', (req, res)=>{   // get --> enter
    res.render('try-post-form', {pageTitle:'Lemon'});
})
app.post('/try-post-form', (req, res)=>{  // post --> 重整頁面
    res.locals.pageTitle = '測試表單-Lemon';
    res.json(req.body);
})
app.post('/try-json-post', (req, res)=>{
    req.body.contentType = req.get('Content-Type'); // 取得檔頭
    res.json(req.body);
})


app.get('/', (req, res)=>{
    res.send('express is ready');
});

app.get('/pending', (req, res)=>{
    
});
app.get('/ok', (req, res)=>{
    res.send('ok');
});

// json + ejs
app.get('/json-sales', (req, res)=>{
    const sales = require(__dirname+'/../data/json-sales.json');
    // res.json(sales[2]);
    res.render('json-sales', {
        sales: sales
    });
});

// queryString
app.get('/try-qs', (req, res)=>{
    res.json(req.query);
})

// middleware
// const urlencodedParser = express.urlencoded({extended: false});
// app.post('/try-post', urlencodedParser, (req, res)=>{
//     req.body.haha = 'shin';
//     res.json(req.body);
// })


// try-post-form
// app.get('/try-post-form', (req, res)=>{
//     // res.render('try-post-form');
//     res.json(req.query);
// })
// const urlencodedParser = express.urlencoded({extended: false});
// app.post('/try-post-form', urlencodedParser, (req, res)=>{
//     req.body.haha = 'shin';
//     res.json(req.body);
// })


// 用正規表達式設定路由
// 1
app.get('/my-params1/:action?/:id?', (req, res)=>{
    res.json(req.params)
})
// 2：手機號碼
app.get(/^\/mobile\/09\d{2}-?\d{3}-?\d{3}$/, (req, res)=>{
    let url = req.url.slice(8).split('?')[0];
    url = url.split('-').join('');
    res.send('Mobile: ' + url)
})


// app.use

app.use(express.static('public'));
// app.use('/aaa',express.static('public'));

app.use((req,res)=>{
    res.status(404);
    res.send(`<h2>找不到找不到找不到</h2><img src="https://sites.google.com/site/avatarstarvnage/404_OhMyGod"></img>`);
})

app.listen(3001, ()=>{
    console.log('server started')
})