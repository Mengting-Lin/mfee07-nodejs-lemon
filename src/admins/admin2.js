const express = require('express');
const router = express.Router();

// router.get('/admin2/:p1?/:p2?', (req,res)=>{
//     res.json(req.params);
// });

router.get('/admin2/:action?/:id?', (req, res)=>{
    const output = {
        // 擴展運算符
        ...req.params,
        url: req.url,
        baseUrl: req.baseUrl,
        locals: res.locals
    }
    res.json(output);
});

module.exports = router;