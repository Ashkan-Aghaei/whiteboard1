import type { DBSchema, IDBPDatabase } from "idb";
import { openDB } from "idb";

export type IContent = Array<
  | {
      type: "text";
      text: string;
    }
  | {
      type: "image_url";
      image_url: {
        url: string;
      };
    }
>;

export type Role = "user" | "assistant";

export interface IChat {
  id?: number;
  uid: string;
  role: Role;
  // content: IContent;
  askText: string;
  status?: "perform" | "done";
}

const DB_NAME = "ai_whiteboard-chat-database";
const STORE_NAME = "ai_whiteboard-chat-store";

interface MyDB extends DBSchema {
  [STORE_NAME]: {
    key: number;
    value: IChat;
  };
}

export async function initDB(): Promise<IDBPDatabase<MyDB>> {
  const db = await openDB<MyDB>(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, {
          keyPath: "id",
          autoIncrement: true,
        });
      }
    },
  });
  return db;
}
let db: IDBPDatabase<MyDB> | null = null;

async function getDB(): Promise<IDBPDatabase<MyDB>> {
  if (!db) {
    db = await initDB();
  }
  return db;
}

export async function addChatData(data: IChat) {
  const db = await getDB();
  const tx = db.transaction(STORE_NAME, "readwrite");
  const store = tx.objectStore(STORE_NAME);
  const id = await store.add(data);
  await tx.done;
  // 返回带有新生成 id 的数据
  return { ...data, id };
}

export async function getChatData(): Promise<IChat[]> {
  const db = await getDB();
  const store = db.transaction(STORE_NAME, "readonly").objectStore(STORE_NAME);
  const allRecords = await store.getAll();
  return allRecords;
}

export async function deleteChatData(id: number): Promise<void> {
  const db = await getDB();
  const tx = db.transaction(STORE_NAME, "readwrite");
  await tx.objectStore(STORE_NAME).delete(id);
  await tx.done;
}

export async function clearAllChatData(): Promise<void> {
  const db = await getDB();
  const tx = db.transaction(STORE_NAME, "readwrite");
  const store = tx.objectStore(STORE_NAME);
  await store.clear();
  await tx.done;
}

export async function updateChatData(
  id: number,
  data: Partial<IChat>,
): Promise<IChat | null> {
  const db = await getDB();
  const tx = db.transaction(STORE_NAME, "readwrite");
  const store = tx.objectStore(STORE_NAME);
  const existingData = await store.get(id);

  if (!existingData) {
    await tx.done;
    return null;
  }
  const updatedData = { ...existingData, ...data };
  // 更新数据
  await store.put(updatedData);
  await tx.done;
  return updatedData;
}
