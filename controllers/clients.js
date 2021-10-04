const express = require('express');
const validator = require('validator');
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
    res.render('template/clients/add-client');
});

app.post('/add-client', (req, res) => {

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

module.exports = app;