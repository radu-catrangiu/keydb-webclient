import { getFlatPromise } from '../utils'
import { randomUUID } from 'crypto'
import { Redis } from 'ioredis'
import path from 'path';
import fs from 'fs/promises'
import { fileURLToPath } from 'url';

let dbVersion = 0;
const db = new Map();

/**
 * @typedef ConnectionDetails
 * @property {string} [slug]
 * @property {string} label
 * @property {string} host
 * @property {number} port
 * @property {string} [username]
 * @property {string} [password]
 * @property {Redis} [redisClient]
 */

/**
 * 
 * @param {string} slug 
 * @returns {Promise<ConnectionDetails>}
 */
export async function getConnection(slug) {
    const connectionDetails = db.get(slug);

    if (!connectionDetails) {
        throw new Error(`Connection ${slug} doesn't exist.`);
    }

    return connectionDetails;
}


/**
 * 
 * @returns {Promise<ConnectionDetails[]>}
 */
export async function getConnections() {
    const connections = [...db.values()];

    const filtered = connections.map((c) => ({
        slug: c.slug,
        label: c.label,
        host: c.host,
        port: c.port,
        username: c.username,
    }));

    return filtered;
}

/**
 * 
 * @param {ConnectionDetails} details 
 */
function validateDetails(details) {
    const {
        label,
        host,
        port,
    } = details;

    if (!label || label.length < 3) {
        throw new Error("[ConnectionDetails] The `label` must be at least 3 characters.");
    }

    if (!host || host.length < 3) {
        throw new Error("[ConnectionDetails] The `host` must be at least 3 characters.");
    }

    if (!port) {
        throw new Error("[ConnectionDetails] The `port` is required.");
    }
}

/**
 * 
 * @param {ConnectionDetails} details 
 * @returns {Promise<Redis>}
 */
async function getRedisConnection(details) {
    const {
        host,
        port,
        username,
        password
    } = details;

    /**
     * @type {import('ioredis').RedisOptions}
     */
    const redisOptions = {
        host,
        port,
    };

    if (username && username.length > 0) {
        redisOptions.username = username;
    }

    if (password && password.length > 0) {
        redisOptions.password = password;
    }

    const client = new Redis(details);

    const {
        promise,
        resolve,
        reject,
    } = getFlatPromise();

    client.on("connect", () => {
        resolve(client);
    })

    client.on("error", (err) => {
        reject(err);
    });

    return promise;
}

/**
 * 
 * @param {ConnectionDetails} details
 * @param {boolean} [skipBackup]
 * @param {string} [existingSlug]
 * @throws {Error}
 */
export async function createConnection(details, skipBackup = false, existingSlug) {
    validateDetails(details);

    const slug = existingSlug ?? randomUUID();
    const {
        label,
        host,
        port,
        username,
        password
    } = details;

    /**
     * @type {ConnectionDetails}
     */
    const newConnection = {
        label,
        slug,
        host,
        port,
        username,
        password,
    };

    newConnection.redisClient = await getRedisConnection(newConnection);

    db.set(slug, newConnection)
    if (!skipBackup) {
        dbVersion++;
        storeBackup();
    }
}

async function getSerializable() {
    /**
     * @type {ConnectionDetails[]}
     */
    const entries = [...db.values()];
    
    const connectionsDetails = entries.map(({ slug, host, port, label, username, password }) => ({ slug, host, port, label, username, password }));

    return {
        dbVersion,
        connectionsDetails,
    };
}

const backupLocation = "/.temp/connections.backup";
async function storeBackup() {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const filePath = path.join(__dirname, backupLocation);
    const dirPath = path.dirname(filePath);
    const serializable = await getSerializable();
    const data = JSON.stringify(serializable);

    try {
        await fs.mkdir(dirPath, { recursive: true });
        await fs.writeFile(filePath, data);
    } catch (error) {
        console.error(`Error writing file "${filePath}":`, error);
    }

}

async function getBackup() {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const filePath = path.join(__dirname, backupLocation);
    try {
        await fs.access(filePath, fs.constants.F_OK);
        const fileContent = await fs.readFile(filePath, 'utf8');
        return fileContent;
    } catch (error) {
        return null;
    }
}


export async function restoreConnections() {
    const backupStr = await getBackup();
    
    if (!backupStr) {
        return;
    }

    let backup;
    try {
        backup = JSON.parse(backupStr);
    } catch (error) {
        console.error("Error parsing the backup file:", error);
        return;
    }

    const { connectionsDetails } = backup;
    if (!connectionsDetails?.length) {
        return;
    }

    for (const connectionDetails of connectionsDetails) {
        try {
            await createConnection(connectionDetails, false, connectionDetails.slug);
        } catch (error) {
            console.error(`Error initializing connection ${connectionDetails.slug}:`, error);
        }
    }
}
