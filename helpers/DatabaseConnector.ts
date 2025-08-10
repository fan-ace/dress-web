import { Client as SSHClient } from 'ssh2';
import mysql from 'mysql2/promise';

export class DatabaseConnector {
  private sshClient: SSHClient;
  private dbConnection: mysql.Connection | null = null;

  constructor(
    private sshConfig: {
      host: string;
      port: number;
      username: string;
      privateKey: string;
    },
    private dbConfig: {
      host: string;
      port: number;
      user: string;
      password: string;
      database: string;
    }
  ) {
    this.sshClient = new SSHClient();
  }

  // Set up SSH and DB connection
  async connect() {
    return new Promise<void>((resolve, reject) => {
      this.sshClient
        .on('ready', async () => {
          console.log('SSH connection established.');

          // Forward port through SSH
          this.sshClient.forwardOut(
            '127.0.0.1',
            0,
            this.dbConfig.host,
            this.dbConfig.port,
            async (err: any, stream: any) => {
              if (err) {
                reject(err);
                return;
              }

              // Connect to DB through stream
              try {
                this.dbConnection = await mysql.createConnection({
                  host: '127.0.0.1',
                  user: this.dbConfig.user,
                  password: this.dbConfig.password,
                  database: this.dbConfig.database,
                  stream: stream,
                });
                console.log('Database connection established.');
                resolve();
              } catch (dbErr) {
                reject(dbErr);
              }
            }
          );
        })
        .connect(this.sshConfig);

      this.sshClient.on('error', (err) => {
        reject(err);
      });
    });
  }

  // Execute SQL query
  async query(sql: string, params?: any[]) {
    if (!this.dbConnection) {
      throw new Error('Database connection is not established.');
    }
    return this.dbConnection.execute(sql, params);
  }

  // Close connection
  async close() {
    if (this.dbConnection) {
      await this.dbConnection.end();
      console.log('Database connection closed.');
    }
    this.sshClient.end();
    console.log('SSH connection closed.');
  }
};