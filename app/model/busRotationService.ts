import * as SQLite from 'expo-sqlite';

export interface BusRotationData {
  bus_rotation_id?: number;
  numero_exploitants: string;
  order_number: number;
  bus_type_id: number;
  date: string;
  arrival_time: string;
  departure_time: string | null;
  passenger_count: number;
  observations: string | null;
  created_at?: string;
}

class BusRotationService {
  private dbName: string = 'transport.db';
  private tableName: string = 'bus_daily_rotation';
  private db: SQLite.SQLiteDatabase | null = null;

  async initDatabase(): Promise<void> {
    try {
      this.db = await SQLite.openDatabaseAsync(this.dbName);
      await this.db.withTransactionAsync(async () => {
        await this.db!.execAsync(`
          CREATE TABLE IF NOT EXISTS ${this.tableName} (
            bus_rotation_id INTEGER PRIMARY KEY AUTOINCREMENT,
            numero_exploitants TEXT NOT NULL,
            order_number INTEGER NOT NULL,
            bus_type_id INTEGER NOT NULL,
            date DATE NOT NULL,
            arrival_time TEXT NOT NULL,
            departure_time TEXT,
            passenger_count INTEGER NOT NULL,
            observations TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (bus_type_id) REFERENCES bus_type(bus_type_id)
          );
        `);
        await this.db!.execAsync(`
          CREATE TABLE IF NOT EXISTS bus_type (
            bus_type_id INTEGER PRIMARY KEY AUTOINCREMENT,
            bus_type_name TEXT NOT NULL UNIQUE
          );
        `);
      });
      console.log('Bus rotation and bus type tables initialized successfully');
    } catch (error) {
      console.error('Error initializing bus rotation and bus type tables:', error);
      throw error;
    }
  }

  async getAllBusRotations(): Promise<BusRotationData[]> {
    try {
      if (!this.db) {
        this.db = await SQLite.openDatabaseAsync(this.dbName);
      }
      let records: BusRotationData[] = [];

      await this.db.withTransactionAsync(async () => {
        const result = await this.db!.getAllAsync(`
          SELECT * FROM ${this.tableName}
          ORDER BY bus_rotation_id ASC
        `);
        
        if (result && Array.isArray(result)) {
          records = result as BusRotationData[];
        }
      });
      
      return records;
    } catch (error) {
      console.error('Error getting bus rotations:', error);
      throw error;
    }
  }

  async getBusRotationById(bus_rotation_id: number): Promise<BusRotationData | null> {
    try {
      if (!this.db) {
        this.db = await SQLite.openDatabaseAsync(this.dbName);
      }
      let record: BusRotationData | null = null;

      await this.db.withTransactionAsync(async () => {
        const result = await this.db!.getAllAsync(`
          SELECT * FROM ${this.tableName}
          WHERE bus_rotation_id = ?
        `, [bus_rotation_id]);
        
        if (result && Array.isArray(result) && result.length > 0) {
          record = result[0] as BusRotationData;
        }
      });
      
      return record;
    } catch (error) {
      console.error(`Error getting bus rotation with id ${bus_rotation_id}:`, error);
      throw error;
    }
  }

  async createBusRotation(data: BusRotationData): Promise<number> {
    try {
      if (!this.db) {
        this.db = await SQLite.openDatabaseAsync(this.dbName);
      }
      let newId: number = 0;

      await this.db.withTransactionAsync(async () => {
        const result = await this.db!.runAsync(`
          INSERT INTO ${this.tableName} (
            numero_exploitants,
            order_number,
            bus_type_id,
            date,
            arrival_time,
            departure_time,
            passenger_count,
            observations
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          data.numero_exploitants,
          data.order_number,
          data.bus_type_id,
          data.date,
          data.arrival_time,
          data.departure_time ?? null,
          data.passenger_count,
          data.observations ?? null
        ]);
        
        newId = result.lastInsertRowId;
      });
      
      return newId;
    } catch (error) {
      console.error('Error creating bus rotation:', error);
      throw error;
    }
  }

  async updateBusRotation(bus_rotation_id: number, data: BusRotationData): Promise<boolean> {
    try {
      if (!this.db) {
        this.db = await SQLite.openDatabaseAsync(this.dbName);
      }
      let success = false;

      await this.db.withTransactionAsync(async () => {
        await this.db!.runAsync(`
          UPDATE ${this.tableName} SET
            numero_exploitants = ?,
            order_number = ?,
            bus_type_id = ?,
            date = ?,
            arrival_time = ?,
            departure_time = ?,
            passenger_count = ?,
            observations = ?
          WHERE bus_rotation_id = ?
        `, [
          data.numero_exploitants,
          data.order_number,
          data.bus_type_id,
          data.date,
          data.arrival_time,
          data.departure_time ?? null,
          data.passenger_count,
          data.observations ?? null,
          bus_rotation_id
        ]);
        
        success = true;
      });
      
      return success;
    } catch (error) {
      console.error(`Error updating bus rotation with id ${bus_rotation_id}:`, error);
      throw error;
    }
  }

  async deleteBusRotation(bus_rotation_id: number): Promise<boolean> {
    try {
      if (!this.db) {
        this.db = await SQLite.openDatabaseAsync(this.dbName);
      }
      let success = false;

      await this.db.withTransactionAsync(async () => {
        await this.db!.runAsync(`
          DELETE FROM ${this.tableName} WHERE bus_rotation_id = ?
        `, [bus_rotation_id]);
        
        success = true;
      });
      
      return success;
    } catch (error) {
      console.error(`Error deleting bus rotation with id ${bus_rotation_id}:`, error);
      throw error;
    }
  }
}

const busRotationService = new BusRotationService();

export default busRotationService;