import * as SQLite from "expo-sqlite";

export interface AirportTaxiRotationData {
  airport_taxi_id?: number;
  numero_exploitants: string;
  order_number: number;
  airline_id: number;
  destination: string;
  passenger_count: number;
  observations: string | null;
  date: string;
  created_at?: string;
  airline_name?: string;
}

class AirportTaxiRotationService {
  private dbName: string = "transport.db";
  private tableName: string = "airport_taxi_rotations_test";
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
          airport_taxi_id INTEGER PRIMARY KEY AUTOINCREMENT,
          numero_exploitants TEXT NOT NULL,
          order_number INTEGER NOT NULL,
          airline_id INTEGER,
          destination TEXT NOT NULL,
          passenger_count INTEGER NOT NULL,
          observations TEXT,
          date DATE NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (airline_id) REFERENCES airline_company(airline_id)
        );
      `);
      await tx.execAsync(`
        CREATE TABLE IF NOT EXISTS airline_company (
          airline_id INTEGER PRIMARY KEY AUTOINCREMENT,
          airline_name TEXT NOT NULL UNIQUE
        );
      `);

      // Insert default airline companies
      const airlineCompanies = [
        "-",
        "Air Antilles",
        "Air Caraïbes",
        "Air France",
        "American Airlines",
      ];
      for (const airline of airlineCompanies) {
        await tx.runAsync(
          "INSERT OR IGNORE INTO airline_company (airline_name) VALUES (?)",
          [airline]
        );
      }
    });
  }

  async initDatabase(): Promise<void> {
    try {
      await this.ensureTablesExist();
      console.log("Airport taxi rotation tables initialized successfully");
    } catch (error) {
      console.error("Error initializing airport taxi rotation tables:", error);
      throw error;
    }
  }

  async getAllAirportTaxiRotations(): Promise<AirportTaxiRotationData[]> {
    return this.enqueueOperation(async () => {
      try {
        await this.ensureTablesExist();
        const db = await this.getDatabase();
        let records: AirportTaxiRotationData[] = [];

        await db.withTransactionAsync(async () => {
          const result = await db.getAllAsync(`
            SELECT atr.*, ac.airline_name 
            FROM ${this.tableName} atr
            JOIN airline_company ac ON atr.airline_id = ac.airline_id
            ORDER BY atr.created_at DESC
          `);

          if (result && Array.isArray(result)) {
            records = result as AirportTaxiRotationData[];
          }
        });

        return records;
      } catch (error) {
        console.error("Error getting airport taxi rotations:", error);
        throw error;
      }
    });
  }

  async getAirportTaxiRotationById(
    airport_taxi_id: number
  ): Promise<AirportTaxiRotationData | null> {
    try {
      await this.ensureTablesExist();
      if (!this.db) {
        this.db = await SQLite.openDatabaseAsync(this.dbName);
      }
      let record: AirportTaxiRotationData | null = null;

      await this.db.withTransactionAsync(async () => {
        const result = await this.db!.getAllAsync(
          `
            SELECT atr.*, ac.airline_name 
            FROM ${this.tableName} atr
            JOIN airline_company ac ON atr.airline_id = ac.airline_id
            WHERE airport_taxi_id = ?
          `,
          [airport_taxi_id]
        );

        if (result && Array.isArray(result) && result.length > 0) {
          record = result[0] as AirportTaxiRotationData;
        }
      });

      return record;
    } catch (error) {
      console.error(
        `Error getting airport taxi rotation with id ${airport_taxi_id}:`,
        error
      );
      throw error;
    }
  }

  async createAirportTaxiRotation(
    data: AirportTaxiRotationData
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
              numero_exploitants,
              order_number,
              airline_id,
              destination,
              passenger_count,
              observations,
              date
            ) VALUES (?, ?, ?, ?, ?, ?, ?)
          `,
          [
            data.numero_exploitants,
            data.order_number,
            data.airline_id,
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
      console.error("Error creating airport taxi rotation:", error);
      throw error;
    }
  }

  async updateAirportTaxiRotation(
    airport_taxi_id: number,
    data: AirportTaxiRotationData
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
              numero_exploitants = ?,
              order_number = ?,
              airline_id = ?,
              destination = ?,
              passenger_count = ?,
              observations = ?,
              date = ?
            WHERE airport_taxi_id = ?
          `,
            [
              data.numero_exploitants,
              data.order_number,
              data.airline_id,
              data.destination,
              data.passenger_count,
              data.observations ?? null,
              data.date,
              airport_taxi_id,
            ]
          );

          success = true;
        });

        return success;
      } catch (error) {
        console.error(
          `Error updating airport taxi rotation with id ${airport_taxi_id}:`,
          error
        );
        throw error;
      }
    });
  }

  async deleteAirportTaxiRotation(airport_taxi_id: number): Promise<boolean> {
    return this.enqueueOperation(async () => {
      try {
        await this.ensureTablesExist();
        const db = await this.getDatabase();
        let success = false;

        await db.withTransactionAsync(async () => {
          await db.runAsync(
            `
            DELETE FROM ${this.tableName} WHERE airport_taxi_id = ?
          `,
            [airport_taxi_id]
          );

          success = true;
        });

        return success;
      } catch (error) {
        console.error(
          `Error deleting airport taxi rotation with id ${airport_taxi_id}:`,
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

const airportTaxiRotationService = new AirportTaxiRotationService();
export default airportTaxiRotationService;
