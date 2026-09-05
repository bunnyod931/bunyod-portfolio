-- Run this entire script once in Supabase > SQL Editor.
create extension if not exists pgcrypto;

create table if not exists public.profile (
  id uuid primary key default gen_random_uuid(),
  first_name text, last_name text, title text, degree text,
  short_bio text, about text, research text, email text, location text,
  cv_url text, updated_at timestamptz default now()
);
create table if not exists public.experience (
  id uuid primary key default gen_random_uuid(), period text, role text,
  institution text, sort_order integer default 0
);
create table if not exists public.publications (
  id uuid primary key default gen_random_uuid(), year text, title text,
  authors text, venue text, url text, published boolean default true
);

alter table public.profile enable row level security;
alter table public.experience enable row level security;
alter table public.publications enable row level security;

create policy "Public read profile" on public.profile for select using (true);
create policy "Admin write profile" on public.profile for all to authenticated using (true) with check (true);
create policy "Public read experience" on public.experience for select using (true);
create policy "Admin write experience" on public.experience for all to authenticated using (true) with check (true);
create policy "Public read publications" on public.publications for select using (published = true or auth.role() = 'authenticated');
create policy "Admin write publications" on public.publications for all to authenticated using (true) with check (true);

insert into public.profile(first_name,last_name,title,degree,short_bio,about,research,email,location)
select 'Bunyod','Samandarov','Professor at Al-Khwarizmi University','Doctor of Science (DSc)',
'Researcher and educator working across next-generation communication systems, satellite-IoT, computer programming, information systems and digital technologies.',
'My work combines research, teaching, and practical innovation. I am especially interested in next-generation satellite systems, LEO constellations, IoT ecosystems, and digital technologies that can improve connectivity and smart infrastructure.',
'My research focuses on next-generation satellite systems, integrating LEO constellations with IoT ecosystems, multi-objective optimization, regional link design, resilient network architectures and New Space services.',
'bunyod.academic@gmail.com','Khorezm, Uzbekistan'
where not exists (select 1 from public.profile);

insert into public.experience(period,role,institution,sort_order) values
('2025 – Present','Associate Professor','Department of Telecommunication Engineering, Urgench State University',10),
('2024 – 2025','Associate Professor','Department of Telecommunication Engineering, Urgench Branch of TUIT',20),
('2021 – 2024','Doctoral Researcher','Telecommunications and Systems Engineering, Universitat Autònoma de Barcelona',30),
('2020 – 2021','Senior Lecturer','Department of Telecommunication Engineering, Urgench Branch of TUIT',40),
('2017 – 2020','Assistant Teacher','Department of Telecommunication Engineering, Urgench Branch of TUIT',50),
('2021 – 2024','Ph.D. in Electrical and Telecommunication Engineering','Universitat Autònoma de Barcelona',60),
('2015 – 2017','M.Sc. in Telecommunication Engineering','Tashkent University of Information Technologies',70),
('2011 – 2015','B.Sc. in Telecommunication Engineering','Tashkent University of Information Technologies',80)
on conflict do nothing;

insert into public.publications(year,title,authors,venue,published) values
('2024','Design Tradeoffs of a Regional LEO System for Emerging New Space Integrated Services','B. Samandarov & A. Vázquez-Castro','IEEE IHTC, Bari, Italy',true),
('2023','Quantum Advantage of Binary Discrete Modulations for Space Channels','B. Samandarov & A. Vázquez-Castro','IEEE Wireless Communications Letters, 12(5), 903–906',true)
on conflict do nothing;

-- Storage bucket for CVs, documents, and photos.
insert into storage.buckets(id,name,public) values ('portfolio','portfolio',true)
on conflict (id) do update set public=true;

create policy "Public read portfolio files" on storage.objects for select using (bucket_id='portfolio');
create policy "Admin upload portfolio files" on storage.objects for insert to authenticated with check (bucket_id='portfolio');
create policy "Admin update portfolio files" on storage.objects for update to authenticated using (bucket_id='portfolio') with check (bucket_id='portfolio');
create policy "Admin delete portfolio files" on storage.objects for delete to authenticated using (bucket_id='portfolio');
