const express = require('express');
const validator = require('validator');
const multer  = require('multer');
const upload = multer({ dest: 'uploads/' });
const db = require('../db/connection');
const app = express.Router();

//Klientai

app.get('/list-clients', (req, res) => {

    let messages = req.query.m;
    let status = req.query.s;

    db.query(`SELECT * FROM customers`, (err, resp) => {
        
        if(!err) {

            res.render('template/clients/list-clients', {clients: resp, messages, status});

        } else {

            res.redirect('/list-clients/?message=Įvyko klaida&s=danger');

        }

    });

});

app.get('/add-client', (req, res) => {

    db.query(`SELECT id, name FROM companies`, (err, resp) => {
        
        if(err) {
            res.render('template/clients/add-client', {message: 'Nepavyko paimti kompanijų iš duomenų bazės.'});
        } else {
            res.render('template/clients/add-client', {companies: resp});
        }
        
    });

});

app.post('/add-client', upload.single('photo'), (req, res) => {

    let name        = req.body.name;
    let surname     = req.body.surname;
    let phone       = req.body.phone;
    let email       = req.body.email;
    let comment     = req.body.comment;
    let company_id  = req.body.company;

    if(!validator.isAlpha(name, 'en-US', {ignore: ' .ąĄčČęĘėĖįĮšŠųŲūŪ'})
        || !validator.isLength(name, {min: 3, max: 50})) {
        res.redirect('/list-clients/?m=Įveskite kliento vardą&s=danger'); 
        return;
    }

    if(!validator.isAlpha(surname, 'en-US', {ignore: ' .ąĄčČęĘėĖįĮšŠųŲūŪ'})
        || !validator.isLength(name, {min: 3, max: 50})) {
        res.redirect('/list-clients/?m=Įveskite kliento pavardę&s=danger'); 
        return;
    }

    if(!validator.isMobilePhone(phone, 'lt-LT')) {
        res.redirect('/list-clients/?m=Įveskite kliento telefono numerį&s=danger'); 
        return;
    }

    if(!validator.isEmail(email)) {
        res.redirect('/list-clients/?m=Įveskite kliento el. pašto adresą&s=danger'); 
        return;
    }

    if(!validator.isInt(company_id)) {
        res.redirect('/list-clients/?m=Pasirinkite kompaniją&s=danger'); 
        return;
    }

    db.query(`INSERT INTO customers (name, surname, phone, email, comment, company_id) 
            VALUES ( '${name}', '${surname}', '${phone}', '${email}', '${comment}', '${company_id}' )`
    , err => {
        if(err) {
            res.redirect('/list-clients/?m=Nepavyko pridėti kliento&s=danger');
            return;
        }

        res.redirect('/list-clients/?m=Sėkmingai pridėjote klientą&s=success');
    });

    // db.query(`SELECT * FROM companies WHERE name = '${companyName}'`, (err, resp) => {

    //     if(err) {
    //         res.redirect('/list-companies/?m=Įvyko klaida&s=danger');
    //         return;
    //     }

    //     if(resp.length == 0) {
            
    //         db.query(`INSERT INTO companies (name, address) 
    //                 VALUES ( '${companyName}' , '${companyAddress}' )`
    //         , err => {
    //             if(err) {
    //                 console.log(err);
    //                 return;
    //             }

    //             res.redirect('/list-companies/?m=Sėkmingai pridėjote įrašą&s=success');
    //         });

    //     } else {
    //         res.redirect('/list-companies/?m=Toks įrašas jau egzistuoja&s=warning');
    //     }

    // });

});

module.exports = app;