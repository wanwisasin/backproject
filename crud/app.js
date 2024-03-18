const express = require('express');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const path = require('path');

const {getHomePage} = require('./routes/index');
const {addProductPage , addProduct,deleteProduct,editProduct,editProductPage } = require('./routes/product');

const app = express();
const port = 2000;

const db = mysql.createConnection ({
    host: 'localhost',
    user: 'root',
    password: 'Wanwisa123',
    database: 'joyjoy'
});

// connect to database
db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Connected to database');
});
global.db = db;

app.set('port', process.env.PORT || port);
app.set('views', __dirname + '/views'); 
app.set('view engine', 'ejs'); 
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public'))); 
app.use(fileUpload()); 

app.get('/',getHomePage)
app.get('/add',addProductPage);
app.get('/edit/:id',editProductPage);
app.get('/delete/:id',deleteProduct);
app.post('/add',addProduct);
app.post('/edit/:id',editProduct);



app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});