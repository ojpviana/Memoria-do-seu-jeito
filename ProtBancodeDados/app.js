import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

async function criarEPopularTabelaUsuarios(nome, sobrenome) {
    const db = await open({
        filename: './banco.db',
        driver: sqlite3.Database,
    });

    try {
        await db.run(
            `CREATE TABLE IF NOT EXISTS usuarios (
                id INTEGER PRIMARY KEY,
                nome TEXT,
                sobrenome TEXT
            )`
        );

        await db.run( `INSERT INTO usuarios (nome, sobrenome) VALUES (?,?)`, [
                nome, 
                sobrenome,
        ]);

        console.log("Tabela 'usuarios' criada ou já existe!");
    } catch (error) {
        console.error("Erro ao criar a tabela:", error);
    }
}

criarEPopularTabelaUsuarios('Augusto', 'Braz');
