const express = require('express');
const sql = require('mssql');

const app = express();
const port = 3000;

// SQL Server configuration
const sqlConfig = {
    user: 'SA',
    password: 'Str0ngNewP@ssword!',
    database: 'Transportbdd',
    server: '145.223.73.21', // replace with your server's hostname
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    },
    options: {
        encrypt: true, // for azure
        trustServerCertificate: true // ensure this is set to true
    }
};

// Connect to SQL Server
sql.connect(sqlConfig).then(pool => {
    if (pool.connected) {
        console.log('Connected to SQL Server');
    }
}).catch(err => {
    console.error('SQL Server connection error', err);
});

app.use(express.json());

// Create table if it doesn't exist
sql.connect(sqlConfig).then(pool => {
    if (pool.connected) {
        const createTableQuery = `
            IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'Transport_rotation_fiche')
            BEGIN
                CREATE TABLE Transport_rotation_fiche (
                    id INT IDENTITY(1,1) PRIMARY KEY,
                    exploitants NVARCHAR(MAX),
                    arrivalTime NVARCHAR(50),
                    departureTime NVARCHAR(50),
                    passengers NVARCHAR(MAX),
                    observations NVARCHAR(MAX)
                );
            END;
        `;
        pool.request().query(createTableQuery).then(() => {
            console.log('Table Transport_rotation_fiche is ready');
        }).catch(err => {
            console.error('Error creating table', err);
        });
    }
}).catch(err => {
    console.error('SQL Server connection error', err);
});

// API endpoints for Transport_rotation_fiche
app.get('/api/transport_rotation_fiche', async (req, res) => {
    try {
        const pool = await sql.connect(sqlConfig);
        const result = await pool.request().query('SELECT * FROM Transport_rotation_fiche');
        res.json(result.recordset);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.post('/api/transport_rotation_fiche', async (req, res) => {
    try {
        const { exploitants, arrivalTime, departureTime, passengers, observations } = req.body;
        const pool = await sql.connect(sqlConfig);
        const result = await pool.request()
            .input('exploitants', sql.NVarChar, exploitants)
            .input('arrivalTime', sql.NVarChar, arrivalTime)
            .input('departureTime', sql.NVarChar, departureTime)
            .input('passengers', sql.NVarChar, passengers)
            .input('observations', sql.NVarChar, observations)
            .query('INSERT INTO Transport_rotation_fiche (exploitants, arrivalTime, departureTime, passengers, observations) VALUES (@exploitants, @arrivalTime, @departureTime, @passengers, @observations)');
        res.status(201).json(result.recordset);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.put('/api/transport_rotation_fiche/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { exploitants, arrivalTime, departureTime, passengers, observations } = req.body;
        const pool = await sql.connect(sqlConfig);
        const result = await pool.request()
            .input('id', sql.Int, id)
            .input('exploitants', sql.NVarChar, exploitants)
            .input('arrivalTime', sql.NVarChar, arrivalTime)
            .input('departureTime', sql.NVarChar, departureTime)
            .input('passengers', sql.NVarChar, passengers)
            .input('observations', sql.NVarChar, observations)
            .query('UPDATE Transport_rotation_fiche SET exploitants = @exploitants, arrivalTime = @arrivalTime, departureTime = @departureTime, passengers = @passengers, observations = @observations WHERE id = @id');
        res.json(result.recordset);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.delete('/api/transport_rotation_fiche/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const pool = await sql.connect(sqlConfig);
        const result = await pool.request()
            .input('id', sql.Int, id)
            .query('DELETE FROM Transport_rotation_fiche WHERE id = @id');
        res.json(result.recordset);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
