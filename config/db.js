const { Client } = require('pg');

const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'fitplus',
    password: 'usuario',
    port: 5432,
});

client.connect()
    .then(() => console.log('Conectado a la base de datos PostgreSQL'))
    .catch((err) => console.error('Error de conexión a la base de datos', err.stack));

module.exports = client;
