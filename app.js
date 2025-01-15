const express = require('express')
const app = express()
const mysql = require('mysql')
// config 
app.set('view engine', 'ejs')
// app.set('views', path.join(__dirname, 'views'))
// database connexion
const connection = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : 'root',
    database : 'cars_db'
})

connection.connect((err)=>{
    if(err) throw err
    console.log('database connected')
})


// routes
app.get('/cars' , (req, res)=>{
       connection.query("SELECT * FROM cars", (err, result)=>{
        if(err) throw err
        console.log(result)
        res.render('car-list', {
            cars:result,
            title: 'la liste des vehicules'
        })
       })
})
app.get('/car-show/:id' , (req, res)=>{
       connection.query(`SELECT * FROM cars WHERE id=${req.params.id}`, (err, result)=>{
        if(err) throw err
        console.log(result)
        res.render('car-show', {
            car:result[0],
            title: 'detail du  vehicule ' + result[0].model
        })
       })
})


app.listen(3000, ()=>{
    console.log('listening http://localhost:3000')
})