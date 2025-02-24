import * as SQLite from 'expo-sqlite';

interface AirportTaxiRotationData {
  airport_taxi_id?: number;
  numero_exploitants: string;
  order_number: number;
  taxi_id: number;
  airline_id: number;
  destination: string;
  passenger_count: number;
  observations: string | null;
  date: string;
  created_at?: string;
  airline_name: string;
}

class AirportTaxiRotationService {
  private dbName: string = 'transport.db';
  private tableName: string = 'airport_taxi_rotations';
  private db: SQLite.SQLiteDatabase | null = null;

  private async getDatabase(): Promise<SQLite.SQLiteDatabase> {
    if (!this.db) {
      this.db = await SQLite.openDatabaseAsync(this.dbName);
    }
    return this.db;
  }

  async initDatabase(): Promise<void> {
    try {
      const db = await this.getDatabase();
      await db.withTransactionAsync(async () => {
        await db.execAsync(`
          CREATE TABLE IF NOT EXISTS ${this.tableName} (
            airport_taxi_id INTEGER PRIMARY KEY AUTOINCREMENT,
            numero_exploitants TEXT NOT NULL,
            order_number INTEGER NOT NULL,
            taxi_id INTEGER NOT NULL,
            airline_id INTEGER NOT NULL,
            destination TEXT NOT NULL,
            passenger_count INTEGER NOT NULL,
            observations TEXT,
            date DATE NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (taxi_id) REFERENCES taxi(taxi_id),
            FOREIGN KEY (airline_id) REFERENCES airline_company(airline_id)
          );
        `);
        await db.execAsync(`
          CREATE TABLE IF NOT EXISTS taxi (
            taxi_id INTEGER PRIMARY KEY AUTOINCREMENT,
            taxi_number TEXT NOT NULL UNIQUE,
            taxi_type TEXT CHECK(taxi_type IN ('Airport', 'Marigot')) NOT NULL
          );
        `);
        await db.execAsync(`
          CREATE TABLE IF NOT EXISTS airline_company (
            airline_id INTEGER PRIMARY KEY AUTOINCREMENT,
            airline_name TEXT NOT NULL UNIQUE
          );
        `);

        const airlineCompanies = ['Air Antilles', 'Air Caraïbes', 'Air France', 'American Airlines'];
        for (const airline of airlineCompanies) {
          await db.runAsync(`
            INSERT OR IGNORE INTO airline_company (airline_name) VALUES (?)
          `, [airline]);
        }
      });
      console.log('Airport taxi rotation, taxi, and airline company tables initialized successfully');
    } catch (error) {
      console.error('Error initializing airport taxi rotation, taxi, and airline company tables:', error);
      throw error;
    }
  }

  async getAllAirportTaxiRotations(): Promise<AirportTaxiRotationData[]> {
    try {
      const db = await this.getDatabase();
      let records: AirportTaxiRotationData[] = [];

      await db.withTransactionAsync(async () => {
        const result = await db.getAllAsync(`
          SELECT * FROM ${this.tableName}
          join airline_company on airport_taxi_rotations.airline_id = airline_company.airline_id
          ORDER BY airport_taxi_id ASC
        `);
        
        if (result && Array.isArray(result)) {
          records = result as AirportTaxiRotationData[];
        }
      });
      
      return records;
    } catch (error) {
      console.error('Error getting airport taxi rotations:', error);
      throw error;
    }
  }

  async getAirportTaxiRotationById(airport_taxi_id: number): Promise<AirportTaxiRotationData | null> {
    try {
      const db = await this.getDatabase();
      let record: AirportTaxiRotationData | null = null;

      const result = await db.getAllAsync(`
        SELECT * FROM ${this.tableName}
        WHERE airport_taxi_id = ?
      `, [airport_taxi_id]);
      
      if (result && Array.isArray(result) && result.length > 0) {
        record = result[0] as AirportTaxiRotationData;
      }
      
      return record;
    } catch (error) {
      console.error(`Error getting airport taxi rotation with id ${airport_taxi_id}:`, error);
      throw error;
    }
  }

  async createAirportTaxiRotation(data: AirportTaxiRotationData): Promise<number> {
    try {
      const db = await this.getDatabase();
      let newId: number = 0;

      await db.withTransactionAsync(async () => {
        const result = await db.runAsync(`
          INSERT INTO ${this.tableName} (
            numero_exploitants,
            order_number,
            taxi_id,
            airline_id,
            destination,
            passenger_count,
            observations,
            date
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          data.numero_exploitants,
          data.order_number,
          data.taxi_id,
          data.airline_id,
          data.destination,
          data.passenger_count,
          data.observations ?? null,
          data.date
        ]);
        
        newId = result.lastInsertRowId;
      });
      
      return newId;
    } catch (error) {
      console.error('Error creating airport taxi rotation:', error);
      throw error;
    }
  }

  async updateAirportTaxiRotation(airport_taxi_id: number, data: AirportTaxiRotationData): Promise<boolean> {
    try {
      const db = await this.getDatabase();
      let success = false;

      await db.withTransactionAsync(async () => {
        await db.runAsync(`
          UPDATE ${this.tableName} SET
            numero_exploitants = ?,
            order_number = ?,
            taxi_id = ?,
            airline_id = ?,
            destination = ?,
            passenger_count = ?,
            observations = ?,
            date = ?
          WHERE airport_taxi_id = ?
        `, [
          data.numero_exploitants,
          data.order_number,
          data.taxi_id,
          data.airline_id,
          data.destination,
          data.passenger_count,
          data.observations ?? null,
          data.date,
          airport_taxi_id
        ]);
        
        success = true;
      });
      
      return success;
    } catch (error) {
      console.error(`Error updating airport taxi rotation with id ${airport_taxi_id}:`, error);
      throw error;
    }
  }

  async deleteAirportTaxiRotation(airport_taxi_id: number): Promise<boolean> {
    try {
      const db = await this.getDatabase();
      let success = false;

      await db.withTransactionAsync(async () => {
        await db.runAsync(`
          DELETE FROM ${this.tableName} WHERE airport_taxi_id = ?
        `, [airport_taxi_id]);
        
        success = true;
      });
      
      return success;
    } catch (error) {
      console.error(`Error deleting airport taxi rotation with id ${airport_taxi_id}:`, error);
      throw error;
    }
  }
}

const airportTaxiRotationService = new AirportTaxiRotationService();

export default airportTaxiRotationService;