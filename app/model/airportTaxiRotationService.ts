import * as SQLite from 'expo-sqlite';

export interface AirportTaxiRotationData {
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

export class AirportTaxiRotationService {
  private dbName: string = 'transport.db';
  private initialized: boolean = false;
  private db: SQLite.SQLiteDatabase | null = null;

  private async getDatabase(): Promise<SQLite.SQLiteDatabase> {
    if (!this.db) {
      this.db = await SQLite.openDatabaseAsync(this.dbName);
    }
    return this.db;
  }

  async closeDatabase(): Promise<void> {
    if (this.db) {
      await this.db.closeAsync();
      this.db = null;
    }
  }

  async initDatabase(): Promise<void> {
    if (this.initialized) {
      return;
    }

    try {
      const db = await this.getDatabase();
      
      const queries = [
        `CREATE TABLE IF NOT EXISTS airport_taxi_rotations (
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
        )`,
        `CREATE TABLE IF NOT EXISTS taxi (
          taxi_id INTEGER PRIMARY KEY AUTOINCREMENT,
          taxi_number TEXT NOT NULL UNIQUE,
          taxi_type TEXT CHECK(taxi_type IN ('Airport', 'Marigot')) NOT NULL
        )`,
        `CREATE TABLE IF NOT EXISTS airline_company (
          airline_id INTEGER PRIMARY KEY AUTOINCREMENT,
          airline_name TEXT NOT NULL UNIQUE
        )`
      ];

      for (const query of queries) {
        await db.execAsync(query);
      }

      // Insert default airline companies
      const airlineCompanies = ['Air Antilles', 'Air Caraïbes', 'Air France', 'American Airlines'];
      for (const airline of airlineCompanies) {
        await db.runAsync(
          'INSERT OR IGNORE INTO airline_company (airline_name) VALUES (?)',
          [airline]
        );
      }

      this.initialized = true;
      console.log('Airport taxi rotation tables initialized successfully');
    } catch (error) {
      console.error('Error initializing airport taxi rotation tables:', error);
      throw error;
    }
  }

  async createAirportTaxiRotation(data: AirportTaxiRotationData): Promise<number> {
    try {
      const db = await this.getDatabase();
      
      const result = await db.runAsync(
        `INSERT INTO airport_taxi_rotations (
          numero_exploitants, order_number, taxi_id, airline_id,
          destination, passenger_count, observations, date
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          data.numero_exploitants,
          data.order_number,
          data.taxi_id,
          data.airline_id,
          data.destination,
          data.passenger_count,
          data.observations,
          data.date
        ]
      );

      const lastIdResult = await db.getFirstAsync<{ id: number }>(
        'SELECT last_insert_rowid() as id'
      );
      
      return lastIdResult?.id ?? -1;
    } catch (error) {
      console.error('Error creating airport taxi rotation:', error);
      throw error;
    }
  }

  async getAllAirportTaxiRotations(): Promise<AirportTaxiRotationData[]> {
    try {
      const db = await this.getDatabase();
      
      const result = await db.getAllAsync<AirportTaxiRotationData>(
        `SELECT atr.*, ac.airline_name 
         FROM airport_taxi_rotations atr
         JOIN airline_company ac ON atr.airline_id = ac.airline_id
         ORDER BY atr.created_at DESC`
      );

      return result;
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
        SELECT * FROM airport_taxi_rotations
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

  async updateAirportTaxiRotation(airport_taxi_id: number, data: AirportTaxiRotationData): Promise<boolean> {
    try {
      const db = await this.getDatabase();
      let success = false;

      await db.withTransactionAsync(async () => {
        await db.runAsync(`
          UPDATE airport_taxi_rotations SET
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
          DELETE FROM airport_taxi_rotations WHERE airport_taxi_id = ?
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