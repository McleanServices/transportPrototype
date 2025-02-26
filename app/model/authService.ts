import * as SQLite from 'expo-sqlite';

export interface TransportFormData {
    user_id?: number;
    username: string;
    prenom: string;
    password: string;
    nom: string;
    role: string;
}

export class DatabaseService {
    private dbName: string = 'transport.db';
    private tableName: string = 'utilisateurs';

    /**
     * Initialize the database and create tables if they don't exist
     */
    async initDatabase(): Promise<void> {
        let db: SQLite.SQLiteDatabase | null = null;
        try {
            db = await SQLite.openDatabaseAsync(this.dbName);
            await db.withTransactionAsync(async () => {
                await db!.execAsync(`
                    CREATE TABLE IF NOT EXISTS ${this.tableName} (
                        user_id INTEGER PRIMARY KEY AUTOINCREMENT,
                        username TEXT NOT NULL,
                        prenom TEXT NOT NULL,
                        password TEXT NOT NULL,
                        nom TEXT NOT NULL,
                        role TEXT NOT NULL
                    );
                `);

                const usernames = ['tyrecem', 'tym'];
                const prenoms = ['Tyrece', 'Ty'];
                const passwords = ['password', '123'];
                const noms = ['McLean', 'McLean'];
                const roles = ['admin', 'user'];
          
                for (let i = 0; i < prenoms.length; i++) {
                    await db!.runAsync(`
                        INSERT OR IGNORE INTO ${this.tableName} (username, prenom, password, nom, role) 
                        VALUES (?, ?, ?, ?, ?)
                    `, [usernames[i], prenoms[i], passwords[i], noms[i], roles[i]]);
                }

                console.log('Database initialized successfully');
            });
        } catch (error) {
            console.error('Error initializing database:', error);
            throw error;
        } finally {
            if (db) {
                await db.closeAsync();
            }
        }
    }

    async getallUsers(): Promise<TransportFormData[]> {
        try {
            const db = await SQLite.openDatabaseAsync(this.dbName);
            let records: TransportFormData[] = [];

            await db.withTransactionAsync(async () => {
                const result = await db.getAllAsync(`
                    SELECT 
                        user_id,
                        username, 
                        prenom,
                        password,
                        nom,
                        role
                    FROM ${this.tableName}
                `);
                records = result.map((record: any) => ({
                    user_id: record.user_id,
                    username: record.username,
                    prenom: record.prenom,
                    password: record.password,
                    nom: record.nom,
                    role: record.role,
                }));
            });

            return records;
        } catch (error) {
            console.error('Error getting transport records:', error);
            throw error;
        }
    }

    async getAllTableNames(): Promise<string[]> {
        try {
          const db = await SQLite.openDatabaseAsync(this.dbName);
          let tableNames: string[] = [];
    
          await db.withTransactionAsync(async () => {
            const result = await db.getAllAsync(`
              SELECT name FROM sqlite_master WHERE type='table'
            `);
    
            if (result && Array.isArray(result)) {
              tableNames = result.map(row => (row as { name: string }).name);
            }
          });
    
          await db.closeAsync();
          return tableNames;
        } catch (error) {
          console.error('Error getting table names:', error);
          throw error;
        }
      }

}