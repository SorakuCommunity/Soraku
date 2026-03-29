-- Migration: auto-create soraku.users on auth signup
-- Jaring pengaman: pastikan setiap user auth.users punya row di soraku.users
-- Tanpa ini, jika upsert di callback/register gagal → profile error 500

CREATE OR REPLACE FUNCTION soraku.handle_new_auth_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = soraku, auth, public
AS $$
DECLARE
  v_username    TEXT;
  v_displayname TEXT;
  v_avatarurl   TEXT;
BEGIN
  -- Ambil username dari OAuth metadata atau fallback ke email prefix
  v_username := COALESCE(
    NEW.raw_user_meta_data->>'user_name',
    NEW.raw_user_meta_data->>'preferred_username',
    LOWER(REPLACE(COALESCE(NEW.raw_user_meta_data->>'name', ''), ' ', '_')),
    SPLIT_PART(NEW.email, '@', 1)
  );
  -- Normalize: lowercase, strip karakter invalid, max 30 char
  v_username := LOWER(REGEXP_REPLACE(LEFT(v_username, 30), '[^a-z0-9_]', '', 'g'));
  IF v_username = '' THEN
    v_username := SPLIT_PART(NEW.email, '@', 1);
  END IF;

  v_displayname := COALESCE(
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'name',
    v_username
  );
  v_avatarurl := COALESCE(
    NEW.raw_user_meta_data->>'avatar_url',
    NEW.raw_user_meta_data->>'picture'
  );

  -- ON CONFLICT DO NOTHING: jika callback sudah insert lebih dulu, skip
  INSERT INTO soraku.users (
    id, username, displayname, avatarurl,
    role, isprivate, isbanned,
    sociallinks, createdat, updatedat
  )
  VALUES (
    NEW.id,
    v_username,
    LEFT(v_displayname, 50),
    v_avatarurl,
    'USER'::soraku.user_role,
    false,
    false,
    '{}'::jsonb,
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$$;

-- Trigger di auth.users (schema publik Supabase)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION soraku.handle_new_auth_user();
