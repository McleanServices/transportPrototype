import * as SQLite from 'expo-sqlite';

export interface UCVFormData {
    id?: number;
    airprt_taxi_rotation_id: number;
    station: string;
    nom: string;
    prenom: string;
    role: string;
    chauffeur_nom: string;
    chauffeur_prenom: string;
    date_naissance: string;
    lieu_naissance: string;
    domicile: string;
    occupation: string;
    document_releve: string;
    carte_pro_num: string;
    autorisation_num: string;
    validite_autorisation: string;
    observation: string;
    taxi_numero: string;
    immatriculation: string;
    type_marque: string;
    couleur_vehicule: string;
    created_at?: string;
}

export interface Assistant {
    id?: number;
    ucv_form_id: number;
    nom: string;
    prenom: string;
}

export interface Fault {
    id?: number;
    fault_name: string;
}

class UCVFormService {
    private dbName: string = 'transport.db';
    private tableName: string = 'UCV_Forms';
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
            
            // Create UCV Forms table
            await db.execAsync(`
                CREATE TABLE IF NOT EXISTS ${this.tableName} (
                    id INTEGER PRIMARY KEY AUTOINCREMENT, 
                    airport_taxi_rotation_id INTEGER UNIQUE,
                    station TEXT,
                    nom TEXT,
                    prenom TEXT,
                    role TEXT,
                    chauffeur_nom TEXT,
                    chauffeur_prenom TEXT,
                    date_naissance TEXT,
                    lieu_naissance TEXT,
                    domicile TEXT,
                    occupation TEXT,
                    document_releve TEXT,
                    carte_pro_num TEXT,
                    autorisation_num TEXT,
                    validite_autorisation TEXT,
                    observation TEXT,
                    taxi_numero TEXT,
                    immatriculation TEXT,
                    type_marque TEXT,
                    couleur_vehicule TEXT,
                    created_at TEXT DEFAULT CURRENT_TIMESTAMP
                )`);
            
            // Create Assistants table
            await db.execAsync(`
                CREATE TABLE IF NOT EXISTS Assistants (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    ucv_form_id INTEGER,
                    nom TEXT,
                    prenom TEXT,
                    FOREIGN KEY (ucv_form_id) REFERENCES UCV_Forms(id)
                )`);
            
            // Create Faults table
            await db.execAsync(`
                CREATE TABLE IF NOT EXISTS Faults (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    fault_name TEXT UNIQUE
                )`);
            
            // Create UCV Form Faults relationship table
            await db.execAsync(`
                CREATE TABLE IF NOT EXISTS UCV_Form_Faults (
                    ucv_form_id INTEGER,
                    fault_id INTEGER,
                    PRIMARY KEY (ucv_form_id, fault_id),
                    FOREIGN KEY (ucv_form_id) REFERENCES UCV_Forms(id),
                    FOREIGN KEY (fault_id) REFERENCES Faults(id)
                )`);
                
