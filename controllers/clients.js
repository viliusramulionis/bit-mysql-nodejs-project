const express = require('express');
const validator = require('validator');
const path      = require('path');
const multer  = require('multer');
const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: function(req, file, callback) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        callback(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
})
const upload = multer({ 
    fileFilter: function(req, file, callback) {
        if(file.mimetype != 'image/jpeg' && file.mimetype != 'image/png')
            return callback(new Error('Neteisingas nuotraukos formatas'));

        callback(null, true);
    },
    storage: storage
});
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
            res.render('template/clients/add-client', {messages: 'Nepavyko paimti kompanijų iš duomenų bazės.', status: 'danger'});
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
    let photo       = req.file.filename;
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

    db.query(`INSERT INTO customers (name, surname, phone, email, photo, comment, company_id) 
            VALUES ( '${name}', '${surname}', '${phone}', '${email}', '${photo}', '${comment}', '${company_id}' )`
    , err => {
        if(err) {
            res.redirect('/list-clients/?m=Nepavyko pridėti kliento&s=danger');
            return;
        }

        res.redirect('/list-clients/?m=Sėkmingai pridėjote klientą&s=success');
    });

});

module.exports = app;