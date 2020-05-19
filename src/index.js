const express = require('express');

const app = express();

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
    res.render('try-post-form');
})
app.post('/try-post-form', (req, res)=>{  // post --> 重整頁面
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