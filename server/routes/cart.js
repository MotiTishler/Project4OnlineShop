const router = require('express').Router()
const myQuery = require('../config/db') 
const { onlyUsers } = require('../helpers/verifytokens')

const cartIsOpen = async (req, res, next)=>{
    try{
        const {cartID} = req.body   //get cart id from req.body
        const cart_id = cartID || req.params.cartID     //get cart id from req.params
        
        qry = `SELECT delivery_date FROM deliveries WHERE cart_id = ${cart_id}`
        const dd = await myQuery(qry)

        if (dd.length > 0) //cart is closed and has a delivery
            return res.status(400).json({err:true, msg:`cart no. ${cart_id} is closed!`})
        
        //no delivery for cart = still open
        next()
    }catch(err){
        console.log(err)
        res.status(500).json({err:true, msg:err})
    }
}

// - add product to cart (post)
router.post('/new', onlyUsers, cartIsOpen, async (req, res)=>{
    try{
        const { cartID, productID, amount } = req.body
        if (!cartID || !productID || !amount)
        return res.status(400).json({ err: true, msg: 'missing some info' }) 
        
        let qry

        // check if product is already in cart
        const p_i_c = await myQuery(`SELECT * FROM products_in_cart where cart_id = ${cartID} and product_id = ${productID}`)
        if (p_i_c.length)   //product already exists => update
            qry = `
UPDATE products_in_cart
SET amount = amount + ${amount}, cost = cost + ${amount}*(SELECT price FROM products WHERE id = ${productID})
WHERE id = (SELECT id FROM products_in_cart WHERE cart_id = ${cartID} AND product_id = ${productID})`
        else    //product doesn't exists => insert
            qry = `
INSERT INTO products_in_cart(cart_id,product_id,amount,cost) 
SELECT cartID, productID, amount, amount*price FROM
(select ${cartID} as cartID, ${productID} as productID, ${amount} as amount) A
JOIN (select id, price from products ) B
ON A.productID = B.id`
        
        await myQuery(qry)
        res.status(201).json({err:false, msg:'product was added to cart successfully'})
    }catch(err){
        console.log(err)
        res.status(500).json({err:true, msg:err})
    }
})

// - clear cart (delete)
router.put('/:cartID/all', onlyUsers, cartIsOpen, async (req, res)=>{
    try{
        const qry = `DELETE FROM products_in_cart WHERE cart_id = ${req.params.cartID}`
        
        await myQuery(qry)

        res.status(201).json({err:false, msg:'cart is clear'})
    }catch(err){
        res.status(500).json({err:true, msg:err})
    }
})

// - remove product from cart (delete)
router.put('/:cartID/:productID', onlyUsers, cartIsOpen, async (req, res)=>{
    try{
        const qry = `DELETE FROM products_in_cart WHERE cart_id = ${req.params.cartID} and product_id = ${req.params.productID}`
        
        await myQuery(qry)

        res.status(201).json({err:false, msg:'product was removed from cart successfully'})
    }catch(err){
        res.status(500).json({err:true, msg:err})
    }
})

router.get('/:id',  async (req,res)=>{
    try{
        //create query
        const qry = `
SELECT C.id, C.product_id, P.name, P.supplier, C.amount, C.cost, P.image
FROM products_in_cart C
JOIN products P 
ON cart_id = ${req.params.id} AND C.product_id = P.id`

        //execute query         
        const list = await myQuery(qry)
        res.status(200).json({err:false, list})
    }catch(err){
        console.log(err)
        res.status(500).json({err:true, msg:err})
    }
})


module.exports = router