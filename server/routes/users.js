const router = require('express').Router()
const myQuery = require('../config/db')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

router.post('/register', async (req,res)=>{
    try{

        const { id, fname, lname, username, password, city, address} = req.body
        if (!id || !fname || !lname || !username || !password)
        return res.status(400).json({ err: true, msg: 'missing some info' })
        //check username is unique
        const u = await myQuery(`SELECT * from users where username = '${username}'`)
        if (u.length) return res.status(400).json({err:true, msg:'username already exists'})

        //hash password
        const hash = await bcrypt.hash(password, 10)

        //create query
        const qry = `INSERT INTO users(id, fname, lname, username, password, city, address) VALUES ("${id}", "${fname}", "${lname}", "${username}", "${hash}", "${city}" ,"${address}")`

        await myQuery(qry)
        res.status(201).json({err:false, msg:'user was added successfully'})
    }catch(err){
        console.log(err)
        res.status(500).json({err:true, msg:err})
    }

})


/*
    I use a sequence of middlewares in order to get all needed data of fisrt page:
    login - do the login process
    countProducts - count all available product in the store
    countDeliveries - count all deliveries that were made
    checkNew - check if the user is a new one
    getCart - if user's last cart is open - get it. else (no cart or not open) - create a new cart
*/

const login = async (req, res, next)=>{
    try{
        const {username, password} = req.body
        if (!username || !password)
            return res.status(400).json({ err: true, msg: 'missing some info' })
        
        //get user's data from DB
        const qry = `SELECT * FROM users WHERE username = "${username}"`
        const user = await myQuery(qry)
        if (!user.length) return res.status(400).json({err:true, msg:'no such username'})

        //make sure data is correct
        const correctPWD = await bcrypt.compare(password, user[0].password)        
        if (!correctPWD) return res.status(401).json({err:true, msg:'wrong password'})

        //create token
        const token = jwt.sign({
            ...user[0], // set all data from DB in the token
            password:'My Secret Password? Really?'   //except of the password
        },
        process.env.TOKEN_SECRET,
        {expiresIn:process.env.EXPIRES_IN})
        //{expiresIn:'5m'})

        //return token to user
        //res.status(200).json({err:false, token})
        req.body.token = token
        req.body.user_id = user[0].id
        req.body.is_admin = user[0].is_admin
        req.body.displayName = user[0].fname + ' ' + user[0].lname
        next()

    }catch(err){
        console.log(err)
        res.status(500).json({err:true, msg:err.message})
    }
}

/*
const countProducts = async (req, res, next)=>{

    try{
        //create query
        const qry = `SELECT COUNT(*) as cnt FROM products`

        //execute query         
        const num = await myQuery(qry)
        req.body.num_of_products = num[0].cnt
        next()
    }catch(err){
        console.log(err)
        res.status(500).json({err:true, msg:err})
    }
}

const countDeliveries = async (req, res, next)=>{
    try{
        //create query
        const qry = `SELECT COUNT(*) as cnt FROM deliveries`

        //execute query         
        const num = await myQuery(qry)
        req.body.num_of_deliveries = num[0].cnt
        next()
    }catch(err){
        console.log(err)
        res.status(500).json({err:true, msg:err})
    }
}
*/
const checkNew = async (req, res, next)=>{
    if (req.body.is_admin) return res.status(200).json({
        err:false, 
        token:req.body.token, 
        is_admin:req.body.is_admin,
        //num_of_products: req.body.num_of_products,
        //num_of_deliveries: req.body.num_of_deliveries
    })

    try{
        //create query
        const qry = `SELECT COUNT(*) as cnt FROM carts WHERE user_id = ${req.body.user_id}`

        //execute query         
        const num = await myQuery(qry)
        req.body.is_new = (num[0].cnt == 0)
        if (req.body.is_new) req.body.welcome = `welcome to your first purchase, ${req.body.displayName}`
        next()
    }catch(err){
        console.log(err)
        res.status(500).json({err:true, msg:err})
    }
}

const getCart = async (req, res, next)=>{
    let qry = ""

    try{
        if (!req.body.is_new){
            // get user's last cart
            qry = `
SELECT id, DATE_FORMAT(creation_date, "%d/%m/%Y") as creation_date FROM carts C
JOIN
(SELECT MAX(id) as max_id FROM carts WHERE user_id = ${req.body.user_id}) M
ON C.id = M.max_id`
            const maxID = await myQuery(qry)

            //check if last cart is open
            qry = `SELECT DATE_FORMAT(delivery_date, "%d/%m/%Y") as delivery_date FROM deliveries WHERE cart_id = ${maxID[0].id}`
            const dd = await myQuery(qry)

            req.body.is_open = (dd.length == 0)

            if (dd.length == 0){
                //no delivery for cart = still open
                req.body.welcome = `welcome back ${req.body.displayName}. You have an open cart from ${maxID[0].creation_date}`
                req.body.cartID = maxID[0].id
            }else{
                //cart is closed and has a delivery
                req.body.welcome = `welcome back ${req.body.displayName}. your last purchase was at ${dd[0].delivery_date}`
            }
        }

        if (req.body.is_new || !req.body.is_open){
            //create a new cart
            qry = `INSERT INTO carts(user_id) VALUES (${req.body.user_id})`
            await myQuery(qry)
            qry = `SELECT LAST_INSERT_ID() as id;`
            const newID = await myQuery(qry)
            req.body.cartID = newID[0].id
        }
        next()
    }catch(err){
        console.log(err)
        res.status(500).json({err:true, msg:err})
    }
}

router.post('/login', login, /*countProducts, countDeliveries,*/ checkNew, getCart, async (req,res)=>{
    res.status(200).json({
        err:false,
        token: req.body.token,
        cartID:req.body.cartID,
        displayName: req.body.displayName,
        welcome: req.body.welcome,
        is_admin:req.body.is_admin,
        //num_of_products: req.body.num_of_products,
        //num_of_deliveries: req.body.num_of_deliveries,
        is_open: req.body.is_open
    })
})
/*
router.post('/login', async (req,res)=>{
    try{
        const {username, password} = req.body
        if (!username || !password)
            return res.status(400).json({ err: true, msg: 'missing some info' })
        
        //get user's data from DB
        const qry = `SELECT * FROM users WHERE username = "${username}"`
        const user = await myQuery(qry)
        if (!user.length) return res.status(400).json({err:true, msg:'no such username'})

        //make sure data is correct
        const correctPWD = await bcrypt.compare(password, user[0].password)        
        if (!correctPWD) return res.status(401).json({err:true, msg:'wrong password'})
        
        //create token
        const token = jwt.sign({
            ...user[0], // set all data from DB in the token
            password:'My Secret Password? Really?'   //except of the password
        },
        process.env.TOKEN_SECRET)

        //return token to user
        res.status(200).json({err:false, token})

    }catch(err){
        console.log(err)
        res.status(500).json({err:true, msg:err.message})
    }
})*/



module.exports = router