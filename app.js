const starter = {
  profile:{first_name:'Bunyod',last_name:'Samandarov',title:'Professor at Al-Khwarizmi University',degree:'Doctor of Science (DSc)',short_bio:'Researcher and educator working across next-generation communication systems, satellite-IoT, computer programming, information systems and digital technologies.',about:'My work combines research, teaching, and practical innovation. I am especially interested in next-generation satellite systems, LEO constellations, IoT ecosystems, and digital technologies that can improve connectivity and smart infrastructure.',research:'My research focuses on next-generation satellite systems, integrating LEO constellations with IoT ecosystems, multi-objective optimization, regional link design, resilient network architectures and New Space services.',email:'bunyod.academic@gmail.com',location:'Khorezm, Uzbekistan',cv_url:''},
  experience:[
    {period:'2025 – Present',role:'Associate Professor',institution:'Department of Telecommunication Engineering, Urgench State University'},
    {period:'2024 – 2025',role:'Associate Professor',institution:'Department of Telecommunication Engineering, Urgench Branch of TUIT'},
    {period:'2021 – 2024',role:'Doctoral Researcher',institution:'Telecommunications and Systems Engineering, Universitat Autònoma de Barcelona'},
    {period:'2020 – 2021',role:'Senior Lecturer',institution:'Department of Telecommunication Engineering, Urgench Branch of TUIT'},
    {period:'2017 – 2020',role:'Assistant Teacher',institution:'Department of Telecommunication Engineering, Urgench Branch of TUIT'},
    {period:'2021 – 2024',role:'Ph.D. in Electrical and Telecommunication Engineering',institution:'Universitat Autònoma de Barcelona'},
    {period:'2015 – 2017',role:'M.Sc. in Telecommunication Engineering',institution:'Tashkent University of Information Technologies'},
    {period:'2011 – 2015',role:'B.Sc. in Telecommunication Engineering',institution:'Tashkent University of Information Technologies'}
  ],
  publications:[
    {year:'2024',title:'Design Tradeoffs of a Regional LEO System for Emerging New Space Integrated Services',venue:'IEEE IHTC, Bari, Italy',authors:'B. Samandarov & A. Vázquez-Castro'},
    {year:'2023',title:'Quantum Advantage of Binary Discrete Modulations for Space Channels',venue:'IEEE Wireless Communications Letters, 12(5), 903–906',authors:'B. Samandarov & A. Vázquez-Castro'}
  ]
};
function setText(id,v){const e=document.getElementById(id);if(e&&v)e.textContent=v}
function render(data){const p=data.profile||starter.profile; setText('firstName',p.first_name);setText('lastName',p.last_name);setText('title',p.title);setText('degree',p.degree);setText('shortBio',p.short_bio);setText('aboutText',p.about);setText('researchText',p.research);setText('location',p.location);if(p.email){const a=document.getElementById('emailBtn');a.href='mailto:'+p.email;const c=document.getElementById('contactEmail');c.href='mailto:'+p.email;c.querySelector('span').textContent=p.email}const cv=document.getElementById('cvBtn');if(p.cv_url){cv.href=p.cv_url}else{cv.classList.add('hidden')}
 const ex=document.getElementById('experienceList');ex.innerHTML='';(data.experience||starter.experience).forEach(x=>{ex.insertAdjacentHTML('beforeend',`<div class="item"><div class="year">${x.period||''}</div><div><h3>${x.role||''}</h3><p>${x.institution||''}</p></div></div>`)});
 const pl=document.getElementById('publicationList');pl.innerHTML='';const pubs=data.publications||starter.publications;if(!pubs.length)pl.innerHTML='<div class="empty">No publications added yet.</div>';pubs.forEach(x=>pl.insertAdjacentHTML('beforeend',`<article class="pub"><h3>${x.title||''}</h3><div class="meta">${x.authors||''} · ${x.venue||''} · ${x.year||''}</div></article>`));
}
async function load(){document.getElementById('year').textContent=new Date().getFullYear();const cfg=window.PORTFOLIO_CONFIG||{};if(!cfg.SUPABASE_URL||cfg.SUPABASE_URL.startsWith('YOUR_'))return render(starter);try{const sb=supabase.createClient(cfg.SUPABASE_URL,cfg.SUPABASE_ANON_KEY);const [{data:p},{data:e},{data:u}]=await Promise.all([sb.from('profile').select('*').limit(1).maybeSingle(),sb.from('experience').select('*').order('sort_order'),sb.from('publications').select('*').eq('published',true).order('year',{ascending:false})]);render({profile:p||starter.profile,experience:e?.length?e:starter.experience,publications:u?.length?u:starter.publications})}catch(err){console.warn(err);render(starter)}}
load();
