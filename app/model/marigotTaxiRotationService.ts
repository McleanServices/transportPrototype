import * as SQLite from "expo-sqlite";

export interface MarigotTaxiRotationData {
  marigot_taxi_id?: number;
  order_number: number;
  taxi_id: number;
  boat_name: string | null;
  other_transport: string | null;
  destination: string;
  passenger_count: number;
  observations: string | null;
  date: string;
  created_at?: string;
}

class MarigotTaxiRotationService {
  private dbName: string = "transport.db";
  private tableName: string = "marigot_taxi_rotations";
  private db: SQLite.SQLiteDatabase | null = null;
  private operationQueue: Promise<void> = Promise.resolve();

  private async enqueueOperation<T>(operation: () => Promise<T>): Promise<T> {
    const result = this.operationQueue.then(operation);
    this.operationQueue = result.then(
      () => {},
      () => {}
    );
    return result;
  }

  private async getDatabase(): Promise<SQLite.SQLiteDatabase> {
    if (!this.db) {
      this.db = await SQLite.openDatabaseAsync(this.dbName);
    }
    return this.db;
  }

  private async ensureTablesExist(): Promise<void> {
    const db = await this.getDatabase();
    await db.withExclusiveTransactionAsync(async (tx) => {
      await tx.execAsync(`
        CREATE TABLE IF NOT EXISTS ${this.tableName} (
          marigot_taxi_id INTEGER PRIMARY KEY AUTOINCREMENT,
          taxi_id INTEGER NOT NULL,
          boat_name TEXT,
          other_transport TEXT,
          destination TEXT NOT NULL,
          passenger_count INTEGER NOT NULL,
          observations TEXT,
          date DATE NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (taxi_id) REFERENCES taxi(taxi_id)
        );
      `);
    });
  }

  async initDatabase(): Promise<void> {
    try {
      await this.ensureTablesExist();
      console.log("Marigot taxi rotation tables initialized successfully");
    } catch (error) {
      console.error("Error initializing marigot taxi rotation tables:", error);
      throw error;
    }
  }

  async getAllMarigotTaxiRotations(): Promise<MarigotTaxiRotationData[]> {
    return this.enqueueOperation(async () => {
      try {
        await this.ensureTablesExist();
        const db = await this.getDatabase();
        let records: MarigotTaxiRotationData[] = [];

        await db.withTransactionAsync(async () => {
          const result = await db.getAllAsync(`
            SELECT * FROM ${this.tableName}
            ORDER BY created_at DESC
          `);

          if (result && Array.isArray(result)) {
            records = result as MarigotTaxiRotationData[];
          }
        });

        return records;
      } catch (error) {
        console.error("Error getting marigot taxi rotations:", error);
        throw error;
      }
    });
  }

  async getMarigotTaxiRotationById(
    marigot_taxi_id: number
  ): Promise<MarigotTaxiRotationData | null> {
    try {
      await this.ensureTablesExist();
      if (!this.db) {
        this.db = await SQLite.openDatabaseAsync(this.dbName);
      }
      let record: MarigotTaxiRotationData | null = null;

      await this.db.withTransactionAsync(async () => {
        const result = await this.db!.getAllAsync(
          `
            SELECT * FROM ${this.tableName}
            WHERE marigot_taxi_id = ?
          `,
          [marigot_taxi_id]
        );

        if (result && Array.isArray(result) && result.length > 0) {
          record = result[0] as MarigotTaxiRotationData;
        }
      });

      return record;
    } catch (error) {
      console.error(
        `Error getting marigot taxi rotation with id ${marigot_taxi_id}:`,
        error
      );
      throw error;
    }
  }

  async createMarigotTaxiRotation(
    data: MarigotTaxiRotationData
  ): Promise<number> {
    try {
      await this.ensureTablesExist();
      if (!this.db) {
        this.db = await SQLite.openDatabaseAsync(this.dbName);
      }
      let newId: number = 0;

      await this.db.withTransactionAsync(async () => {
        const result = await this.db!.runAsync(
          `
            INSERT INTO ${this.tableName} (
              order_number,
              taxi_id,
              boat_name,
              other_transport,
              destination,
              passenger_count,
              observations,
              date
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
          `,
          [
            data.order_number,
            data.taxi_id,
            data.boat_name ?? null,
            data.other_transport ?? null,
            data.destination,
            data.passenger_count,
            data.observations ?? null,
            data.date,
          ]
        );

        newId = result.lastInsertRowId;
      });

      return newId;
    } catch (error) {
      console.error("Error creating marigot taxi rotation:", error);
      throw error;
    }
  }

  async updateMarigotTaxiRotation(
    marigot_taxi_id: number,
    data: MarigotTaxiRotationData
  ): Promise<boolean> {
    return this.enqueueOperation(async () => {
      try {
        await this.ensureTablesExist();
        const db = await this.getDatabase();
        let success = false;

        await db.withTransactionAsync(async () => {
          await db.runAsync(
            `
            UPDATE ${this.tableName} SET
              order_number = ?,
              taxi_id = ?,
              boat_name = ?,
              other_transport = ?,
              destination = ?,
              passenger_count = ?,
              observations = ?,
              date = ?
            WHERE marigot_taxi_id = ?
          `,
            [
              data.order_number,
              data.taxi_id,
              data.boat_name ?? null,
              data.other_transport ?? null,
              data.destination,
              data.passenger_count,
              data.observations ?? null,
              data.date,
              marigot_taxi_id,
            ]
          );

          success = true;
        });

        return success;
      } catch (error) {
        console.error(
          `Error updating marigot taxi rotation with id ${marigot_taxi_id}:`,
          error
        );
        throw error;
      }
    });
  }

  async deleteMarigotTaxiRotation(marigot_taxi_id: number): Promise<boolean> {
    return this.enqueueOperation(async () => {
      try {
        await this.ensureTablesExist();
        const db = await this.getDatabase();
        let success = false;

        await db.withTransactionAsync(async () => {
          await db.runAsync(
            `
            DELETE FROM ${this.tableName} WHERE marigot_taxi_id = ?
          `,
            [marigot_taxi_id]
          );

          success = true;
        });

        return success;
      } catch (error) {
        console.error(
          `Error deleting marigot taxi rotation with id ${marigot_taxi_id}:`,
          error
        );
        throw error;
      }
    });
  }

  async executeSQLQuery(query: string): Promise<any[]> {
    return this.enqueueOperation(async () => {
      try {
        const db = await this.getDatabase();
        let results: any[] = [];

        await db.withTransactionAsync(async () => {
          const result = await db.getAllAsync(query);
          if (result && Array.isArray(result)) {
            results = result;
          }
        });

        return results;
      } catch (error) {
        console.error("Error executing SQL query:", error);
        throw error;
      }
    });
  }

  async closeDatabase(): Promise<void> {
    if (this.db) {
      await this.db.closeAsync();
      this.db = null;
    }
  }
}

const marigotTaxiRotationService = new MarigotTaxiRotationService();
export default marigotTaxiRotationService;
