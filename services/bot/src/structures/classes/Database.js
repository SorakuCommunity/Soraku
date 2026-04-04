/**
 * SupabaseAdapter — mengganti BetterSQLite3
 * Interface async yang compatible dengan semua repo Soraku
 */
import { createClient } from "@supabase/supabase-js";
import { logger } from "#utils/logger";

let _client = null;

export function getSupabase() {
  if (_client) return _client;
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_KEY;
  if (!url || !key)
    throw new Error("SUPABASE_URL atau SUPABASE_KEY belum diset");
  _client = createClient(url.startsWith("http") ? url : "https://" + url, key);
  return _client;
}

/** Schema helper: semua tabel bot di schema "bot" */
export const bot = () => getSupabase().schema("bot");
export const soraku = () => getSupabase().schema("soraku");

/**
 * Base class untuk semua repo — expose async interface
 * Tidak ada SQL parsing; setiap repo mengimplementasi sendiri pakai Supabase query builder
 */
export class Database {
  constructor() {
    this.sb = { bot, soraku, raw: getSupabase };
  }

  /** Upsert helper */
  async upsert(table, data, conflict) {
    const { data: r, error } = await bot()
      .from(table)
      .upsert(data, { onConflict: conflict })
      .select()
      .maybeSingle();
    if (error) {
      logger.error("DB", `upsert ${table}`, error);
      throw error;
    }
    return r;
  }

  /** Select one row */
  async findOne(table, filters = {}) {
    let q = bot().from(table).select("*");
    for (const [k, v] of Object.entries(filters)) q = q.eq(k, v);
    const { data, error } = await q.maybeSingle();
    if (error) {
      logger.error("DB", `findOne ${table}`, error);
      throw error;
    }
    return data;
  }

  /** Select many rows */
  async findAll(table, filters = {}) {
    let q = bot().from(table).select("*");
    for (const [k, v] of Object.entries(filters)) q = q.eq(k, v);
    const { data, error } = await q;
    if (error) {
      logger.error("DB", `findAll ${table}`, error);
      throw error;
    }
    return data ?? [];
  }

  /** Delete rows */
  async destroy(table, filters = {}) {
    let q = bot().from(table).delete();
    for (const [k, v] of Object.entries(filters)) q = q.eq(k, v);
    const { error } = await q;
    if (error) {
      logger.error("DB", `destroy ${table}`, error);
      throw error;
    }
  }

  /** Update rows */
  async update(table, data, filters = {}) {
    let q = bot().from(table).update(data);
    for (const [k, v] of Object.entries(filters)) q = q.eq(k, v);
    const { error } = await q;
    if (error) {
      logger.error("DB", `update ${table}`, error);
      throw error;
    }
  }

  // Compat stubs — tidak ada SQLite file di Supabase
  close() {}
  initTable() {}
}
