const express = require('express');
const hbs = require('express-handlebars');
const app = express();
const path = require('path');
const db = require('./db/connection');

app.use(express.urlencoded({
    extended: false
}));

app.engine('hbs', hbs({
    extname: 'hbs',
    defaultLayout: 'layout',
    layoutsDir: __dirname + '/views/template'
}));

app.set('views', path.join(__dirname, '/views/'));

app.set('view engine', 'hbs');

app.use('/static', express.static('public'));
app.use('/static/css', express.static( path.join( __dirname, 'node_modules/bootstrap/dist/css') ) );
app.use('/static/js', express.static( path.join( __dirname, 'node_modules/bootstrap/dist/js') ) );

//Controlleris vedantis index puslapi

app.get('/', (req, res) => {
    //res.render('add-company');
    res.send('Titulinis');
});

app.get('/add-company', (req, res) => {
    res.render('add-company');
});

app.post('/add-company', (req, res) => {

    let companyName     = req.body.name;
    let companyAddress  = req.body.address;

    db.query(`SELECT * FROM companies WHERE name = '${companyName}'`, (err, resp) => {

        if(resp.length == 0) {
            
            db.query(`INSERT INTO companies (name, address) 
                    VALUES ( '${companyName}' , '${companyAddress}' )`
            , err => {
                if(err) {
                    console.log(err);
                    return;
                }

                res.redirect('/list-companies/?m=Sėkmingai pridėjote įrašą');
            });

        } else {
            res.redirect('/list-companies/?m=Toks įrašas jau egzistuoja');
        }

    });

});

app.get('/list-companies', (req, res) => {

    let messages = req.query.m;

    db.query(`SELECT * FROM companies`, (err, resp) => {
        
        if(!err) {
            res.render('list-companies', {companies: resp, messages});
        }

    });

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