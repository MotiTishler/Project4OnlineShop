const mysql = require('mysql')

const conn = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'shopproject'
})
  
conn.connect(err=>{
    if (err){
      console.log('error connecting: ' + err.stack)
      return;
    }
    console.log('DB is connected');
})

//creating a function to run queries async.
const myQuery = (qry)=>{
  return new Promise((resolve, reject)=>{
    conn.query(qry, (err, results)=>{
      if (err){
        reject(err)
      }else{
        resolve(results)
      }
    })
  })
}

//module.exports = conn
module.exports = myQuery