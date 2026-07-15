import * as ExpoSQLite from "expo-sqlite";
import { Platform } from "react-native";

type SqlResultRow = Record<string, unknown>;

interface SqlResultSet {
  rows: {
    length: number;
    item: (index: number) => SqlResultRow | null;
  };
  insertId?: number;
}

let db: any = null;

if (Platform.OS !== "web") {
  const openDatabase =
    typeof (ExpoSQLite as any).openDatabaseSync === "function"
      ? (ExpoSQLite as any).openDatabaseSync
      : typeof (ExpoSQLite as any).openDatabase === "function"
        ? (ExpoSQLite as any).openDatabase
        : null;

  if (!openDatabase) {
    throw new Error("expo-sqlite does not expose a supported database API");
  }

  db = openDatabase("sirmo.db");
}

export interface Candidate {
  id?: number;
  nome: string;
  email: string;
  telefone: string;
  cpf: string;
  dataNascimento: string;
  documentoTipo: string;
  documentoNumero: string;
  documentoFotoUri: string;
  naturalidade?: string;
  enderecoResidencial?: string;
  sexo?: string;
  altura?: string;
  createdAt?: string;
}

export interface DocumentRecord {
  id?: number;
  candidateId: number;
  tipo: string;
  status: string;
  uri: string;
  createdAt?: string;
}

const executeSql = async (
  sql: string,
  params: (string | number)[] = [],
): Promise<SqlResultSet> => {
  if (Platform.OS === "web") {
    // Not using SQLite on web; no-op placeholder to keep signatures consistent
    return Promise.resolve({
      rows: { length: 0, item: (_: number) => null },
      insertId: undefined,
    });
  }

  if (!db) {
    throw new Error("Database connection was not initialized");
  }

  const normalizedSql = sql.trim().toUpperCase();
  const isSelect =
    normalizedSql.startsWith("SELECT") || normalizedSql.startsWith("PRAGMA");

  if (typeof db.runAsync === "function") {
    if (isSelect) {
      const rows = await db.getAllAsync<SqlResultRow>(sql, params);
      return {
        rows: {
          length: rows.length,
          item: (index: number) => rows[index] ?? null,
        },
        insertId: undefined,
      };
    }

    const result = await db.runAsync(sql, params);
    return {
      rows: { length: 0, item: (_: number) => null },
      insertId: result?.lastInsertRowId ?? result?.insertId,
    };
  }

  if (typeof db.transaction === "function") {
    return new Promise<SqlResultSet>((resolve, reject) => {
      db.transaction((tx: any) => {
        tx.executeSql(
          sql,
          params,
          (_: any, result: any) => {
            const rows = result?.rows ?? { length: 0, item: () => null };
            resolve({
              rows: {
                length: rows.length,
                item: (index: number) => rows.item(index),
              },
              insertId: result?.insertId,
            });
          },
          (_: any, error: any) => {
            reject(error);
            return false;
          },
        );
      }, reject);
    });
  }

  throw new Error("Database connection does not support SQL execution");
};

export const initDatabase = async (): Promise<void> => {
  if (Platform.OS === "web") {
    // nothing to initialize for the simple web fallback
    return;
  }

  await executeSql("PRAGMA foreign_keys = ON;");
  await executeSql(
    `CREATE TABLE IF NOT EXISTS candidates (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      email TEXT NOT NULL,
      telefone TEXT NOT NULL,
      cpf TEXT NOT NULL,
      dataNascimento TEXT NOT NULL,
      documentoTipo TEXT NOT NULL,
      documentoNumero TEXT NOT NULL,
      documentoFotoUri TEXT,
      naturalidade TEXT,
      enderecoResidencial TEXT,
      sexo TEXT,
      altura TEXT,
      createdAt TEXT DEFAULT (datetime('now'))
    );`,
  );
  await executeSql(
    `ALTER TABLE candidates ADD COLUMN naturalidade TEXT;`,
  ).catch(() => undefined);
  await executeSql(
    `ALTER TABLE candidates ADD COLUMN enderecoResidencial TEXT;`,
  ).catch(() => undefined);
  await executeSql(`ALTER TABLE candidates ADD COLUMN sexo TEXT;`).catch(
    () => undefined,
  );
  await executeSql(`ALTER TABLE candidates ADD COLUMN altura TEXT;`).catch(
    () => undefined,
  );
  await executeSql(
    `CREATE TABLE IF NOT EXISTS documents (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      candidateId INTEGER NOT NULL,
      tipo TEXT NOT NULL,
      status TEXT NOT NULL,
      uri TEXT,
      createdAt TEXT DEFAULT (datetime('now')),
      FOREIGN KEY(candidateId) REFERENCES candidates(id) ON DELETE CASCADE
    );`,
  );
};

