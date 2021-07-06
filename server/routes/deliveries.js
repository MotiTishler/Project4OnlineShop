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

const canDeliverToday = async (req, res, next)=>{
    try{
        const {dd} = req.body   //get delivery date id from req.body
        const deliveryDate = dd//? new Date(dd) : new Date() // no delivery date - use default = today 
        qry = `SELECT COUNT (*) as cnt FROM deliveries WHERE delivery_date = '${deliveryDate.split('T')[0]}'`
//console.log(qry)
        const cnt = await myQuery(qry)
        
        if (cnt[0].cnt >= require('../config/config').maxDeliveriesForDate) //max deliveries for date
            return res.status(400).json({err:true, msg:`no more deliveries for ${deliveryDate.split('T')[0]}`})
        
        if (!dd) req.body.dd = deliveryDate
        next()
    }catch(err){
        console.log(err)
        res.status(500).json({err:true, msg:err})
    }
}

router.post('/new', onlyUsers, cartIsOpen, canDeliverToday, async (req, res)=>{
    try{
        const { cartID, city, address, dd, credit} = req.body
        if (!cartID || !city || !credit || !dd)
        return res.status(400).json({ err: true, msg: 'missing some info' }) 

        const deliveryDate = dd //|| new Date()
        
        //the query
        const qry = `
INSERT INTO deliveries(cart_id, total_cost, delivery_city, delivery_address, delivery_date, credit)
SELECT A.cartID, B.total, A.city, A.address, A.dt, A.credit FROM 
(SELECT ${cartID} as cartID, '${city}' as city, ${address? "'" + address + "'":"' '"} as address, '${deliveryDate.split('T')[0]}' as dt, '${credit}' as credit)A
JOIN 
(SELECT cart_id, sum(cost) as total FROM products_in_cart WHERE cart_id = ${cartID})B
ON A.cartID = B.cart_id`

        await myQuery(qry)
        res.status(201).json({err:false, msg:'delivery was added successfully'})
    }catch(err){
        console.log(err)
        res.status(500).json({err:true, msg:err})
    }
})

router.get('/dates', async (req, res)=>{
    try{
        //create query
        const qry = `
SELECT delivery_date, cnt, (cnt>=${require('../config/config').maxDeliveriesForDate}) as closed FROM (
    SELECT delivery_date , COUNT(id) as cnt
    FROM deliveries
    WHERE delivery_date>=date_add(now(), INTERVAL -1 day)
    GROUP BY delivery_date
)A`

        //execute query         
        const list = await myQuery(qry)
        res.status(200).json({err:false, list})
    }catch(err){
        console.log(err)
        res.status(500).json({err:true, msg:err})
    }
})

module.exports = router