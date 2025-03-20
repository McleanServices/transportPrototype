const express = require('express');
const sql = require('mssql');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors()); // Allow all origins

// SQL Server configuration
const sqlConfig = {
    user: 'SA',
    password: 'Str0ngNewP@ssword!',
    database: 'Transportbdd',
    server: '145.223.73.21', 
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

// Create table if it doesn't exist and sync data from SQLite
app.post('/sync-database', async (req, res) => {
    try {
        const pool = await sql.connect(sqlConfig);
        const createTableQuery = `
            IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='bus_rotation' AND xtype='U')
            CREATE TABLE bus_rotation (
                bus_rotation_id INT PRIMARY KEY IDENTITY,
                exploitants NVARCHAR(255),
                date DATE,
                arrival_time TIME,
                departure_time TIME,
                passenger_count INT,
                observations NVARCHAR(255),
                duration_seconds AS DATEDIFF(SECOND, arrival_time, departure_time) PERSISTED,
                created_at DATETIME DEFAULT GETDATE()
            );
        `;
        await pool.request().query(createTableQuery);

        const data = req.body;
        for (const record of data) {
            const upsertQuery = `
                MERGE bus_rotation AS target
                USING (SELECT 
                    @bus_rotation_id AS bus_rotation_id,
                    @exploitants AS exploitants,
                    @date AS date,
                    @arrival_time AS arrival_time,
                    @departure_time AS departure_time,
                    @passenger_count AS passenger_count,
                    @observations AS observations,
                    @created_at AS created_at
                ) AS source
                ON target.bus_rotation_id = source.bus_rotation_id
                WHEN MATCHED THEN 
                    UPDATE SET 
                        exploitants = source.exploitants,
                        date = source.date,
                        arrival_time = source.arrival_time,
                        departure_time = source.departure_time,
                        passenger_count = source.passenger_count,
                        observations = source.observations,
                        created_at = source.created_at
                WHEN NOT MATCHED THEN
                    INSERT (exploitants, date, arrival_time, departure_time, passenger_count, observations, created_at)
                    VALUES (source.exploitants, source.date, source.arrival_time, source.departure_time, source.passenger_count, source.observations, source.created_at);
            `;
            await pool.request()
                .input('bus_rotation_id', sql.Int, record.bus_rotation_id)
                .input('exploitants', sql.NVarChar, record.exploitants)
                .input('date', sql.Date, record.date)
                .input('arrival_time', sql.NVarChar, record.arrival_time)
                .input('departure_time', sql.NVarChar, record.departure_time)
                .input('passenger_count', sql.Int, record.passenger_count)
                .input('observations', sql.NVarChar, record.observations)
                .input('created_at', sql.DateTime, record.created_at)
                .query(upsertQuery);
        }

        res.status(200).send('Database synced successfully');
    } catch (error) {
        console.error('Error syncing database:', error);
        res.status(500).send('Error syncing database');
    }
});

// Test endpoint
app.get('/test', (req, res) => {
    res.status(200).send('API is working');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
