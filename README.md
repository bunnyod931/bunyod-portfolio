# Bunyod Academic Portfolio — Version 2.6

This package upgrades Version 2.5 with a real Supabase-connected administrator panel.

## Already configured

- Supabase project URL and publishable key are stored in `config.js`.
- The publishable key is intended for browser use. Never place a Supabase secret/service-role key in this repository.
- Your existing Supabase database/RLS setup is compatible with this build.
- `admin.html` uses Supabase email/password authentication and verifies `public.is_site_admin()` before allowing edits.

## After uploading to GitHub

1. Replace the matching files in the existing `bunyod-portfolio` repository.
2. Commit to `main`.
3. Netlify will redeploy automatically.
4. Open `/admin.html` on your Netlify site.
5. Sign in with the admin email/password you created in Supabase.
6. Click **Initialize Version 2.5 content** once. It only seeds sections that are still empty; it does not replace existing rows.

## What the Admin panel manages

- Profile & homepage
- Experience
- Education
- Awards & Scholarships
- Teaching
- Publications
- Research Projects
- PhD Journey
- Research Profiles

The public website keeps the Version 2.5 static content as a fallback, then replaces sections with Supabase data whenever database rows exist.

## Photos and CV

Version 2.6 supports photo/CV URLs and local asset paths (for example `assets/profile.jpg`). Direct file uploads into Supabase Storage are not enabled in this build yet. This keeps the current admin setup secure without adding storage policies before review.

## Security

- RLS remains enabled.
- Public users get read-only access to published content.
- Only the user listed in `site_admins` can write through the Admin panel.
- Never expose database passwords, secret keys, or service-role keys.
