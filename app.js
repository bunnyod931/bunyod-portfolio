const header = document.querySelector('.site-header');
const nav = document.querySelector('.site-nav');
const toggle = document.querySelector('.menu-toggle');
const navLinks = [...document.querySelectorAll('.site-nav a')];
const sections = [...document.querySelectorAll('main section[id]')];

toggle?.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  toggle.setAttribute('aria-expanded', String(open));
});
navLinks.forEach(link => link.addEventListener('click', () => { nav.classList.remove('open'); toggle?.setAttribute('aria-expanded', 'false'); }));
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 18);
  const y = window.scrollY + 150; let current = '';
  sections.forEach(section => { if (section.offsetTop <= y) current = section.id; });
  navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${current}`));
}, { passive: true });
const reveal = new IntersectionObserver(entries => { entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); reveal.unobserve(entry.target); } }); }, { threshold: .12 });
document.querySelectorAll('.reveal').forEach(el => reveal.observe(el));

// Supabase content enhancement. The static Version 2.5 content remains as a fallback.
(async function hydrateFromSupabase(){
  const cfg=window.PORTFOLIO_CONFIG||{}; if(!window.supabase || !cfg.supabaseUrl || !cfg.supabaseKey) return;
  const sb=window.supabase.createClient(cfg.supabaseUrl,cfg.supabaseKey);
  const esc=s=>String(s??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#039;','"':'&quot;'}[c]));
  const get=async(table,order='sort_order')=>{let q=sb.from(table).select('*'); if(order) q=q.order(order,{ascending:true}); const {data}=await q; return data||[]};
  const [profile,experience,education,awards,teaching,publications,projects,journey,profiles]=await Promise.all([
    get('profile',null),get('experience'),get('education'),get('awards'),get('teaching'),get('publications'),get('projects'),get('phd_journey'),get('research_profiles')
  ]).catch(()=>[[],[],[],[],[],[],[],[],[]]);

  if(profile[0]){
    const p=profile[0];
    const role=document.querySelector('.hero-role'); if(role && p.academic_title){role.innerHTML=`${esc(p.academic_title)}${p.department?`, ${esc(p.department)}`:''}<br>${p.university_url?`<a href="${esc(p.university_url)}" target="_blank" rel="noopener">${esc(p.university||'')}</a>`:esc(p.university||'')}`}
    const degree=document.querySelector('.degree'); if(degree&&p.degree)degree.textContent=p.degree;
    const summary=document.querySelector('.hero-summary'); if(summary&&p.short_bio)summary.textContent=p.short_bio;
    const about=document.querySelector('.about-copy'); if(about&&p.about_text)about.innerHTML=`<p class="lead">${esc(p.about_text)}</p>`;
    const img=document.querySelector('.portrait-frame img'); if(img&&p.profile_photo_url)img.src=p.profile_photo_url;
    document.querySelectorAll('a[href="assets/CV_Bunyod.pdf"]').forEach(a=>{if(p.cv_url)a.href=p.cv_url});
    const emailLink=document.querySelector('a[href^="mailto:"]'); if(emailLink&&p.email){emailLink.href=`mailto:${p.email}`;emailLink.textContent=p.email}
    const loc=document.querySelector('.contact-meta span'); if(loc&&p.location)loc.textContent=p.location;
  }
  if(experience.length){const box=document.querySelector('.timeline'); if(box)box.innerHTML=experience.map(r=>`<article class="timeline-item ${r.is_current?'current':''}"><div class="timeline-year">${esc(r.start_year||'')} – ${r.is_current?'Present':esc(r.end_year||'')}</div><div class="timeline-content">${r.is_current?'<span class="timeline-tag">Current position</span>':''}<h3>${esc(r.position)}</h3><p>${r.department?`${esc(r.department)}, `:''}${r.institution_url?`<a href="${esc(r.institution_url)}" target="_blank" rel="noopener">${esc(r.institution)}</a>`:esc(r.institution)}</p>${r.description?`<p>${esc(r.description)}</p>`:''}</div></article>`).join('')}
  if(education.length){const box=document.querySelector('.education-grid');if(box)box.innerHTML=education.map((r,i)=>`<article class="edu-card ${i===0?'featured':''}"><span>${esc(r.start_year)} – ${esc(r.end_year)}</span><h3>${esc(r.degree)}${r.field?` in ${esc(r.field)}`:''}</h3><p>${esc(r.institution)}${r.location?`, ${esc(r.location)}`:''}</p></article>`).join('')}
  if(teaching.length){const box=document.querySelector('.teaching-grid');if(box){const philosophy=box.querySelector('.philosophy-card')?.outerHTML||'';box.innerHTML=teaching.map((r,i)=>`<article class="teaching-card"><div class="card-index">${String(i+1).padStart(2,'0')}</div><h3>${esc(r.course_title)}</h3><p>${esc(r.description||'')}</p>${r.topics?`<div class="mini-tags">${r.topics.split(',').map(t=>`<span>${esc(t.trim())}</span>`).join('')}</div>`:''}</article>`).join('')+philosophy}}
  if(publications.length){const box=document.querySelector('.publication-list');if(box)box.innerHTML=publications.map(r=>`<article class="publication-item"><div class="publication-year">${esc(r.year||'')}</div><div class="publication-body"><span class="publication-type">${esc(r.publication_type||'Publication')}</span><h3>${r.url?`<a href="${esc(r.url)}" target="_blank" rel="noopener">${esc(r.title)}</a>`:esc(r.title)}</h3><p>${esc(r.authors||'')}${r.venue?` · ${esc(r.venue)}`:''}</p></div><div class="publication-arrow">↗</div></article>`).join('')}
  if(profiles.length){const box=document.querySelector('.profile-links');if(box)box.innerHTML=profiles.map(r=>`<a href="${esc(r.url)}" target="_blank" rel="noopener">${esc(r.label||r.platform)} ↗</a>`).join('')}
  if(projects.length){const box=document.querySelector('.project-grid');if(box)box.innerHTML=projects.map(r=>`<article class="project-card"><div class="project-image">${r.image_url?`<img src="${esc(r.image_url)}" alt="${esc(r.title)}" loading="lazy">`:''}<span class="project-status">${r.start_year||''}${r.end_year&&r.end_year!==r.start_year?`–${r.end_year}`:''}</span></div><div class="project-content"><p class="project-kicker">${esc(r.status||'Research project')}</p><h3>${r.project_url?`<a href="${esc(r.project_url)}" target="_blank" rel="noopener">${esc(r.title)}</a>`:esc(r.title)}</h3><p>${esc(r.description||'')}</p>${r.role?`<div class="project-meta"><span>Role</span><strong>${esc(r.role)}</strong></div>`:''}${r.tags?`<div class="mini-tags">${r.tags.split(',').map(t=>`<span>${esc(t.trim())}</span>`).join('')}</div>`:''}</div></article>`).join('')}
  if(journey.length){const steps=document.querySelector('.journey-steps');if(steps)steps.innerHTML=journey.map(r=>`<article><span>${esc(r.year_label||'')}</span><h3>${esc(r.title)}</h3><p>${esc(r.description||'')}</p>${r.external_url?`<a href="${esc(r.external_url)}" target="_blank" rel="noopener">Learn more ↗</a>`:''}</article>`).join(''); const gallery=document.querySelector('.journey-gallery'); const photos=journey.filter(r=>r.image_url); if(gallery&&photos.length)gallery.innerHTML=photos.map((r,i)=>`<figure class="journey-photo ${i===0?'tall':'wide'}"><img src="${esc(r.image_url)}" alt="${esc(r.title)}" loading="lazy"><figcaption><strong>${esc(r.year_label?`${r.year_label} · ${r.title}`:r.title)}</strong><span>${esc(r.description||'')}</span></figcaption></figure>`).join('')}
  if(awards.length){const a=awards[0]; const card=document.querySelector('.award-card'); if(card)card.innerHTML=`<div class="award-year">${esc(a.year||'')}</div><div class="award-copy"><p class="eyebrow">Award & Scholarship</p><h2>${esc(a.title)}</h2><p>${esc(a.description||'')}</p>${a.organization_url?`<a href="${esc(a.organization_url)}" target="_blank" rel="noopener">${esc(a.organization||'Visit organization')} ↗</a>`:''}</div><div class="award-symbol" aria-hidden="true">✦</div>`}
})();
