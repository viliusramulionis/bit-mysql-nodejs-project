const mysql = require('mysql');

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

module.exports = db;