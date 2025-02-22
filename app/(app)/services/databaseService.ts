import * as SQLite from 'expo-sqlite';

// Rename FormData to TransportFormData
interface TransportFormData {
  id?: number; // Ensure id is optional
  exploitants: string;
  arrivalTime: string;
  departureTime: string | null;
  passengers: string | null;
  observations: string | null;
  order?: number;
}

class DatabaseService {
  private dbName: string = 'transport.db';
  private tableName: string = 'Transport_rotation_fiche';

  /**
   * Initialize the database and create tables if they don't exist
   */
  async initDatabase(): Promise<void> {
    let db: SQLite.SQLiteDatabase | null = null;
    try {
      db = await SQLite.openDatabaseAsync(this.dbName);
      await db.withTransactionAsync(async () => {
        // Drop the table if it needs to be updated
        if (await this.tableNeedsUpdate(db!)) {
          await db!.execAsync(`DROP TABLE IF EXISTS ${this.tableName}`);
          
          // Create the table with all required columns
          await db!.execAsync(`
            CREATE TABLE IF NOT EXISTS ${this.tableName} (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              exploitants TEXT NOT NULL,
              arrivalTime TEXT NOT NULL,
              departureTime TEXT,
              passengers TEXT,
              observations TEXT,
              order_num INTEGER
            );
          `);
        }
      });
      console.log('Database initialized successfully');
    } catch (error) {
      console.error('Error initializing database:', error);
      throw error;
    } finally {
      if (db) {
        await db.closeAsync();
      }
    }
  }

  private async tableNeedsUpdate(db: SQLite.SQLiteDatabase): Promise<boolean> {
    try {
      await db.getAllAsync(`SELECT order_num FROM ${this.tableName} LIMIT 1`);
      return false;
    } catch (error) {
      return true;
    }
  }

  /**
   * Get all transport records from the database
   */
  async getAllTransportRecords(): Promise<TransportFormData[]> {
    try {
      const db = await SQLite.openDatabaseAsync(this.dbName);
      let records: TransportFormData[] = [];

      await db.withTransactionAsync(async () => {
        const result = await db.getAllAsync(`
          SELECT 
            id, 
            exploitants, 
            arrivalTime, 
            departureTime, 
            passengers, 
            observations, 
            order_num as "order" 
          FROM ${this.tableName}
          ORDER BY id DESC
        `);
        
        if (result && Array.isArray(result)) {
          records = result as TransportFormData[];
        }
      });
      
      await db.closeAsync();
      return records;
    } catch (error) {
      console.error('Error getting transport records:', error);
      throw error;
    }
  }

  /**
   * Get a single transport record by ID
   */
  async getTransportRecordById(id: number): Promise<TransportFormData | null> {
    try {
      const db = await SQLite.openDatabaseAsync(this.dbName);
      let record: TransportFormData | null = null;

      await db.withTransactionAsync(async () => {
        const result = await db.getAllAsync(`
          SELECT 
            id, 
            exploitants, 
            arrivalTime, 
            departureTime, 
            passengers, 
            observations, 
            order_num as "order" 
          FROM ${this.tableName}
          WHERE id = ?
        `, [id]);
        
        if (result && Array.isArray(result) && result.length > 0) {
          record = result[0] as TransportFormData;
        }
      });
      
      await db.closeAsync();
      return record;
    } catch (error) {
      console.error(`Error getting transport record with id ${id}:`, error);
      throw error;
    }
  }

  /**
   * Create a new transport record
   */
  async createTransportRecord(data: TransportFormData): Promise<number> {
    try {
      const db = await SQLite.openDatabaseAsync(this.dbName);
      let newId: number = 0;

      // Get the current max order number
      const maxOrderResult = await db.getAllAsync(`
        SELECT MAX(order_num) as max_order FROM ${this.tableName}
      `);
      
      const newOrder = (maxOrderResult[0] as { max_order: number })?.max_order ? (maxOrderResult[0] as { max_order: number }).max_order + 1 : 1;

      await db.withTransactionAsync(async () => {
        const result = await db.runAsync(`
          INSERT INTO ${this.tableName} (
            exploitants, 
            arrivalTime, 
            departureTime, 
            passengers, 
            observations, 
            order_num
          ) VALUES (?, ?, ?, ?, ?, ?)
        `, [
          data.exploitants,
          data.arrivalTime,
          data.departureTime ?? null,
          data.passengers ?? null,
          data.observations ?? null,
          newOrder
        ]);
        
        newId = result.lastInsertRowId;
      });
      
      await db.closeAsync();
      return newId;
    } catch (error) {
      console.error('Error creating transport record:', error);
      throw error;
    }
  }

