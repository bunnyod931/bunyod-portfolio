# Bunyod Samandarov — Academic Portfolio

A modern, responsive academic portfolio with a private admin panel. The public site is static and fast; Supabase provides the editable database, login, and file uploads. Hosting can remain free on Netlify, Vercel, or GitHub Pages, and Supabase has a free tier suitable for a personal portfolio.

## 1. Preview immediately
Open `index.html` in a browser. It already contains starter information and the supplied profile photo. The admin panel needs Supabase before editing can persist online.

## 2. Create the free backend (Supabase)
1. Create a free project at Supabase.
2. Open **SQL Editor** and run all of `supabase-setup.sql`.
3. In **Authentication > Users**, create your admin user with your email and a strong password.
4. In **Authentication > Providers > Email**, disable public sign-ups after your account exists. This ensures only you can become an authenticated editor.
5. In **Project Settings > API**, copy your Project URL and anon/public key.
6. Open `config.js` and replace `YOUR_SUPABASE_URL` and `YOUR_SUPABASE_ANON_KEY`.

## 3. Use the admin panel
Open `admin.html`, sign in, then use:
- **Profile** — edit name, title, DSc degree, bio, research text, email, location, and CV link.
- **Experience** — add/edit/delete jobs and education.
- **Publications** — add/edit/delete papers and hide drafts from the public site.
- **Documents** — upload CVs, certificates, PDFs, and images. Copy the generated public URL and paste it into the relevant field.

Changes appear on the public site after refresh. No code editing is needed for normal content updates.

## 4. Publish free on Netlify
Simplest route:
1. Log in to Netlify.
2. Create a new site using manual deployment / drag-and-drop.
3. Upload the whole `bunyod_portfolio` folder (or a ZIP of it).
4. Netlify gives you a free `something.netlify.app` address.
5. In **Domain management**, change the free site name if the desired name is available.

For future code/design changes, upload the updated folder again. Normal text/publication/photo changes should be done in the admin panel instead.

## 5. Security notes
- The Supabase anon key is safe to place in a public frontend when Row Level Security is enabled; the SQL script enables it.
- Keep public account registration disabled after creating your own user.
- Use a strong password for your admin account.

## 6. Suggested next upgrades
The structure is ready for a Teaching page, News/Updates, Gallery, Projects, awards/certificates, social links (Google Scholar, ORCID, Scopus, ResearchGate, LinkedIn), multilingual English/Uzbek/Russian content, dark/light mode, and a custom domain later.
