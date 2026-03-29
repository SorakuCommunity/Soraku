-- ================================================================
-- follows table — user follow system
-- ================================================================
CREATE TABLE IF NOT EXISTS soraku.follows (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  followerid  UUID NOT NULL REFERENCES soraku.users(id) ON DELETE CASCADE,
  followingid UUID NOT NULL REFERENCES soraku.users(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(followerid, followingid),
  CHECK (followerid <> followingid)
);

CREATE INDEX IF NOT EXISTS idx_follows_follower  ON soraku.follows(followerid);
CREATE INDEX IF NOT EXISTS idx_follows_following ON soraku.follows(followingid);

ALTER TABLE soraku.follows ENABLE ROW LEVEL SECURITY;
CREATE POLICY "follows_read"   ON soraku.follows FOR SELECT USING (true);
CREATE POLICY "follows_insert" ON soraku.follows FOR INSERT WITH CHECK (auth.uid() = followerid);
CREATE POLICY "follows_delete" ON soraku.follows FOR DELETE USING (auth.uid() = followerid);
