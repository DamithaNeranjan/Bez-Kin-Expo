import { addDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";
import { seedAuditLogs } from "../data/seedData";
import type { AuditLog } from "../types/catalog";

export type AuditLogInput = Omit<AuditLog, "id" | "createdAt">;

export async function getAuditLogs(): Promise<AuditLog[]> {
  if (!db) {
    return seedAuditLogs;
  }

  const snapshot = await getDocs(collection(db, "auditLogs"));
  return snapshot.docs
    .map((auditDoc) => ({ id: auditDoc.id, ...auditDoc.data() }) as AuditLog)
    .sort((first, second) => new Date(second.createdAt).getTime() - new Date(first.createdAt).getTime());
}

export async function recordAuditLog(input: AuditLogInput) {
  if (!db) {
    return;
  }

  await addDoc(collection(db, "auditLogs"), {
    ...input,
    createdAt: new Date().toISOString()
  });
}

export function buildActor(user: { uid: string; email: string | null; displayName: string | null } | null, profile?: { email?: string; name?: string } | null) {
  return {
    actorUid: user?.uid ?? "unknown",
    actorEmail: profile?.email ?? user?.email ?? "Unknown email",
    actorName: profile?.name ?? user?.displayName ?? user?.email ?? "Unknown user"
  };
}
