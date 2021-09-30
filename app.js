const express = require('express');
const hbs = require('express-handlebars');
const app = express();
const mysql = require('mysql');
const path = require('path');

//Prisijungimo prie Mysql generavimas
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'clients'
});

//Prisijungimo paleidimas ir callback'as
db.connect(err => {
    if(err) {
        console.log('Nepavyko prisijungti prie Mysql duomenų bazės');

        return;
    }

    console.log('Sėkmingai prisijungėme prie Mysql duomenų bazės');
});

app.engine('hbs', hbs({
    extname: 'hbs',
    defaultLayout: 'layout',
    layoutsDir: __dirname + '/views/template'
}));

app.set('views', path.join(__dirname, '/views/'));

app.set('view engine', 'hbs');

//Controlleris vedantis index puslapi

app.get('/', (req, res) => {
    res.render('add-company');
});

app.listen('3000');

// //Priskirti naudojama duomenu baze
// // db.query('USE myblog', (err, res) => {
// //     if(err)
// //         console.log(err);
    
// //     console.log(res);
// // });

// //Parodo visas duomenu bazes
// // db.query('SHOW DATABASES', (err, res) => {
// //     if(err)
// //         console.log(err);
    
// //     console.log(res);
// // });

// //Jeigu norime istrinti lentele
// //db.query(`DROP TABLE IF EXISTS irasai`);

// db.query(
//         `CREATE TABLE IF NOT EXISTS irasai(
//          id int(9) NOT NULL AUTO_INCREMENT,
//          pavadinimas varchar(256),
//          turinys text,
//          PRIMARY KEY (id)
//         ) AUTO_INCREMENT = 1 DEFAULT CHARSET=utf8`
//         , (err, res) => {
//     if(err)
//         console.log(err);
    
//     console.log(res);
// });
 
// db.query(`INSERT INTO irasai(pavadinimas, turinys) VALUES('test', 'test')`);