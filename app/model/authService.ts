import * as SQLite from 'expo-sqlite';
import { generateSessionKey } from '../../utils/sessionUtils'; // Import generateSessionKey

export interface TransportFormData {
    user_id?: number;
    username: string;
    prenom: string;
    password: string;
    nom: string;
    role: string;
    sessionKey?: string; // Added sessionKey
}

export class DatabaseService {
    private dbName: string = 'transport.db';
    private tableName: string = 'utilisateurs';
    private db: SQLite.SQLiteDatabase | null = null;
    private operationQueue: Promise<void> = Promise.resolve();

    private async enqueueOperation<T>(operation: () => Promise<T>): Promise<T> {
        const result = this.operationQueue.then(operation);
        this.operationQueue = result.then(() => {}, () => {});
        return result;
    }

    private async getDatabase(): Promise<SQLite.SQLiteDatabase> {
        if (!this.db) {
            this.db = await SQLite.openDatabaseAsync(this.dbName);
        }
        return this.db;
    }

    private async ensureTableExists(): Promise<void> {
        const db = await this.getDatabase();
        await db.withExclusiveTransactionAsync(async (tx) => {
            await tx.execAsync(`
                CREATE TABLE IF NOT EXISTS ${this.tableName} (
                    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
                    username TEXT NOT NULL,
                    prenom TEXT NOT NULL,
                    password TEXT NOT NULL,
                    nom TEXT NOT NULL,
                    role TEXT NOT NULL,
                    sessionKey TEXT
                );
            `);

            const usernames = ['tyrecem', 'tym'];
            const prenoms = ['Tyrece', 'Ty'];
            const passwords = ['password', '123'];
            const noms = ['McLean', 'McLean'];
            const roles = ['admin', 'user'];
      
            for (let i = 0; i < prenoms.length; i++) {
                const sessionKey = await generateSessionKey(); // Generate a session key
                await tx.runAsync(`
                    INSERT OR IGNORE INTO ${this.tableName} (username, prenom, password, nom, role, sessionKey) 
                    VALUES (?, ?, ?, ?, ?, ?)
                `, [usernames[i], prenoms[i], passwords[i], noms[i], roles[i], sessionKey]);
            }
        });
    }

    async initDatabase(): Promise<void> {
        try {
            await this.ensureTableExists();
            console.log('Database initialized successfully');
        } catch (error) {
            console.error('Error initializing database:', error);
            throw error;
        }
    }

    async getallUsers(): Promise<TransportFormData[]> {
        return this.enqueueOperation(async () => {
            try {
                await this.ensureTableExists();
                const db = await this.getDatabase();
                let records: TransportFormData[] = [];

                await db.withTransactionAsync(async () => {
                    const result = await db.getAllAsync(`
                        SELECT 
                            user_id,
                            username, 
                            prenom,
                            password,
                            nom,
                            role,
                            sessionKey
                        FROM ${this.tableName}
                    `);
                    records = result.map((record: any) => ({
                        user_id: record.user_id,
                        username: record.username,
                        prenom: record.prenom,
                        password: record.password,
                        nom: record.nom,
                        role: record.role,
                        sessionKey: record.sessionKey, // Added sessionKey
                    }));
                });

                return records;
            } catch (error) {
                console.error('Error getting transport records:', error);
                throw error;
            }
        });
    }

    async getAllTableNames(): Promise<string[]> {
        return this.enqueueOperation(async () => {
            try {
                await this.ensureTableExists();
                const db = await this.getDatabase();
                let tableNames: string[] = [];
        
                await db.withTransactionAsync(async () => {
                    const result = await db.getAllAsync(`
                        SELECT name FROM sqlite_master WHERE type='table'
                    `);
        
                    if (result && Array.isArray(result)) {
                        tableNames = result.map(row => (row as { name: string }).name);
                    }
                });
        
                return tableNames;
            } catch (error) {
                console.error('Error getting table names:', error);
                throw error;
            }
        });
    }
}

export default DatabaseService;