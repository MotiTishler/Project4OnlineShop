const router = require('express').Router()
const myQuery = require('../config/db') 
const { onlyAdmins } = require('../helpers/verifytokens')


// - get product by category
router.get('/category/:id', async (req, res)=>{
    try{
        //create query
        const qry = `SELECT * FROM products WHERE cat_id = ${req.params.id}`

        //execute query         
        const list = await myQuery(qry)
        
        res.status(200).json({err:false, list})
    }catch(err){
        console.log(err)
        res.status(500).json({err:true, msg:err})
    }
})
// - get product by name (part of the name)
router.get('/search/:product', async (req, res)=>{
    try{
        //create query
        const qry = `SELECT * FROM products WHERE name LIKE '%${req.params.product}%'`

        //execute query         
        const list = await myQuery(qry)
        
        res.status(200).json({err:false, list})
    }catch(err){
        console.log(err)
        res.status(500).json({err:true, msg:err})
    }
})

// - add product
router.post('/new', onlyAdmins, async (req, res)=>{
    try{
        const { productName, supplier, catID, price, unit, image_path} = req.body
        if (!productName || !catID || !price)
        return res.status(400).json({ err: true, msg: 'missing some info' }) 
        //check if product exists
        let qry = `SELECT * FROM products WHERE name = '${productName} AND cat_id = ${catID}'`
        if (supplier) qry += ` AND supplier = '${supplier}'`
        const p = await myQuery(qry)
        if (p.length) return res.status(400).json({err:true, msg:'product already exists'})
        
        //the query
        qry = `INSERT INTO products(name, ${supplier? 'supplier, ':''}cat_id, price${unit? ', unit':''}${image_path? ', image':''}) VALUES ('${productName}', ${supplier? "'"+supplier+"', ":''}${catID}, ${price}${unit? ", '"+unit+"'":''}${image_path? ", '"+image_path+"'":''})`
        await myQuery(qry)
        res.status(201).json({err:false, msg:'product was added successfully'})
    }catch(err){
        console.log(err)
        res.status(500).json({err:true, msg:err})
    }
})
// - edit product
router.put('/edit', onlyAdmins, async (req, res)=>{
    try{
        const { productID, productName, supplier, catID, price, unit, image_path} = req.body
        if (!productID || !productName || !catID || !price)
        return res.status(400).json({ err: true, msg: 'missing some info' }) 
        
        //the query
        let qry = `UPDATE products SET name = '${productName}', cat_id = ${catID}, price = ${price}`
        if (unit) qry += `, unit = '${unit}'`
        if (supplier) qry += `, supplier = '${supplier}'`
        if (image_path) qry += `, image = '${image_path}'`
        qry += ` WHERE id = ${productID}`
        await myQuery(qry)
        res.status(201).json({err:false, msg:'product was edited successfully'})
    }catch(err){
        console.log(err)
        res.status(500).json({err:true, msg:err})
    }
})

router.get('/image', async (req,res)=>{
    try{
        //create query
        const qry = `
SELECT P.image FROM products P
JOIN (SELECT 1+FLOOR(RAND() * ( SELECT MAX(id) FROM  products)) AS id) M
ON P.id = M.id
LIMIT 1`

        //execute query         
        const ans = await myQuery(qry)
        
        res.status(200).json({err:false, image:ans[0].image})
    }catch(err){
        console.log(err)
        res.status(500).json({err:true, msg:err})
    }
})
module.exports = router