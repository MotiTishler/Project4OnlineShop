//imports
const express = require('express')

const cors = require('cors')
const dotenv = require('dotenv')
const { onlyUsers } = require('./helpers/verifytokens')

//setup
const app = express()
dotenv.config()

//MWs
app.use(cors())
app.use(express.json())


app.use('/users', require('./routes/users'))
app.use('/products', require('./routes/products'))
app.use('/cart', require('./routes/cart'))
app.use('/deliveries', require('./routes/deliveries'))
app.use('/receipts', express.static('receipts'))

//base routes
const myQuery = require('./config/db')
app.get('/stat', async (req, res)=>{
    try{
        let qry = ""
        //create query
        qry = `SELECT COUNT(*) as cnt FROM products`
        const num = await myQuery(qry)
        
        qry = `SELECT COUNT(*) as cnt FROM deliveries`
        const del = await myQuery(qry)
        res.status(200).json({err:false, num_of_products:num[0].cnt, num_of_deliveries:del[0].cnt})
    }catch(err){
        console.log(err)
        res.status(500).json({err:true, msg:err.message})
    }
})

app.get('/cats', async (req, res)=>{
    try{
        
        //create query
        const qry = `SELECT * FROM categories`
        const list = await myQuery(qry)
        res.status(200).json({err:false, list})
    }catch(err){
        console.log(err)
        res.status(500).json({err:true, msg:err.message})
    }
})

app.post('/receipt', onlyUsers, (req, res)=>{
    const create = require('./helpers/receiptcreator').create

    try{
        const { userID, fullName, fullAddress, cartID, items, totalCost, credit } = req.body
        if (!userID || !fullName || !fullAddress || !cartID || !items || !totalCost || !credit)
        return res.status(400).json({ err: true, msg: 'missing some info' })

        const created = create(req.body)

        res.status(created.err? 500:200).json(created)
    }catch(err){
        console.log(err)
        res.status(500).json({err:true, msg:err.message})
    }
         
})

app.post('/download/:userID/:recID', (req, res)=>{
    const userID = req.params.userID
    const receiptID = req.params.recID
    const receiptFile = `./receipts/receipt${receiptID}.pdf`

    res.download(receiptFile, `receipt${receiptID}.pdf`, err=>{
        if (err){
            res.status(500).json({err:true, msg:err})
        }
    })
    //res.status(200).json({err:false, msg:'file was downloaded'})
})

//listen
app.listen(1000, ()=>console.log('server is running on port 1000'))