  /**
   * Update an existing transport record
   */
  async updateTransportRecord(id: number, data: TransportFormData): Promise<boolean> {
    try {
      const db = await SQLite.openDatabaseAsync(this.dbName);
      let success = false;

      await db.withTransactionAsync(async () => {
        await db.runAsync(`
          UPDATE ${this.tableName} SET
            exploitants = ?,
            arrivalTime = ?,
            departureTime = ?,
            passengers = ?,
            observations = ?
          WHERE id = ?
        `, [
          data.exploitants,
          data.arrivalTime,
          data.departureTime ?? null,
          data.passengers ?? null,
          data.observations ?? null,
          id
        ]);
        
        success = true;
      });
      
      await db.closeAsync();
      return success;
    } catch (error) {
      console.error(`Error updating transport record with id ${id}:`, error);
      throw error;
    }
  }

  /**
   * Delete a transport record by ID
   */
  async deleteTransportRecord(id: number): Promise<boolean> {
    try {
      const db = await SQLite.openDatabaseAsync(this.dbName);
      let success = false;

      await db.withTransactionAsync(async () => {
        await db.runAsync(`
          DELETE FROM ${this.tableName} WHERE id = ?
        `, [id]);
        
        success = true;
      });
      
      await db.closeAsync();
      return success;
    } catch (error) {
      console.error(`Error deleting transport record with id ${id}:`, error);
      throw error;
    }
  }

  /**
   * Delete multiple transport records by ID
   */
  async deleteMultipleRecords(ids: number[]): Promise<boolean> {
    if (!ids.length) return false;

    try {
      const db = await SQLite.openDatabaseAsync(this.dbName);
      let success = false;

      await db.withTransactionAsync(async () => {
        // Create placeholders for the IN clause
        const placeholders = ids.map(() => '?').join(',');
        
        await db.runAsync(`
          DELETE FROM ${this.tableName} WHERE id IN (${placeholders})
        `, ids);
        
        success = true;
      });
      
      await db.closeAsync();
      return success;
    } catch (error) {
      console.error(`Error deleting multiple transport records:`, error);
      throw error;
    }
  }

  /**
   * Count total records in the database
   */
  async countRecords(): Promise<number> {
    try {
      const db = await SQLite.openDatabaseAsync(this.dbName);
      let count = 0;

      await db.withTransactionAsync(async () => {
        const result = await db.getAllAsync(`
          SELECT COUNT(*) as count FROM ${this.tableName}
        `);
        
        count = (result[0] as { count: number }).count || 0;
      });
      
      await db.closeAsync();
      return count;
    } catch (error) {
      console.error('Error counting records:', error);
      throw error;
    }
  }

  /**
   * Reorder records after deletion or when order needs to be fixed
   */
  async reorderRecords(): Promise<boolean> {
    try {
      const db = await SQLite.openDatabaseAsync(this.dbName);
      let success = false;

      await db.withTransactionAsync(async () => {
        // Get all records ordered by their current order
        const records = await db.getAllAsync(`
          SELECT id FROM ${this.tableName} ORDER BY order_num ASC
        `) as { id: number }[];
        
        // Update each record with a new sequential order number
        for (let i = 0; i < records.length; i++) {
          await db.runAsync(`
            UPDATE ${this.tableName} SET order_num = ? WHERE id = ?
          `, [i + 1, records[i].id]);
        }
        
        success = true;
      });
      
      await db.closeAsync();
      return success;
    } catch (error) {
      console.error('Error reordering records:', error);
      throw error;
    }
  }
}

// Create a singleton instance
const databaseService = new DatabaseService();

export default databaseService;