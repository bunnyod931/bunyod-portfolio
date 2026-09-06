(() => {
  const cfg = window.PORTFOLIO_CONFIG || {};
  const sb = window.supabase?.createClient(cfg.supabaseUrl, cfg.supabaseKey);
  if (!sb) {
    document.getElementById('loginMessage').textContent = 'Supabase client could not be loaded.';
    return;
  }

  const sections = {
    profile: {
      title: 'Profile & Homepage', singleton: true,
      fields: [
        ['full_name','Full name','text'],['academic_title','Academic title','text'],['department','Department','text'],['university','University','text'],['university_url','University URL','url'],['degree','Degree','text'],['email','Contact email','email'],['location','Location','text'],['profile_photo_url','Profile photo URL','url'],['cv_url','CV URL','url'],['short_bio','Homepage summary','textarea','full'],['about_text','About text','textarea','full']
      ], summary: r => r.full_name || 'Profile'
    },
    experience: {title:'Experience', fields:[['start_year','Start year','number'],['end_year','End year','number'],['is_current','Current position','checkbox','full'],['position','Position','text'],['department','Department','text'],['institution','Institution','text'],['institution_url','Institution URL','url'],['location','Location','text'],['description','Description','textarea','full'],['sort_order','Sort order','number'],['is_published','Published','checkbox','full']], summary:r=>r.position||r.institution},
    education: {title:'Education', fields:[['start_year','Start year','number'],['end_year','End year','number'],['degree','Degree','text'],['field','Field','text'],['institution','Institution','text'],['institution_url','Institution URL','url'],['location','Location','text'],['description','Description','textarea','full'],['sort_order','Sort order','number'],['is_published','Published','checkbox','full']], summary:r=>r.degree||r.institution},
    awards: {title:'Awards & Scholarships', fields:[['year','Year','number'],['title','Title','text'],['organization','Organization','text'],['organization_url','Organization URL','url'],['description','Description','textarea','full'],['image_url','Image URL','url'],['sort_order','Sort order','number'],['is_published','Published','checkbox','full']], summary:r=>r.title},
    teaching: {title:'Teaching', fields:[['course_title','Course title','text'],['institution','Institution','text'],['description','Description','textarea','full'],['topics','Topics / tags','text','full'],['course_url','Course URL','url'],['image_url','Image URL','url'],['sort_order','Sort order','number'],['is_published','Published','checkbox','full']], summary:r=>r.course_title},
    publications: {title:'Publications', fields:[['year','Year','number'],['title','Title','text','full'],['authors','Authors','text','full'],['venue','Venue / journal / conference','text','full'],['publication_type','Publication type','text'],['doi','DOI','text'],['url','External URL','url'],['pdf_url','PDF URL','url'],['featured','Featured','checkbox'],['sort_order','Sort order','number'],['is_published','Published','checkbox','full']], summary:r=>r.title},
    projects: {title:'Research Projects', fields:[['title','Project title','text','full'],['start_year','Start year','number'],['end_year','End year','number'],['status','Status','text'],['role','Your role','text'],['funding','Funding / programme','text','full'],['description','Description','textarea','full'],['tags','Tags','text','full'],['image_url','Image URL','url'],['project_url','Project URL','url'],['publication_url','Related publication URL','url'],['sort_order','Sort order','number'],['is_published','Published','checkbox','full']], summary:r=>r.title},
    phd_journey: {title:'PhD Journey', fields:[['year_label','Year / period','text'],['title','Milestone title','text'],['institution','Institution','text','full'],['description','Description','textarea','full'],['image_url','Image URL','url'],['external_url','External URL','url'],['sort_order','Sort order','number'],['is_published','Published','checkbox','full']], summary:r=>r.title},
    research_profiles: {title:'Research Profiles', fields:[['platform','Platform','text'],['label','Display label','text'],['url','Profile URL','url','full'],['identifier','Identifier','text'],['sort_order','Sort order','number'],['is_published','Published','checkbox','full']], summary:r=>r.label||r.platform}
  };

  const seeds = {
    experience: [
      {start_year:2026,end_year:null,is_current:true,position:'Professor',department:'Department of Software Engineering',institution:'Al-Khwarizmi University',institution_url:'https://akhu.uz/',location:'Uzbekistan',description:'',sort_order:1,is_published:true},
      {start_year:2025,end_year:2026,is_current:false,position:'Associate Professor',department:'Department of Telecommunication Engineering',institution:'Urgench State University',location:'Uzbekistan',description:'',sort_order:2,is_published:true},
      {start_year:2024,end_year:2025,is_current:false,position:'Associate Professor',department:'Department of Telecommunication Engineering',institution:'Urgench Branch of Tashkent University of Information Technologies',location:'Uzbekistan',description:'',sort_order:3,is_published:true},
      {start_year:2021,end_year:2024,is_current:false,position:'Doctoral Researcher',department:'Telecommunications and Systems Engineering',institution:'Universitat Autònoma de Barcelona',location:'Spain',description:'',sort_order:4,is_published:true},
      {start_year:2020,end_year:2021,is_current:false,position:'Senior Lecturer',department:'',institution:'Urgench Branch of Tashkent University of Information Technologies',location:'Uzbekistan',description:'',sort_order:5,is_published:true},
      {start_year:2017,end_year:2020,is_current:false,position:'Assistant Teacher',department:'',institution:'Urgench Branch of Tashkent University of Information Technologies',location:'Uzbekistan',description:'',sort_order:6,is_published:true}
    ],
    education:[
      {start_year:2021,end_year:2024,degree:'Ph.D.',field:'Electrical & Telecommunication Engineering',institution:'Universitat Autònoma de Barcelona',institution_url:'https://www.uab.cat/',location:'Spain',description:'',sort_order:1,is_published:true},
      {start_year:2015,end_year:2017,degree:'M.Sc.',field:'Telecommunication Engineering',institution:'Tashkent University of Information Technologies',location:'Uzbekistan',description:'',sort_order:2,is_published:true},
      {start_year:2011,end_year:2015,degree:'B.Sc.',field:'Telecommunication Engineering',institution:'Tashkent University of Information Technologies',location:'Uzbekistan',description:'',sort_order:3,is_published:true}
    ],
    awards:[{year:2021,title:'“El-yurt umidi” Foundation Scholarship',organization:'“El-yurt umidi” Foundation',organization_url:'https://el-yurt.uz/',description:'Awarded scholarship support to pursue doctoral studies abroad.',sort_order:1,is_published:true}],
    teaching:[
      {course_title:'Computer Programming',institution:'Al-Khwarizmi University',description:'Foundations of programming, computational thinking, problem solving and practical coding with an emphasis on understanding how software is designed and tested.',topics:'Python, Algorithms, Problem solving',sort_order:1,is_published:true},
      {course_title:'Information Systems & Digital Technologies',institution:'Al-Khwarizmi University',description:'Computer hardware and software, operating systems, file management, productivity tools, internet navigation, online safety and basic troubleshooting.',topics:'Digital literacy, Productivity tools, Online safety',sort_order:2,is_published:true}
    ],
    publications:[
      {year:2024,title:'Design Tradeoffs of a Regional LEO System for Emerging New Space Integrated Services',authors:'B. Samandarov & A. Vázquez-Castro',venue:'IEEE International Humanitarian Technology Conference, Bari, Italy',publication_type:'Conference paper',featured:true,sort_order:1,is_published:true},
      {year:2023,title:'Quantum Advantage of Binary Discrete Modulations for Space Channels',authors:'B. Samandarov & A. Vázquez-Castro',venue:'IEEE Wireless Communications Letters, 12(5), 903–906',publication_type:'Journal article',featured:true,sort_order:2,is_published:true}
    ],
    projects:[
      {title:'PhotSat Project',start_year:2022,end_year:2024,status:'Completed',funding:'European Union NextGenerationEU (PRTR-C17.I1) & Generalitat de Catalunya',role:'Researcher',description:'Research project connected with satellite communication and integrated New Space services.',tags:'Satellite communication, New Space, EU funding',image_url:'https://d2pn8kiwq2w21t.cloudfront.net/images/CubeSat_splash.height-1024.jpg',sort_order:1,is_published:true},
      {title:'Regional LEO System Design',start_year:2024,end_year:2024,status:'Published',funding:'',role:'Lead Researcher',description:'Research on design tradeoffs for a regional Low Earth Orbit system supporting emerging New Space integrated services and connectivity.',tags:'LEO systems, System design, Connectivity',image_url:'https://svs.gsfc.nasa.gov/vis/a010000/a011800/a011834/c-1920.jpg',publication_url:'https://dialnet.unirioja.es/servlet/dctes?codigo=373706',sort_order:2,is_published:true}
    ],
    phd_journey:[
      {year_label:'2021',title:'The journey begins',institution:'Universitat Autònoma de Barcelona',description:'Received scholarship support from the “El-yurt umidi” Foundation and began doctoral studies abroad.',image_url:'assets/phd-barcelona.jpg',sort_order:1,is_published:true},
      {year_label:'2021–2024',title:'Doctoral research',institution:'Universitat Autònoma de Barcelona',description:'Research in Electrical and Telecommunication Engineering, presentations and academic exchange.',image_url:'assets/phd-uab.jpg',sort_order:2,is_published:true},
      {year_label:'2022–2024',title:'Projects & publications',institution:'Universitat Autònoma de Barcelona',description:'Research activity connected with New Space, satellite communications, PhotSat and peer-reviewed publication.',sort_order:3,is_published:true},
      {year_label:'2024',title:'Doctoral completion',institution:'Universitat Autònoma de Barcelona',description:'Completed the Ph.D. program at Universitat Autònoma de Barcelona.',image_url:'assets/phd-diploma.jpg',external_url:'https://dialnet.unirioja.es/servlet/dctes?codigo=373706',sort_order:4,is_published:true}
    ]
  };

  const loginView = document.getElementById('loginView');
  const dashboardView = document.getElementById('dashboardView');
  const adminNav = document.getElementById('adminNav');
  const signOutButton = document.getElementById('signOutButton');
  const contentForm = document.getElementById('contentForm');
  const itemList = document.getElementById('itemList');
  const sectionTitle = document.getElementById('sectionTitle');
  const itemCount = document.getElementById('itemCount');
  const newItemButton = document.getElementById('newItemButton');
  const seedButton = document.getElementById('seedButton');
  const statusBar = document.getElementById('statusBar');
  let currentSection = 'profile';
  let editingId = null;
  let rows = [];

  function status(msg, error=false){statusBar.hidden=false;statusBar.textContent=msg;statusBar.classList.toggle('error',error);clearTimeout(status._t);status._t=setTimeout(()=>statusBar.hidden=true,4500)}
  function escapeHtml(s=''){return String(s).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#039;','"':'&quot;'}[c]))}

  async function isAdmin(){const {data,error}=await sb.rpc('is_site_admin');return !error && data===true}

  function buildNav(){adminNav.innerHTML='';Object.entries(sections).forEach(([key,c])=>{const b=document.createElement('button');b.type='button';b.textContent=c.title;b.dataset.section=key;b.classList.toggle('active',key===currentSection);b.onclick=()=>switchSection(key);adminNav.appendChild(b)})}

  function fieldMarkup([name,label,type,layout]){
    const full = layout==='full' || type==='textarea' || type==='checkbox';
    if(type==='checkbox') return `<label class="checkbox-row ${full?'full':''}"><input type="checkbox" name="${name}"><span>${label}</span></label>`;
    const el = type==='textarea' ? `<textarea name="${name}"></textarea>` : `<input type="${type}" name="${name}" ${type==='number'?'step="1"':''}>`;
    return `<label class="${full?'full':''}">${label}${el}</label>`;
  }

  function renderForm(row={}){
    const c=sections[currentSection];
    contentForm.innerHTML = c.fields.map(fieldMarkup).join('') + `<div class="admin-note"><strong>Tip:</strong> Changes are saved to Supabase and appear on the public site after refresh. Local asset paths such as <code>assets/phd-uab.jpg</code> are allowed.</div><div class="form-actions"><button class="button button-primary" type="submit">${editingId?'Save changes':'Save item'}</button><button id="cancelEdit" class="button button-ghost" type="button">Clear form</button></div>`;
    c.fields.forEach(([name,,type])=>{const input=contentForm.elements[name]; if(!input)return; if(type==='checkbox') input.checked = row[name] ?? (name==='is_published'); else input.value = row[name] ?? ''});
    document.getElementById('cancelEdit').onclick=()=>{editingId=null;renderForm({})};
  }

  function displayPeriod(r){ if(r.is_current) return `${r.start_year||''} – Present`; if(r.start_year||r.end_year) return [r.start_year,r.end_year].filter(Boolean).join(' – '); return '' }
  function renderList(){
    itemCount.textContent=`${rows.length} item${rows.length===1?'':'s'}`;
    if(!rows.length){itemList.innerHTML='<div class="empty-state">No database items in this section yet.</div>';return}
    const c=sections[currentSection];
    itemList.innerHTML=rows.map(r=>`<div class="admin-item"><div class="admin-item-main"><h3>${escapeHtml(c.summary(r)||'Untitled')}</h3><p>${escapeHtml(displayPeriod(r)||r.institution||r.organization||r.venue||r.platform||r.description||'')}</p></div><div class="admin-item-actions"><button class="admin-small-btn" data-edit="${r.id}">Edit</button>${c.singleton?'':`<button class="admin-small-btn danger" data-delete="${r.id}">Delete</button>`}</div></div>`).join('');
    itemList.querySelectorAll('[data-edit]').forEach(b=>b.onclick=()=>{editingId=b.dataset.edit;const row=rows.find(x=>x.id===editingId);renderForm(row);window.scrollTo({top:0,behavior:'smooth'})});
    itemList.querySelectorAll('[data-delete]').forEach(b=>b.onclick=()=>deleteRow(b.dataset.delete));
  }

  async function loadRows(){
    const c=sections[currentSection];
    let q=sb.from(currentSection).select('*');
    if(!c.singleton && c.fields.some(f=>f[0]==='sort_order')) q=q.order('sort_order',{ascending:true});
    const {data,error}=await q;
    if(error){status(error.message,true);rows=[]} else rows=data||[];
    sectionTitle.textContent=c.title;newItemButton.hidden=!!c.singleton;renderList();editingId=c.singleton&&rows[0]?rows[0].id:null;renderForm(c.singleton&&rows[0]?rows[0]:{});buildNav();
  }

  async function switchSection(key){currentSection=key;editingId=null;await loadRows()}

  contentForm.addEventListener('submit',async e=>{
    e.preventDefault(); const c=sections[currentSection]; const payload={};
    c.fields.forEach(([name,,type])=>{const input=contentForm.elements[name]; if(type==='checkbox') payload[name]=input.checked; else if(type==='number') payload[name]=input.value===''?null:Number(input.value); else payload[name]=input.value.trim()===''?null:input.value.trim()});
    let result;
    if(editingId) result=await sb.from(currentSection).update(payload).eq('id',editingId).select();
    else result=await sb.from(currentSection).insert(payload).select();
    if(result.error){status(result.error.message,true);return}
    status('Saved successfully.'); editingId=null; await loadRows();
  });

  async function deleteRow(id){if(!confirm('Delete this item?'))return;const {error}=await sb.from(currentSection).delete().eq('id',id);if(error)status(error.message,true);else{status('Deleted.');await loadRows()}}
  newItemButton.onclick=()=>{editingId=null;renderForm({});window.scrollTo({top:0,behavior:'smooth'})};

  seedButton.onclick=async()=>{
    if(!confirm('Initialize empty sections with the current Version 2.5 website content? Existing rows will not be replaced.')) return;
    seedButton.disabled=true;
    try{
      for(const [table,data] of Object.entries(seeds)){
        const {count,error:countErr}=await sb.from(table).select('*',{count:'exact',head:true});
        if(countErr) throw countErr;
        if((count||0)===0){const {error}=await sb.from(table).insert(data); if(error) throw error;}
      }
      const {data:prof}=await sb.from('profile').select('*').limit(1).maybeSingle();
      if(prof && !prof.profile_photo_url){await sb.from('profile').update({profile_photo_url:'assets/profile.jpg',cv_url:'assets/CV_Bunyod.pdf',email:'bunyod.academic@gmail.com',about_text:'I am a professor, researcher and educator with experience across telecommunications, satellite systems, digital technologies and higher education. My research has focused on next-generation satellite systems, Low Earth Orbit constellations, Satellite-IoT integration, multi-objective system design and resilient connectivity. In teaching, I work with computer programming, information systems and digital technologies, helping students connect fundamental concepts with practical problem-solving.'}).eq('id',prof.id)}
      status('Version 2.5 content initialized.'); await loadRows();
    } catch(err){status(err.message||String(err),true)} finally{seedButton.disabled=false}
  };

  document.getElementById('loginForm').addEventListener('submit',async e=>{
    e.preventDefault(); const email=document.getElementById('loginEmail').value.trim(); const password=document.getElementById('loginPassword').value; const msg=document.getElementById('loginMessage'); msg.textContent='Signing in…';
    const {error}=await sb.auth.signInWithPassword({email,password});
    if(error){msg.textContent=error.message;return}
    if(!(await isAdmin())){await sb.auth.signOut();msg.textContent='This account is not authorized as a site administrator.';return}
    msg.textContent='';showDashboard();
  });
  signOutButton.onclick=async()=>{await sb.auth.signOut();showLogin()};

  function showLogin(){loginView.hidden=false;dashboardView.hidden=true;adminNav.hidden=true;signOutButton.hidden=true}
  async function showDashboard(){loginView.hidden=true;dashboardView.hidden=false;adminNav.hidden=false;signOutButton.hidden=false;buildNav();await loadRows()}

  (async()=>{const {data:{session}}=await sb.auth.getSession(); if(session && await isAdmin()) showDashboard(); else showLogin()})();
})();