            console.log('UCV Form tables initialized successfully');
        } catch (error) {
            console.error('Error creating database tables:', error);
            throw error;
        }
    }

    async create(formData: UCVFormData): Promise<number> {
        try {
            const db = await this.getDatabase();
            let result;
            
            await db.execAsync('BEGIN TRANSACTION');
            
            result = await db.runAsync(`
                INSERT INTO ${this.tableName} (
                    airport_taxi_rotation_id,
                    station,
                    nom,
                    prenom,
                    role,
                    chauffeur_nom,
                    chauffeur_prenom,
                    date_naissance,
                    lieu_naissance,
                    domicile,
                    occupation,
                    document_releve,
                    carte_pro_num,
                    autorisation_num,
                    validite_autorisation,
                    observation,
                    taxi_numero,
                    immatriculation,
                    type_marque,
                    couleur_vehicule
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    formData.airprt_taxi_rotation_id,
                    formData.station,
                    formData.nom,
                    formData.prenom,
                    formData.role,
                    formData.chauffeur_nom,
                    formData.chauffeur_prenom,
                    formData.date_naissance,
                    formData.lieu_naissance,
                    formData.domicile,
                    formData.occupation,
                    formData.document_releve,
                    formData.carte_pro_num,
                    formData.autorisation_num,
                    formData.validite_autorisation,
                    formData.observation,
                    formData.taxi_numero,
                    formData.immatriculation,
                    formData.type_marque,
                    formData.couleur_vehicule
                ]
            );
            
            await db.execAsync('COMMIT');
            
            return result.lastInsertRowId;
        } catch (error) {
            const db = await this.getDatabase();
            await db.execAsync('ROLLBACK');
            console.error('Error creating UCV form:', error);
            throw error;
        }
    }

    async getAllForms(): Promise<UCVFormData[]> {
        try {
            const db = await this.getDatabase();
            let records: UCVFormData[] = [];
            
            await db.withTransactionAsync(async () => {
                const result = await db!.getAllAsync<UCVFormData>(`
                    SELECT * FROM ${this.tableName} ORDER BY created_at DESC
                `);
                
                if (result && Array.isArray(result)) {
                    records = result;
                }
            });
            
            return records;
        } catch (error) {
            console.error('Error fetching UCV forms:', error);
            throw error;
        }
    }

    async checkFormExists(airportTaxiRotationId: number): Promise<boolean> {
        try {
            const db = await this.getDatabase();
            
            const result = await db.getFirstAsync<{ count: number }>(`
                SELECT COUNT(*) as count FROM ${this.tableName} WHERE airport_taxi_rotation_id = ?
            `, [airportTaxiRotationId]);
            
            return (result?.count ?? 0) > 0;
        } catch (error) {
            console.error('Error checking if form exists:', error);
            throw error;
        }
    }

    async getFormByRotationId(airportTaxiRotationId: number): Promise<UCVFormData | null> {
        try {
            const db = await this.getDatabase();
            let record: UCVFormData | null = null;
            
            await db.withTransactionAsync(async () => {
                const result = await db!.getFirstAsync<UCVFormData>(`
                    SELECT * FROM ${this.tableName} WHERE airport_taxi_rotation_id = ?
                `, [airportTaxiRotationId]);
                
                record = result || null;
            });
            
            return record;
        } catch (error) {
            console.error('Error fetching UCV form by rotation ID:', error);
            throw error;
        }
    }

    async updateForm(id: number, formData: UCVFormData): Promise<boolean> {
        try {
            const db = await this.getDatabase();
            let success = false;
            
            await db.withTransactionAsync(async () => {
                await db!.runAsync(`
                    UPDATE ${this.tableName} SET
                        airport_taxi_rotation_id = ?,
                        station = ?,
                        nom = ?,
                        prenom = ?,
                        role = ?,
                        chauffeur_nom = ?,
                        chauffeur_prenom = ?,
                        date_naissance = ?,
                        lieu_naissance = ?,
                        domicile = ?,
                        occupation = ?,
                        document_releve = ?,
                        carte_pro_num = ?,
                        autorisation_num = ?,
                        validite_autorisation = ?,
                        observation = ?,
                        taxi_numero = ?,
                        immatriculation = ?,
                        type_marque = ?,
                        couleur_vehicule = ?
                    WHERE id = ?
                `, [
                    formData.airprt_taxi_rotation_id,
                    formData.station,
                    formData.nom,
                    formData.prenom,
                    formData.role,
                    formData.chauffeur_nom,
                    formData.chauffeur_prenom,
                    formData.date_naissance,
                    formData.lieu_naissance,
                    formData.domicile,
                    formData.occupation,
                    formData.document_releve,
                    formData.carte_pro_num,
                    formData.autorisation_num,
                    formData.validite_autorisation,
                    formData.observation,
                    formData.taxi_numero,
                    formData.immatriculation,
                    formData.type_marque,
                    formData.couleur_vehicule,
                    id
                ]);
                
                success = true;
            });
            
            return success;
        } catch (error) {
            console.error(`Error updating UCV form with id ${id}:`, error);
            throw error;
        }
    }

    async deleteForm(id: number): Promise<boolean> {
        try {
            const db = await this.getDatabase();
            let success = false;
            
            await db.withTransactionAsync(async () => {
                // First delete related records from assistant table
                await db!.runAsync(`
                    DELETE FROM Assistants WHERE ucv_form_id = ?
                `, [id]);
                
                // Then delete relationship records from UCV_Form_Faults
                await db!.runAsync(`
                    DELETE FROM UCV_Form_Faults WHERE ucv_form_id = ?
                `, [id]);
                
                // Finally delete the form itself
                await db!.runAsync(`
                    DELETE FROM ${this.tableName} WHERE id = ?
                `, [id]);
                
                success = true;
            });
            
            return success;
        } catch (error) {
            console.error(`Error deleting UCV form with id ${id}:`, error);
            throw error;
        }
    }
}

const ucvFormService = new UCVFormService();

export default ucvFormService;