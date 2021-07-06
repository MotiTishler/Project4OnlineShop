const fs = require('fs')
const pdf = require('pdfkit')

const create = (body) => {
    const { userID, fullName, fullAddress, cartID, items, totalCost, credit } = body
        
    const dir = './receipts'//`./receipts/user${userID}`
    const path = dir + `/receipt${cartID}.pdf`
    const doc = new pdf
    
    try{
        if (!fs.existsSync(dir)) 
            fs.mkdirSync(dir, {recursive:true})
        else if (fs.existsSync(path)) fs.unlinkSync(path)   // <== for dev only!
                                                            // in production: if exists - return

        //create file
        doc.pipe(fs.createWriteStream(path))
        
        // write content
        doc.fontSize(18).text(`Receipt No. ${cartID}`, {
            align:'center'
        })

        doc.moveDown()
        doc.fontSize(12).text(`Customer: ${fullName}, ${fullAddress}`)
        doc.moveDown()
        items.map(item=> doc.fontSize(10).text(`${item.name}${item.supplier? '-'+item.supplier:''} ${item.amount} ${item.cost}ש"ח`) )
        doc.fontSize(12).text(`Total cost: ${totalCost}ש"ח`)

        doc.moveDown()
        doc.text(`payed on credit card ****${credit}`)

        doc.moveDown()
        doc.text(`See you soon`, {
            align:'center'
        })
        // save file
        doc.end()

        //console.log('done')
        return {err:false, msg:'receipt was created sussesfully'}
    }catch(err){
        console.log(err)
        return {err:true, msg:err}
    }
}

module.exports = { create }