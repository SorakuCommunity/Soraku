-- Blog v2: Views, Likes, Comments
-- Date: 2026-03-18 | Author: Rey

-- ── Add viewcount to posts ─────────────────────────────────────────────────
ALTER TABLE soraku.posts
  ADD COLUMN IF NOT EXISTS viewcount  INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS likecount  INTEGER NOT NULL DEFAULT 0;

-- ── Table: post_likes ──────────────────────────────────────────────────────
<<<<<<< HEAD
CREATE TABLE IF NOT EXISTS soraku.postlikes (
=======
CREATE TABLE IF NOT EXISTS soraku.post_likes (
>>>>>>> 1170e9e (feat(blog): full overhaul - grid, markdown, likes, comments, share, views, Discord, services/api)
  id        UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  postid    UUID        NOT NULL REFERENCES soraku.posts(id) ON DELETE CASCADE,
  userid    UUID        REFERENCES soraku.users(id) ON DELETE SET NULL,
  ipaddr    TEXT,
  createdat TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_post_likes_post_user
<<<<<<< HEAD
  ON soraku.postlikes(postid, userid)
  WHERE userid IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_post_likes_postid ON soraku.postlikes(postid);

-- ── Table: post_comments ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS soraku.postcomments (
  id        UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  postid    UUID        NOT NULL REFERENCES soraku.posts(id) ON DELETE CASCADE,
  parentid  UUID        REFERENCES soraku.postcomments(id) ON DELETE CASCADE,
=======
  ON soraku.post_likes(postid, userid)
  WHERE userid IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_post_likes_postid ON soraku.post_likes(postid);

-- ── Table: post_comments ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS soraku.post_comments (
  id        UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  postid    UUID        NOT NULL REFERENCES soraku.posts(id) ON DELETE CASCADE,
  parentid  UUID        REFERENCES soraku.post_comments(id) ON DELETE CASCADE,
>>>>>>> 1170e9e (feat(blog): full overhaul - grid, markdown, likes, comments, share, views, Discord, services/api)
  userid    UUID        REFERENCES soraku.users(id) ON DELETE SET NULL,
  guestname TEXT,
  content   TEXT        NOT NULL,
  isdeleted BOOLEAN     NOT NULL DEFAULT false,
  createdat TIMESTAMPTZ NOT NULL DEFAULT now(),
  updatedat TIMESTAMPTZ NOT NULL DEFAULT now()
);

<<<<<<< HEAD
CREATE INDEX IF NOT EXISTS idx_post_comments_postid   ON soraku.postcomments(postid);
CREATE INDEX IF NOT EXISTS idx_post_comments_parentid ON soraku.postcomments(parentid);

-- ── RLS ───────────────────────────────────────────────────────────────────
ALTER TABLE soraku.postlikes    ENABLE ROW LEVEL SECURITY;
ALTER TABLE soraku.postcomments ENABLE ROW LEVEL SECURITY;

-- Likes: public bisa insert dan select
CREATE POLICY "post_likes_select" ON soraku.postlikes FOR SELECT USING (true);
CREATE POLICY "post_likes_insert" ON soraku.postlikes FOR INSERT WITH CHECK (true);
CREATE POLICY "post_likes_delete" ON soraku.postlikes FOR DELETE USING (auth.uid() = userid);

-- Comments: public bisa baca, auth insert
CREATE POLICY "post_comments_select" ON soraku.postcomments FOR SELECT USING (isdeleted = false);
CREATE POLICY "post_comments_insert" ON soraku.postcomments FOR INSERT WITH CHECK (true);
CREATE POLICY "post_comments_update" ON soraku.postcomments FOR UPDATE USING (auth.uid() = userid);

-- GRANT
GRANT ALL ON soraku.postlikes    TO service_role, authenticated, anon;
GRANT ALL ON soraku.postcomments TO service_role, authenticated, anon;
=======
CREATE INDEX IF NOT EXISTS idx_post_comments_postid   ON soraku.post_comments(postid);
CREATE INDEX IF NOT EXISTS idx_post_comments_parentid ON soraku.post_comments(parentid);

-- ── RLS ───────────────────────────────────────────────────────────────────
ALTER TABLE soraku.post_likes    ENABLE ROW LEVEL SECURITY;
ALTER TABLE soraku.post_comments ENABLE ROW LEVEL SECURITY;

-- Likes: public bisa insert dan select
CREATE POLICY "post_likes_select" ON soraku.post_likes FOR SELECT USING (true);
CREATE POLICY "post_likes_insert" ON soraku.post_likes FOR INSERT WITH CHECK (true);
CREATE POLICY "post_likes_delete" ON soraku.post_likes FOR DELETE USING (auth.uid() = userid);

-- Comments: public bisa baca, auth insert
CREATE POLICY "post_comments_select" ON soraku.post_comments FOR SELECT USING (isdeleted = false);
CREATE POLICY "post_comments_insert" ON soraku.post_comments FOR INSERT WITH CHECK (true);
CREATE POLICY "post_comments_update" ON soraku.post_comments FOR UPDATE USING (auth.uid() = userid);

-- GRANT
GRANT ALL ON soraku.post_likes    TO service_role, authenticated, anon;
GRANT ALL ON soraku.post_comments TO service_role, authenticated, anon;
>>>>>>> 1170e9e (feat(blog): full overhaul - grid, markdown, likes, comments, share, views, Discord, services/api)

INSERT INTO soraku._migrations (name, checksum)
VALUES ('20260318_blog_views_likes_comments', md5('blog_v2_v1'))
ON CONFLICT (name) DO NOTHING;
