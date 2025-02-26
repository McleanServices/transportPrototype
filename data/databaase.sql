-- 1. Taxi Table
CREATE TABLE taxi (
    taxi_id INTEGER PRIMARY KEY AUTOINCREMENT,
    taxi_number TEXT NOT NULL UNIQUE,
    taxi_type TEXT CHECK(taxi_type IN ('Airport', 'Marigot')) NOT NULL
);
// In your app's initialization
// await airportTaxiRotationService.initDatabase();


-- 2. Airline Company Table
CREATE TABLE airline_company (
    airline_id INTEGER PRIMARY KEY AUTOINCREMENT,
    airline_name TEXT NOT NULL UNIQUE
);

-- 3. Bus Type Lookup Table (Optional, for enforcing bus_type values)
CREATE TABLE bus_type (
    bus_type_id INTEGER PRIMARY KEY AUTOINCREMENT,
    bus_type_name TEXT NOT NULL UNIQUE
);

-- Prepopulate bus_type table with allowed values
INSERT INTO bus_type (bus_type_name) VALUES ('TCP'), ('TCI'), ('ZH');

-- 4. Airport Taxi Rotation Table
CREATE TABLE airport_taxi_rotation (
    airport_taxi_id INTEGER PRIMARY KEY AUTOINCREMENT,
    numero_exploitants TEXT NOT NULL,  -- Operator/exploitation number
    order_number INTEGER NOT NULL,
    taxi_id INTEGER NOT NULL,
    airline_id INTEGER NOT NULL,
    destination TEXT NOT NULL,
    passenger_count INTEGER NOT NULL,
    observations TEXT,
    date DATE NOT NULL,  -- Date of the rotation
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- Timestamp of record creation
    FOREIGN KEY (taxi_id) REFERENCES taxi(taxi_id),
    FOREIGN KEY (airline_id) REFERENCES airline_company(airline_id)
);

-- 5. Bus Daily Rotation Table (Without driver_id)
CREATE TABLE bus_daily_rotation (
    bus_rotation_id INTEGER PRIMARY KEY AUTOINCREMENT,
    numero_exploitants TEXT NOT NULL,  -- Operator/exploitation number
    order_number INTEGER NOT NULL,
    bus_type_id INTEGER NOT NULL,
    date DATE NOT NULL,  -- Date of the rotation
    arrival_time TIME NOT NULL,  -- Time of arrival
    departure_time TIME,  -- Time of departure
    passenger_count INTEGER NOT NULL,
    observations TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- Timestamp of record creation
    FOREIGN KEY (bus_type_id) REFERENCES bus_type(bus_type_id)
);

-- 6. Marigot Taxi Rotation Table
CREATE TABLE marigot_taxi_rotation (
    marigot_taxi_id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_number INTEGER NOT NULL,
    taxi_id INTEGER NOT NULL,
    boat_name TEXT,
    other_transport TEXT,
    destination TEXT NOT NULL,
    passenger_count INTEGER NOT NULL,
    observations TEXT,
    date DATE NOT NULL,  -- Date of the rotation
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- Timestamp of record creation
    FOREIGN KEY (taxi_id) REFERENCES taxi(taxi_id)
);