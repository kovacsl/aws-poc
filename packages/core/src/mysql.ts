import { ConnectionString } from 'connection-string';
import mysql from "mysql2/promise";

export default {
  create: async (databaseUrl: string | undefined, record: any): Promise<any> => {
    const { hosts, path, user, password } = new ConnectionString(databaseUrl);

    const connection = await mysql.createConnection({
      host: hosts?.shift()?.name,
      port: hosts?.shift()?.port,
      user: user,
      password: password,
      database: path?.shift(),
    });

    try {
      const [results,] = await connection.execute(`
        INSERT INTO PATIENTS(first_name, last_name, gender, birthdate, email) 
        VALUES('${record?.firstName}', '${record?.lastName}', '${record?.gender}', '${record?.birthDate}', '${record?.email}')
      `, []);

      return results;
    } catch (err) {
      console.log(err);
    } finally {
      connection.destroy();
    }
  },
  update: async (databaseUrl: string | undefined, id: string, record: any): Promise<any> => {
    const { hosts, path, user, password } = new ConnectionString(databaseUrl);

    const connection = await mysql.createConnection({
      host: hosts?.shift()?.name,
      port: hosts?.shift()?.port,
      user: user,
      password: password,
      database: path?.shift(),
    });

    try {
      const [results,] = await connection.execute(`
        UPDATE PATIENTS
        SET  
          first_name = '${record?.firstName}', 
          last_name = '${record?.lastName}', 
          gender = '${record?.gender}', 
          birthdate = '${record?.birthDate}', 
          email = '${record?.email}',
          modifiedAt = CURRENT_TIMESTAMP
        WHERE patient_id = '${id}'`, []);

      return results;
    } catch (err) {
      console.log(err);
    } finally {
      connection.destroy();
    }
  },
  list: async (databaseUrl: string, limit: string | null = null, offset: string | null = null): Promise<any> => {
    const { hosts, path, user, password } = new ConnectionString(databaseUrl);

    const connection = await mysql.createConnection({
      host: hosts?.shift()?.name,
      port: hosts?.shift()?.port,
      user: user,
      password: password,
      database: path?.shift(),
    });

    try {
      const [results,] = await connection.query(`
        SELECT
          patient_id as "patientId",
          first_name as "firstName",
          last_name as "lastName",
          email,
          gender,
          birthdate as "birthDate", 
          count(*) OVER () AS "totalCount"
        FROM  (
          SELECT  
              patient_id,
              first_name,
              last_name,
              email,
              gender,
              birthdate,
              row_number() OVER (PARTITION BY  patient_id  ORDER BY first_name, last_name DESC ROWS UNBOUNDED PRECEDING) AS entity_rank
          FROM PATIENTS
        ) patients
        WHERE entity_rank = 1
        ORDER BY first_name, last_name DESC
        LIMIT  ${limit}
        OFFSET ${offset}
      `, []);

      return results;
    } catch (err) {
      console.log(err);
    } finally {
      connection.destroy();
    }
  },
  get: async (databaseUrl: string, id: string): Promise<any> => {
    const { hosts, path, user, password } = new ConnectionString(databaseUrl);

    const connection = await mysql.createConnection({
      host: hosts?.shift()?.name,
      port: hosts?.shift()?.port,
      user: user,
      password: password,
      database: path?.shift(),
    });

    try {
      const [rows,] = await connection.query(`
      SELECT 
        patient_id as "patientId",
        first_name as "firstName",
        last_name as "lastName",
        email,
        gender,
        birthdate as "birthDate"   
      FROM PATIENTS 
      WHERE patient_id = '${id}'`, []);

      return rows.shift();
    } catch (err) {
      console.log(err);
    } finally {
      connection.destroy();
    }
  },
  delete: async (databaseUrl: string, id: string): Promise<any> => {
    const { hosts, path, user, password } = new ConnectionString(databaseUrl);

    const connection = await mysql.createConnection({
      host: hosts?.shift()?.name,
      port: hosts?.shift()?.port,
      user: user,
      password: password,
      database: path?.shift(),
    });

    try {
      await connection.execute(`
        DELETE FROM PATIENTS WHERE patient_id = '${id}'`, []);

      return true;
    } catch (err) {
      console.log(err);
    } finally {
      connection.destroy();
    }
  }
}

