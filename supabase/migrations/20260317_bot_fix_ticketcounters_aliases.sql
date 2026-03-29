-- Fix: ticketcounters kolom DB panel_count/ticket_count
-- tapi bot code query panel_counter/ticket_counter
-- Solusi: GENERATED ALWAYS AS alias
-- Date   : 2026-03-17 | Author: Bubu | Applied: via Supabase MCP

ALTER TABLE bot.ticketcounters
  ADD COLUMN IF NOT EXISTS panel_counter INTEGER
    GENERATED ALWAYS AS (panel_count) STORED;

ALTER TABLE bot.ticketcounters
  ADD COLUMN IF NOT EXISTS ticket_counter INTEGER
    GENERATED ALWAYS AS (ticket_count) STORED;

INSERT INTO soraku._migrations (name, checksum)
VALUES ('20260317_bot_fix_ticketcounters_column_aliases', md5('ticketcounters_alias_v1'))
ON CONFLICT (name) DO NOTHING;
