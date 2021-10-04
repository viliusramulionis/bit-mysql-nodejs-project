const express = require('express');
const hbs = require('express-handlebars');
const app = express();
const path = require('path');
const db = require('./db/connection');
const validator = require('validator');

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

app.use('/static', express.static('static'));
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

    if(!validator.isAlphanumeric(companyName, 'en-US', {ignore: ' .ąĄčČęĘėĖįĮšŠųŲūŪ'}) 
        || !validator.isLength(companyName, {min: 3, max: 50})) {
        res.redirect('/list-companies/?m=Įveskite kompanijos pavadinimą&s=danger'); 
        return;
    }

    if(!validator.isAlphanumeric(companyAddress, 'en-US', {ignore: ' .ąĄčČęĘėĖįĮšŠųŲūŪ'}) 
        || !validator.isLength(companyAddress, {min: 3, max: 100})) { 
        res.redirect('/list-companies/?m=Įveskite kompanijos adresą&s=danger'); 
        return;
    }

    db.query(`SELECT * FROM companies WHERE name = '${companyName}'`, (err, resp) => {

        if(err) {
            res.redirect('/list-companies/?m=Įvyko klaida&s=danger');
            return;
        }

        if(resp.length == 0) {
            
            db.query(`INSERT INTO companies (name, address) 
                    VALUES ( '${companyName}' , '${companyAddress}' )`
            , err => {
                if(err) {
                    console.log(err);
                    return;
                }

                res.redirect('/list-companies/?m=Sėkmingai pridėjote įrašą&s=success');
            });

        } else {
            res.redirect('/list-companies/?m=Toks įrašas jau egzistuoja&s=warning');
        }

    });

});

app.get('/list-companies', (req, res) => {

    let messages = req.query.m;
    let status = req.query.s;

    db.query(`SELECT * FROM companies`, (err, resp) => {
        
        if(!err) {
            res.render('list-companies', {companies: resp, messages, status});
        }

    });

});

app.get('/edit-company/:id', (req, res) => {

    let id          = req.params.id;
    let messages    = req.query.m;
    let status      = req.query.s;

    db.query(`SELECT * FROM companies WHERE id = ${id}`, (err, resp) => {
        
        if(!err) {
            res.render('edit-company', {company: resp[0], messages, status});
        }

    });
});

app.post('/edit-company/:id', (req, res) => {

    let id              = req.params.id;
    let companyName     = req.body.name;
    let companyAddress  = req.body.address;

    if(!validator.isAlphanumeric(companyName, 'en-US', {ignore: ' .ąĄčČęĘėĖįĮšŠųŲūŪ'}) 
        || !validator.isLength(companyName, {min: 3, max: 50})) {
        res.redirect('/edit-company/' + id +'/?m=Įveskite kompanijos pavadinimą&s=danger'); 
        return;
    }

    if(!validator.isAlphanumeric(companyAddress, 'en-US', {ignore: ' .ąĄčČęĘėĖįĮšŠųŲūŪ'}) 
        || !validator.isLength(companyAddress, {min: 3, max: 100})) { 
        res.redirect('/edit-company/' + id +'/?m=Įveskite kompanijos adresą&s=danger'); 
        return;
    }

    db.query(`SELECT COUNT(*) kiekis FROM companies WHERE name = '${companyName}' AND id != ${id}`, (err, dbresp) => {
    
        if(!err) {

            if(dbresp[0].kiekis == 0) {

                db.query(`UPDATE companies SET name = '${companyName}', address = '${companyAddress}' WHERE id = ${id}`, (err, resp) => {
        
                    if(!err) {

                        res.redirect('/list-companies/?m=Įrašas sėkmingai išsaugotas&s=success');

                    } else {

                        res.redirect('/list-companies/?m=Įvyko klaida&s=danger');

                    }
            
                });

            } else {

                res.redirect('/edit-company/' + id + '/?m=Toks kompanijos pavadinimas jau įrašytas&s=warning');

            }

        } else {

            res.redirect('/list-companies/?m=Įvyko klaida&s=danger');

        }

    });

});

app.get('/delete-company/:id', (req, res) => {

    let id = req.params.id;

    db.query(`DELETE FROM companies WHERE id = ${id}`, (err, resp) => {

        if(!err) {

            res.redirect('/list-companies/?m=Įrašas sėkmingai ištrintas&s=success');

        } else {

            res.redirect('/list-companies/?m=Nepavyko ištrinti įrašo&s=danger');
        
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