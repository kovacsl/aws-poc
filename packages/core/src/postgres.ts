import pg from 'pg';

const { Client } = pg;

export default {
  create: async (databaseUrl: string | undefined, record: any): Promise<any> => {
    const client = new Client({
      connectionString: databaseUrl,
      ssl: {
        rejectUnauthorized: false,
      }
    });

    const query = {
      // give the query a unique name
      name: 'create-patient',
      text: `
            INSERT INTO patients(first_name, last_name, gender, birthdate, email) 
            VALUES($1, $2, $3, $4, $5) RETURNING *`,
      values: [record?.firstName, record?.lastName, record?.gender, record?.birthDate, record?.email],
    }

    try {
      await client.connect();

      const { rows } = await client.query(query);

      return rows.shift();
    } catch (err) {
      console.log(err);
    } finally {
      await client.end()
    }
  },
  update: async (databaseUrl: string | undefined, id: string, record: any): Promise<any> => {
    const client = new Client({
      connectionString: databaseUrl,
      ssl: {
        rejectUnauthorized: false,
      }
    });

    const query = {
      // give the query a unique name
      name: 'create-patient',
      text: `
            UPDATE patients
            SET  
                first_name = $2, 
                last_name = $3, 
                gender = $4, 
                birthdate = $5, 
                email = $6,
                modifiedAt = NOW() 
            WHERE patient_id = $1 RETURNING *`,
      values: [id, record?.firstName, record?.lastName, record?.gender, record?.birthDate, record?.email],
    }

    try {
      await client.connect();

      const { rows } = await client.query(query);

      return rows.shift();
    } catch (err) {
      console.log(err);
    } finally {
      await client.end()
    }
  },
  list: async (databaseUrl: string, limit: string | null = null, offset: string | null = null): Promise<any> => {
    const client = new Client({
      connectionString: databaseUrl,
      ssl: {
        rejectUnauthorized: false,
      }
    });

    const query = {
      // give the query a unique name
      name: 'fetch-patients',
      text: `
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
          FROM patients
        ) patients
        WHERE entity_rank = 1
        ORDER BY first_name, last_name DESC
        LIMIT  $1
        OFFSET $2
    `,
      values: [limit, offset],
    }

    try {
      await client.connect();

      const { rows } = await client.query(query);

      return rows;
    } catch (err) {
      console.log(err);
    } finally {
      await client.end()
    }
  },
  get: async (databaseUrl: string, id: string): Promise<any> => {
    const client = new Client({
      connectionString: databaseUrl,
      ssl: {
        rejectUnauthorized: false,
      }
    });

    const query = {
      // give the query a unique name
      name: 'get-patient',
      text: ` 
            SELECT 
                patient_id as "patientId",
                first_name as "firstName",
                last_name as "lastName",
                email,
                gender,
                birthdate as "birthDate"   
            FROM patients 
            WHERE patient_id = $1`,
      values: [id],
    }

    try {
      await client.connect();

      const { rows } = await client.query(query);

      return rows.shift();
    } catch (err) {
      console.log(err);
    } finally {
      await client.end()
    }
  },
  delete: async (databaseUrl: string, id: string): Promise<any> => {
    const client = new Client({
      connectionString: databaseUrl,
      ssl: {
        rejectUnauthorized: false,
      }
    });

    const query = {
      // give the query a unique name
      name: 'delete-patient',
      text: 'DELETE FROM patients WHERE patient_id = $1',
      values: [id],
    }

    try {
      await client.connect();

      await client.query(query);

      return true;
    } catch (err) {
      console.log(err);
    } finally {
      await client.end()
    }
  }
}

