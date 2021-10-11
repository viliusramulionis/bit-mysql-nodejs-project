const express = require('express');
const hbs = require('express-handlebars');
const app = express();
const path = require('path');
const db = require('./db/connection');
const clientsController = require('./controllers/clients');
const companiesController = require('./controllers/companies');

//express-session
const session = require('express-session');

//md5 modulis
const md5 = require('md5');

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

app.use(express.urlencoded({
    extended: false
}));

app.engine('hbs', hbs({
    extname: 'hbs',
    defaultLayout: 'layout',
    layoutsDir: __dirname + '/views/template',
    helpers: require('./config/handlebars-helpers')
}));

app.set('views', path.join(__dirname, '/views/'));

app.set('view engine', 'hbs');

app.use('/uploads', express.static('uploads'));
app.use('/static', express.static('static'));
app.use('/static/css', express.static( path.join( __dirname, 'node_modules/bootstrap/dist/css') ) );
app.use('/static/js', express.static( path.join( __dirname, 'node_modules/bootstrap/dist/js') ) );

app.use('/', clientsController);
app.use('/', companiesController);

//Controlleris vedantis index puslapi

app.get('/', (req, res) => {
    //res.render('add-company');
    if(req.session.auth)
        res.redirect('/list-clients');
    else 
        res.render('template/login');
});

app.post('/login', (req, res) => {

    let user = req.body.email;
    let pass = md5(req.body.password);

    if(user && pass) {
        
        db.query(`SELECT * FROM users WHERE email = '${user}' AND password = '${pass}'`, (err, user) => {
            
            if(!err && user.length > 0) {
                
                req.session.auth = true;
                req.session.user = user;
                req.session.save();
            }

        });

    }

    res.redirect('/');

});

app.get('/logout', (req, res) => {

    req.session.auth = false;
    req.session.user = false;

    req.session.save();

    res.redirect('/');

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