export const insertCandidate = async (
  candidate: Candidate,
): Promise<number> => {
  if (Platform.OS === "web") {
    const key = "sirmo_candidates";
    const raw = localStorage.getItem(key);
    const list: Candidate[] = raw ? JSON.parse(raw) : [];
    const id = (list.length > 0 ? (list[list.length - 1].id ?? 0) : 0) + 1;
    const record: Candidate = {
      ...candidate,
      id,
      createdAt: new Date().toISOString(),
    };
    list.push(record);
    localStorage.setItem(key, JSON.stringify(list));
    return id;
  }

  const result = await executeSql(
    `INSERT INTO candidates (nome, email, telefone, cpf, dataNascimento, documentoTipo, documentoNumero, documentoFotoUri, naturalidade, enderecoResidencial, sexo, altura) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
    [
      candidate.nome,
      candidate.email,
      candidate.telefone,
      candidate.cpf,
      candidate.dataNascimento,
      candidate.documentoTipo,
      candidate.documentoNumero,
      candidate.documentoFotoUri,
      candidate.naturalidade ?? "",
      candidate.enderecoResidencial ?? "",
      candidate.sexo ?? "",
      candidate.altura ?? "",
    ],
  );

  return result.insertId as number;
};

export const insertDocument = async (
  document: DocumentRecord,
): Promise<number> => {
  if (Platform.OS === "web") {
    const key = "sirmo_documents";
    const raw = localStorage.getItem(key);
    const list: DocumentRecord[] = raw ? JSON.parse(raw) : [];
    const id = (list.length > 0 ? (list[list.length - 1].id ?? 0) : 0) + 1;
    const record: DocumentRecord = {
      ...document,
      id,
      createdAt: new Date().toISOString(),
    };
    list.push(record);
    localStorage.setItem(key, JSON.stringify(list));
    return id;
  }

  const result = await executeSql(
    `INSERT INTO documents (candidateId, tipo, status, uri) VALUES (?, ?, ?, ?);`,
    [document.candidateId, document.tipo, document.status, document.uri],
  );

  return result.insertId as number;
};

export const getAllCandidates = async (): Promise<Candidate[]> => {
  if (Platform.OS === "web") {
    const raw = localStorage.getItem("sirmo_candidates");
    const list: Candidate[] = raw ? JSON.parse(raw) : [];
    // return in reverse chronological order
    return list.sort((a, b) =>
      (b.createdAt || "").localeCompare(a.createdAt || ""),
    );
  }

  const result = await executeSql(
    `SELECT * FROM candidates ORDER BY createdAt DESC;`,
  );

  const candidates: Candidate[] = [];
  const rows = result.rows;

  for (let i = 0; i < rows.length; i += 1) {
    candidates.push(rows.item(i));
  }

  return candidates;
};

export const getDocumentsByCandidateId = async (
  candidateId: number,
): Promise<DocumentRecord[]> => {
  if (Platform.OS === "web") {
    const raw = localStorage.getItem("sirmo_documents");
    const list: DocumentRecord[] = raw ? JSON.parse(raw) : [];
    return list
      .filter((d) => d.candidateId === candidateId)
      .sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));
  }

  const result = await executeSql(
    `SELECT * FROM documents WHERE candidateId = ? ORDER BY createdAt DESC;`,
    [candidateId],
  );

  const documents: DocumentRecord[] = [];
  const rows = result.rows;

  for (let i = 0; i < rows.length; i += 1) {
    documents.push(rows.item(i));
  }

  return documents;
};

export const getCandidateById = async (
  id: number,
): Promise<Candidate | null> => {
  if (Platform.OS === "web") {
    const raw = localStorage.getItem("sirmo_candidates");
    const list: Candidate[] = raw ? JSON.parse(raw) : [];
    return list.find((c) => c.id === id) ?? null;
  }

  const result = await executeSql(
    `SELECT * FROM candidates WHERE id = ? LIMIT 1;`,
    [id],
  );
  if (result.rows.length === 0) return null;
  return result.rows.item(0);
};

export const updateCandidate = async (candidate: Candidate): Promise<void> => {
  if (Platform.OS === "web") {
    const key = "sirmo_candidates";
    const raw = localStorage.getItem(key);
    const list: Candidate[] = raw ? JSON.parse(raw) : [];
    const idx = list.findIndex((c) => c.id === candidate.id);
    if (idx >= 0) {
      list[idx] = { ...list[idx], ...candidate };
      localStorage.setItem(key, JSON.stringify(list));
    }
    return;
  }

  await executeSql(
    `UPDATE candidates SET nome = ?, email = ?, telefone = ?, cpf = ?, dataNascimento = ?, documentoTipo = ?, documentoNumero = ?, documentoFotoUri = ?, naturalidade = ?, enderecoResidencial = ?, sexo = ?, altura = ? WHERE id = ?;`,
    [
      candidate.nome,
      candidate.email,
      candidate.telefone,
      candidate.cpf,
      candidate.dataNascimento,
      candidate.documentoTipo,
      candidate.documentoNumero,
      candidate.documentoFotoUri,
      candidate.naturalidade ?? "",
      candidate.enderecoResidencial ?? "",
      candidate.sexo ?? "",
      candidate.altura ?? "",
      candidate.id,
    ],
  );
};

export const deleteCandidate = async (id: number): Promise<void> => {
  if (Platform.OS === "web") {
    const key = "sirmo_candidates";
    const raw = localStorage.getItem(key);
    const list: Candidate[] = raw ? JSON.parse(raw) : [];
    const filtered = list.filter((c) => c.id !== id);
    localStorage.setItem(key, JSON.stringify(filtered));

    // also remove documents for the candidate
    const docKey = "sirmo_documents";
    const rawDocs = localStorage.getItem(docKey);
    const docs: DocumentRecord[] = rawDocs ? JSON.parse(rawDocs) : [];
    const filteredDocs = docs.filter((d) => d.candidateId !== id);
    localStorage.setItem(docKey, JSON.stringify(filteredDocs));
    return;
  }

  await executeSql(`DELETE FROM documents WHERE candidateId = ?;`, [id]);
  await executeSql(`DELETE FROM candidates WHERE id = ?;`, [id]);
};

export const getDocumentById = async (
  id: number,
): Promise<DocumentRecord | null> => {
  if (Platform.OS === "web") {
    const raw = localStorage.getItem("sirmo_documents");
    const list: DocumentRecord[] = raw ? JSON.parse(raw) : [];
    return list.find((d) => d.id === id) ?? null;
  }

  const result = await executeSql(
    `SELECT * FROM documents WHERE id = ? LIMIT 1;`,
    [id],
  );
  if (result.rows.length === 0) return null;
  return result.rows.item(0);
};

export const updateDocument = async (
  document: DocumentRecord,
): Promise<void> => {
  if (Platform.OS === "web") {
    const key = "sirmo_documents";
    const raw = localStorage.getItem(key);
    const list: DocumentRecord[] = raw ? JSON.parse(raw) : [];
    const idx = list.findIndex((d) => d.id === document.id);
    if (idx >= 0) {
      list[idx] = { ...list[idx], ...document };
      localStorage.setItem(key, JSON.stringify(list));
    }
    return;
  }

  await executeSql(
    `UPDATE documents SET tipo = ?, status = ?, uri = ? WHERE id = ?;`,
    [document.tipo, document.status, document.uri, document.id],
  );
};

export const deleteDocument = async (id: number): Promise<void> => {
  if (Platform.OS === "web") {
    const key = "sirmo_documents";
    const raw = localStorage.getItem(key);
    const list: DocumentRecord[] = raw ? JSON.parse(raw) : [];
    const filtered = list.filter((d) => d.id !== id);
    localStorage.setItem(key, JSON.stringify(filtered));
    return;
  }

  await executeSql(`DELETE FROM documents WHERE id = ?;`, [id]);
};
