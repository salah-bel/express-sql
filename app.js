const express = require('express')
const app = express()
const mysql = require('mysql')
const bodyParser = require('body-parser')
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

// middlewares
app.use(bodyParser.urlencoded({extended: true}))
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
// ajouter un vehicule
app.get('/add-car', (req, res)=>{ // localhost:3000/add-car [GET]
    res.render('add-car', {
        heading: "Ajouter un vehicule"
    })
})
app.post('/add-car', (req, res)=>{
    const {model, year,  image} = req.body
    connection.query(`INSERT INTO cars (model, year, image) VALUES ('${model}', '${year}', '${image}')`, (err)=>{
        if(err) throw err
        res.redirect('/cars')
    }) 
       
          
})
 
// update car 
app.get('/update-car/:id', (req, res)=>{
    const id = req.params.id
    connection.query(`SELECT * FROM cars WHERE id =${id}`, (err, result)=>{
        if(err) throw err
        res.render('update-car', {
            heading: "Modifier un vehicule",
            car: result[0]
        })
    })
})
app.post('/update-car', (req, res)=>{
    const {model, image, year , id} = req.body
    connection.query(`UPDATE cars SET model = '${model}' , image = '${image}' , year = '${year}' WHERE id = ${id} `, (err, result)=>{
        if(err) throw err
        console.log(result)
        res.redirect('/car-show/'+id)
})
})

// delete car 
app.post('/delete-car' , (req, res)=>{
    const id = req.body.id
    connection.query(`DELETE FROM cars WHERE id = ${id}`, (err)=>{
        if(err) throw err
        res.redirect('/cars')
    })
})
// app.get('/delete-car/:id' , (req, res)=>{
//     const id = req.params.id
//     connection.query(`DELETE FROM cars WHERE id = ${id}`, (err)=>{
//         if(err) throw err
//         res.redirect('/cars')
//     })
// })

// servercls
app.listen(3000, ()=>{
    console.log('listening http://localhost:3000')
})