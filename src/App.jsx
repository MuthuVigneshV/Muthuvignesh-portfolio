import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';

// ============================================================================
// 1. SYSTEM STRUCTURAL CONFIGURATIONS & MASTER DEFAULTS
// ============================================================================
const DEFAULT_THEME = {
  accentColor: '#111827',
  accentHover: '#374151',
  bgPrimary: '#fbfbfd',
  textColor: '#1d1d1f',
  // Structural Presentation Visibility Toggles
  showSpotlight: true,
  // Typography Parameters
  heroFontFamily: 'sans',      
  sectionFontFamily: 'sans',   
  sectionDecoration: 'none',   
  sectionWeight: 'font-extrabold',
  // Per-Section Layout Block Background Colors
  aboutCardBg: '#ffffff',
  spotlightCardBg: '#ffffff',
  experienceCardBg: '#ffffff',
  projectCardBg: '#ffffff',
  customSectionCardBg: '#ffffff',
  // Dynamic Section Header Font Colors
  aboutHeaderColor: '#9ca3af',
  experienceHeaderColor: '#9ca3af',
  projectHeaderColor: '#9ca3af'
};

const DEFAULT_PROFILE = {
  name: " Muthu Vignesh",
  titleTitle: "Sales & Service Engineer",
  heroHeading: "Designing systems that empower data.",
  tagline: "Biomedical Engineering & Full-Stack Systems Architecture.",
  about: "I bridge the gap between complex diagnostic medical hardware and modern automated software solutions. Specialized in immunoassay calibrations, field engineering installations, and developing tracking ecosystems.",
  avatar_photo: "", 
  blog_url: "https://yourbloglink.com",
  linkedin_url: "https://linkedin.com",
  github_url: "https://github.com",
  contact_email: "vicky@example.com",
  skills: "Biomedical Instrumentation, Analyzer Calibration, React.js, Systems Automation, Telemetry Design"
};

const DEFAULT_SPOTLIGHT = {
  badge: "Enterprise Focus",
  title: "Labtivate",
  description: "Active engineering module architecture focused on building alternative platform systems, diagnostic web models, and digital laboratory workflow tools.",
  link: "https://labtivate.com"
};

const DEFAULT_PROJECTS = [
  { id: "p1", title: "Smart Diagnostics Telemetry Module", description: "Real-time hardware telemetry parser recording system logs and component sensor data.", web_url: "https://github.com", category: "Hardware Automation", photo: "" }
];

const DEFAULT_EXPERIENCES = [
  { id: "e1", company: "Quicklab Services Pvt Ltd", role: "Sales & Service Engineer", duration: "2025 - Present", description: "Managed hardware analytical installations, field calibrations, and full diagnostic system demonstrations.", companyLogo: "" }
];

const DEFAULT_CUSTOM_SECTIONS = [
  { id: "c1", title: "My Ventures", content: "Explore the ongoing operations and independent startups initiated to revolutionize healthcare tech workflows.", titleColor: '#1d1d1f', contentColor: '#6b7280', ventureLogo: "" }
];

// FIX: Safe ID generator — Date.now() alone can collide when two records are
// created in the same millisecond, causing duplicate keys / overwritten records.
const genId = (prefix) => `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

// FIX: Wrapped in try/catch — a corrupted localStorage value would otherwise
// throw during JSON.parse and crash the whole app on load.
const getLocalData = (key, fallback) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch (err) {
    console.error(`Failed to read localStorage key "${key}":`, err);
    return fallback;
  }
};

// FIX: Wrapped in try/catch and now reports success/failure — storing base64
// images can exceed the localStorage quota and throw; this prevents a hard
// crash and lets callers show a proper message instead.
const setLocalData = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (err) {
    console.error(`Failed to save localStorage key "${key}":`, err);
    return false;
  }
};

const getFontClass = (type) => {
  if (type === 'serif') return 'font-serif';
  if (type === 'mono') return 'font-mono tracking-tight';
  return 'font-sans';
};

const getDecorationClass = (type) => {
  if (type === 'uppercase') return 'uppercase tracking-wider';
  if (type === 'tracking-wider') return 'tracking-widest';
  return 'normal-case';
};

// ============================================================================
// 2. ENTRY APP ENGINE
// ============================================================================
export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('vicky_auth_session') === 'true';
  });

  return (
    <Router>
      <Routes>
        <Route path="/" element={<PortfolioHome />} />
        <Route 
          path="/adminvicky/login" 
          element={isAuthenticated ? <Navigate to="/adminvicky" /> : <AdminLogin setAuth={setIsAuthenticated} />} 
        />
        <Route 
          path="/adminvicky" 
          element={isAuthenticated ? <AdminDashboard setAuth={setIsAuthenticated} /> : <Navigate to="/adminvicky/login" />} 
        />
      </Routes>
    </Router>
  );
}

// ============================================================================
// 3. MASTER PORTFOLIO VIEW (VISITOR HOMEPAGE VIEW)
// ============================================================================
function PortfolioHome() {
  const [theme, setTheme] = useState(() => getLocalData('vicky_theme', DEFAULT_THEME));
  const [profile, setProfile] = useState(() => getLocalData('vicky_profile', DEFAULT_PROFILE));
  const [spotlight, setSpotlight] = useState(() => getLocalData('vicky_spotlight', DEFAULT_SPOTLIGHT));
  const [projects, setProjects] = useState(() => getLocalData('vicky_projects', DEFAULT_PROJECTS));
  const [experiences, setExperiences] = useState(() => getLocalData('vicky_experiences', DEFAULT_EXPERIENCES));
  const [customSections, setCustomSections] = useState(() => getLocalData('vicky_custom_sections', DEFAULT_CUSTOM_SECTIONS));

  // Sync state modifications dynamically across execution runtimes
  useEffect(() => {
    const handleStorageSynchronization = () => {
      setTheme(getLocalData('vicky_theme', DEFAULT_THEME));
      setProfile(getLocalData('vicky_profile', DEFAULT_PROFILE));
      setSpotlight(getLocalData('vicky_spotlight', DEFAULT_SPOTLIGHT));
      setProjects(getLocalData('vicky_projects', DEFAULT_PROJECTS));
      setExperiences(getLocalData('vicky_experiences', DEFAULT_EXPERIENCES));
      setCustomSections(getLocalData('vicky_custom_sections', DEFAULT_CUSTOM_SECTIONS));
    };

    window.addEventListener('storage', handleStorageSynchronization);
    // Execute structural cycle scan on frame execution setup
    handleStorageSynchronization();
    return () => window.removeEventListener('storage', handleStorageSynchronization);
  }, []);

  const skillArray = profile.skills ? profile.skills.split(',').map(s => s.trim()) : [];

  const handleReturnToStart = (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div 
      className="min-h-screen antialiased tracking-tight transition-colors duration-300 flex flex-col justify-between"
      style={{ backgroundColor: theme.bgPrimary, color: theme.textColor }}
    >
      <div>
        {/* Sleek Navigation Bar */}
        <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 border-b border-gray-200/50 px-8 py-5">
          <div className="max-w-5xl mx-auto flex justify-between items-center">
            <a 
              href="#" 
              onClick={handleReturnToStart} 
              className="text-lg font-black tracking-tight uppercase hover:opacity-70 transition cursor-pointer"
            >
              {profile.name} <span style={{ color: theme.accentColor }}>/</span> Portfolio
            </a>
            <div className="flex space-x-4 md:space-x-8 text-sm font-medium text-gray-500">
              <a href="#about" className="hover:text-black transition">About</a>
              <a href="#experience" className="hover:text-black transition">Track</a>
              <a href="#projects" className="hover:text-black transition">Projects</a>
              {customSections.map(sec => (
                <a key={sec.id} href={`#${sec.id}`} className="hover:text-black transition truncate max-w-[80px] md:max-w-none">{sec.title}</a>
              ))}
              <a href="#connect" className="font-semibold text-gray-900 border-b-2 border-black/10 hover:border-black transition">Connect</a>
            </div>
          </div>
        </nav>

        {/* Luxury Hero Presentation */}
        <header className={`max-w-5xl mx-auto px-8 pt-28 pb-20 grid md:grid-cols-3 gap-12 items-center ${getFontClass(theme.heroFontFamily)}`}>
          <div className="md:col-span-2 space-y-6">
            <span className="inline-block text-xs font-bold tracking-widest uppercase text-gray-400">
              {profile.titleTitle}
            </span>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-[1.05] text-gray-900 whitespace-pre-line">
              {profile.heroHeading || "Designing systems \nthat empower data."}
            </h1>
            <p className="text-xl text-gray-500 font-normal max-w-xl leading-relaxed">
              {profile.tagline}
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <a href="#projects" className="px-6 py-3.5 rounded-full font-semibold text-sm transition shadow-sm text-white" style={{ backgroundColor: theme.accentColor }}>
                View Case Studies
              </a>
              {profile.blog_url && (
                <a href={profile.blog_url} target="_blank" rel="noreferrer" className="px-6 py-3.5 rounded-full font-semibold text-sm bg-white border border-gray-200 hover:bg-gray-50 transition shadow-sm">
                  Read Publication
                </a>
              )}
            </div>
          </div>
          
          <div className="flex justify-center md:justify-end">
            <div className="w-64 h-64 md:w-72 md:h-72 rounded-3xl overflow-hidden bg-gray-100 border border-gray-200 shadow-md transform rotate-1 hover:rotate-0 transition duration-500">
              {profile.avatar_photo ? (
                <img src={profile.avatar_photo} alt={profile.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 font-mono text-xs">No avatar configured</div>
              )}
            </div>
          </div>
        </header>

        {/* Main Core Workstation Area */}
        <main className="max-w-5xl mx-auto px-8 space-y-24 mb-24">
          
          {/* Spotlight Section with Corrected Structural Visibility Control Logic */}
          {theme.showSpotlight && (
            <section 
              className="border border-gray-200/80 rounded-3xl p-8 md:p-12 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-8 relative overflow-hidden group transition-all duration-300"
              style={{ backgroundColor: theme.spotlightCardBg || '#ffffff' }}
            >
              <div className="space-y-4 max-w-2xl">
                <span className="text-[10px] font-bold uppercase tracking-widest bg-gray-900 text-white px-3 py-1 rounded-full">
                  {spotlight.badge || "Enterprise Focus"}
                </span>
                <h2 className={`text-3xl font-bold tracking-tight text-gray-900 ${getFontClass(theme.sectionFontFamily)}`}>
                  {spotlight.title || "Labtivate"}
                </h2>
                <p className="text-gray-500 text-lg leading-relaxed">
                  {spotlight.description}
                </p>
              </div>
              {spotlight.link && (
                <a 
                  href={spotlight.link} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="inline-flex items-center justify-center px-6 py-4 rounded-xl font-semibold bg-gray-900 text-white hover:bg-gray-800 transition shadow-md text-sm shrink-0"
                >
                  Launch Architecture
                </a>
              )}
            </section>
          )}

          {/* Dynamic Custom Sections Module with Independent Typography Corridors */}
          {customSections.length > 0 && (
            <section className="space-y-8">
              <div className="grid md:grid-cols-2 gap-6">
                {customSections.map((sec) => (
                  <div 
                    key={sec.id} 
                    id={sec.id} 
                    className="border border-gray-200 p-8 rounded-3xl shadow-sm flex flex-col justify-between items-start gap-4 scroll-mt-24"
                    style={{ backgroundColor: theme.customSectionCardBg || '#ffffff' }}
                  >
                    <div className="space-y-3 w-full">
                      <div className="flex items-center justify-between gap-4 w-full">
                        <h3 
                          className={`text-lg font-bold ${getFontClass(theme.sectionFontFamily)} ${theme.sectionWeight} ${getDecorationClass(theme.sectionDecoration)}`}
                          style={{ color: sec.titleColor || '#1d1d1f' }}
                        >
                          {sec.title}
                        </h3>
                        {sec.ventureLogo && (
                          <img src={sec.ventureLogo} alt="Venture Node" className="w-10 h-10 object-contain rounded-lg border border-gray-100 p-0.5 bg-white shadow-sm shrink-0" />
                        )}
                      </div>
                      <p 
                        className="leading-relaxed text-sm whitespace-pre-line"
                        style={{ color: sec.contentColor || '#6b7280' }}
                      >
                        {sec.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Bento Grid: Biography and Skills */}
          <section id="about" className="grid md:grid-cols-3 gap-6 scroll-mt-24">
            <div 
              className="md:col-span-2 border border-gray-200 p-8 rounded-3xl shadow-sm space-y-4"
              style={{ backgroundColor: theme.aboutCardBg || '#ffffff' }}
            >
              <h3 
                className={`text-xs font-bold uppercase tracking-widest ${getFontClass(theme.sectionFontFamily)}`}
                style={{ color: theme.aboutHeaderColor || '#9ca3af' }}
              >
                Philosophy
              </h3>
              <p className="text-gray-600 leading-relaxed text-base whitespace-pre-line">{profile.about}</p>
            </div>
            <div 
              className="border border-gray-200 p-8 rounded-3xl shadow-sm space-y-4"
              style={{ backgroundColor: theme.aboutCardBg || '#ffffff' }}
            >
              <h3 
                className={`text-xs font-bold uppercase tracking-widest ${getFontClass(theme.sectionFontFamily)}`}
                style={{ color: theme.aboutHeaderColor || '#9ca3af' }}
              >
                Core Infrastructure
              </h3>
              <div className="flex flex-wrap gap-2">
                {skillArray.map((skill, index) => (
                  <span key={index} className="px-3 py-1.5 rounded-xl bg-gray-50 border border-gray-100 text-xs font-medium text-gray-600">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </section>

          {/* Timeline Tracker with Modifiable Header Text Color Option */}
          <section id="experience" className="space-y-12 scroll-mt-24">
            <h3 
              className={`text-xs font-bold uppercase tracking-widest ${getFontClass(theme.sectionFontFamily)}`}
              style={{ color: theme.experienceHeaderColor || '#9ca3af' }}
            >
              Professional Log
            </h3>
            <div className="border-l border-gray-200 ml-2 pl-8 space-y-12 relative">
              {experiences.map((exp) => (
                <div key={exp.id} className="relative group">
                  <div className="absolute -left-[37px] top-1 w-4 h-4 rounded-full border-4 border-white bg-gray-900 shadow-sm"></div>
                  <div 
                    className="p-6 border border-gray-200/70 rounded-2xl shadow-sm space-y-3"
                    style={{ backgroundColor: theme.experienceCardBg || '#ffffff' }}
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div className="space-y-1 flex-1">
                        <div className="flex flex-wrap justify-between items-baseline gap-2">
                          <h4 className="text-xl font-bold text-gray-900">{exp.role}</h4>
                          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{exp.duration}</span>
                        </div>
                        <p className="text-sm font-semibold text-gray-500">{exp.company}</p>
                      </div>
                      {exp.companyLogo && (
                        <img 
                          src={exp.companyLogo} 
                          alt={`${exp.company} Logo`} 
                          className="w-12 h-12 object-contain rounded-xl border border-gray-200 bg-white p-1 shadow-sm shrink-0" 
                        />
                      )}
                    </div>
                    <p className="text-sm text-gray-500 max-w-3xl leading-relaxed whitespace-pre-line pt-1">{exp.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Dynamic Project Grid with Modifiable Header Text Color Option */}
          <section id="projects" className="space-y-12 scroll-mt-24">
            <h3 
              className={`text-xs font-bold uppercase tracking-widest ${getFontClass(theme.sectionFontFamily)}`}
              style={{ color: theme.projectHeaderColor || '#9ca3af' }}
            >
              Selected Works
            </h3>
            <div className="grid md:grid-cols-2 gap-8">
              {projects.map((proj) => (
                <div 
                  key={proj.id} 
                  className="border border-gray-200 rounded-3xl overflow-hidden flex flex-col justify-between group shadow-sm hover:shadow-md transition duration-300"
                  style={{ backgroundColor: theme.projectCardBg || '#ffffff' }}
                >
                  <div className="w-full h-48 bg-gray-50 border-b border-gray-100 overflow-hidden relative">
                    {proj.photo ? (
                      <img src={proj.photo} alt={proj.title} className="w-full h-full object-cover transition duration-500 group-hover:scale-105" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-gray-300 uppercase font-bold tracking-wider">Blueprint Render Missing</div>
                    )}
                  </div>
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <span className="text-[9px] font-bold uppercase tracking-widest text-gray-400">{proj.category || 'Module'}</span>
                      <h4 className="text-lg font-bold text-gray-900 tracking-tight">{proj.title}</h4>
                      <p className="text-xs text-gray-500 leading-relaxed whitespace-pre-line">{proj.description}</p>
                    </div>
                    {proj.web_url && (
                      <a href={proj.web_url} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center w-full text-center bg-gray-50 hover:bg-gray-100 text-gray-900 py-2.5 rounded-xl text-xs font-semibold transition border border-gray-200">
                        Inspect Live Asset Link
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>

      <footer id="connect" className="border-t border-gray-200/60 bg-white/80 backdrop-blur-md py-12 text-xs text-gray-400 w-full mt-auto scroll-mt-24">
        <div className="max-w-5xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <p>© {new Date().getFullYear()} {profile.name}. System Network Context Operational.</p>
          <div className="flex items-center space-x-6 font-semibold text-gray-600">
            {profile.contact_email && <a href={`mailto:${profile.contact_email}`} className="hover:text-black transition">Email</a>}
            {profile.linkedin_url && <a href={profile.linkedin_url} target="_blank" rel="noreferrer" className="hover:text-black transition">LinkedIn</a>}
            {profile.github_url && <a href={profile.github_url} target="_blank" rel="noreferrer" className="hover:text-black transition">GitHub</a>}
          </div>
        </div>
      </footer>
    </div>
  );
}

// ============================================================================
// 4. ADMINISTRATIVE SECURITY LOGIN GATEWAY
// ============================================================================
function AdminLogin({ setAuth }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === 'admin' && password === 'admin123') {
      localStorage.setItem('vicky_auth_session', 'true');
      setAuth(true);
      navigate('/adminvicky');
    } else {
      setError('Access authorization denied.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 text-gray-900 font-sans">
      <form onSubmit={handleLogin} className="bg-white border border-gray-200 p-8 rounded-3xl shadow-xl w-full max-w-sm space-y-6">
        <div className="space-y-1">
          <h2 className="text-xl font-bold tracking-tight">Terminal Control Access</h2>
          <p className="text-xs text-gray-400">Provide authorization metrics</p>
        </div>
        {error && <div className="p-3 bg-red-50 text-red-500 rounded-xl text-xs font-medium text-center border border-red-100">{error}</div>}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Identity Token</label>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-black transition" />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Access Signature Key</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-black transition" />
        </div>
        <button type="submit" className="w-full py-3 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-xl text-xs tracking-wider uppercase transition shadow-md">
          Authenticate Session
        </button>
      </form>
    </div>
  );
}

// ============================================================================
// 5. MASTER CONTROLLER DASHBOARD (WITH LIVE THEME SYNCHRONIZATION)
// ============================================================================
function AdminDashboard({ setAuth }) {
  const navigate = useNavigate();
  
  const [theme, setTheme] = useState(() => getLocalData('vicky_theme', DEFAULT_THEME));
  const [profile, setProfile] = useState(() => getLocalData('vicky_profile', DEFAULT_PROFILE));
  const [spotlight, setSpotlight] = useState(() => getLocalData('vicky_spotlight', DEFAULT_SPOTLIGHT));
  const [projects, setProjects] = useState(() => getLocalData('vicky_projects', DEFAULT_PROJECTS));
  const [experiences, setExperiences] = useState(() => getLocalData('vicky_experiences', DEFAULT_EXPERIENCES));
  const [customSections, setCustomSections] = useState(() => getLocalData('vicky_custom_sections', DEFAULT_CUSTOM_SECTIONS));
  
  // Create Struct Context States
  const [newProject, setNewProject] = useState({ title: '', description: '', web_url: '', category: '', photo: '' });
  const [newExperience, setNewExperience] = useState({ company: '', role: '', duration: '', description: '', companyLogo: '' });
  const [newSection, setNewSection] = useState({ title: '', content: '', titleColor: '#1d1d1f', contentColor: '#6b7280', ventureLogo: '' });
  
  // Inline Editor Working States
  const [editingSectionId, setEditingSectionId] = useState(null);
  const [editingSectionData, setEditingSectionData] = useState(null);
  const [editingExpId, setEditingExpId] = useState(null);
  const [editingExpData, setEditingExpData] = useState(null);
  
  const [notify, setNotify] = useState('');

  const triggerToast = (msg) => {
    setNotify(msg);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => setNotify(''), 3000);
  };

  const handleMediaPipe = (e, callback) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => callback(reader.result);
    reader.readAsDataURL(file);
  };

  // FIX: setLocalData now reports success/failure (e.g. storage quota exceeded
  // from large base64 images); surface that instead of failing silently.
  const saveConfigurations = (key, data, toastMsg) => {
    const success = setLocalData(key, data);
    // Dispatch structural storage triggers to invoke realtime rendering inside the parent window frame
    window.dispatchEvent(new Event('storage'));
    triggerToast(success ? toastMsg : 'Save failed — browser storage limit reached. Try a smaller image.');
  };

  // Custom Categories Engines
  const createCustomSection = (e) => {
    e.preventDefault();
    const updated = [...customSections, { id: genId('c'), ...newSection }];
    setCustomSections(updated);
    saveConfigurations('vicky_custom_sections', updated, 'New custom category block generated!');
    setNewSection({ title: '', content: '', titleColor: '#1d1d1f', contentColor: '#6b7280', ventureLogo: '' });
  };

  const initiateSectionEdit = (sec) => {
    setEditingSectionId(sec.id);
    setEditingSectionData({ ...sec });
  };

  const saveSectionInlineMutation = () => {
    const updated = customSections.map(s => s.id === editingSectionId ? editingSectionData : s);
    setCustomSections(updated);
    saveConfigurations('vicky_custom_sections', updated, 'Custom layout context updated inline.');
    setEditingSectionId(null);
    setEditingSectionData(null);
  };

  const dropCustomSection = (id) => {
    const updated = customSections.filter(s => s.id !== id);
    setCustomSections(updated);
    saveConfigurations('vicky_custom_sections', updated, 'Section structural block scrubbed.');
  };

  // Experience Mutations Engine
  const initiateExpEdit = (exp) => {
    setEditingExpId(exp.id);
    setEditingExpData({ ...exp });
  };

  const saveExpInlineMutation = () => {
    const updated = experiences.map(e => e.id === editingExpId ? editingExpData : e);
    setExperiences(updated);
    saveConfigurations('vicky_experiences', updated, 'Experience historical node saved.');
    setEditingExpId(null);
    setEditingExpData(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-6 md:p-12 font-sans antialiased pb-32">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Control Banner Header */}
        <div className="flex justify-between items-center bg-white border border-gray-200 p-6 rounded-2xl shadow-sm">
          <div>
            <h1 className="text-xl font-bold tracking-tight">System Workspace Dashboard</h1>
            <p className="text-[10px] text-gray-400 font-mono uppercase tracking-wider">Design Controls Mapping Live Variables</p>
          </div>
          <button onClick={() => { localStorage.removeItem('vicky_auth_session'); setAuth(false); navigate('/adminvicky/login'); }} className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl text-xs font-semibold transition">
            Close Session
          </button>
        </div>

        {notify && <div className="p-4 bg-gray-900 text-white text-xs font-semibold rounded-xl animate-fade-in">⚡ {notify}</div>}

        {/* COMPREHENSIVE TEXTURE AND GLOBAL LAYOUT OPTIMIZER */}
        <form onSubmit={(e) => { e.preventDefault(); saveConfigurations('vicky_theme', theme, 'Aesthetic configuration matrix committed!'); }} className="bg-white border border-gray-200 p-6 rounded-2xl space-y-6 shadow-sm">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 border-b pb-2">🎨 Aesthetic Canvas & Global Controls</h3>
          
          {/* Spotlight Intercept Toggle Architecture Switch */}
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-200/60 flex items-center justify-between">
            <div className="space-y-0.5">
              <label className="text-xs font-bold text-gray-900 block">Spotlight Banner Component Visibility</label>
              <span className="text-[11px] text-gray-400 block">Toggle rendering of the global enterprise highlight frame inside visitor streams.</span>
            </div>
            <button 
              type="button"
              onClick={() => {
                const nextVisibilityState = !theme.showSpotlight;
                setTheme({ ...theme, showSpotlight: nextVisibilityState });
                setLocalData('vicky_theme', { ...theme, showSpotlight: nextVisibilityState });
                window.dispatchEvent(new Event('storage'));
              }}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all duration-200 uppercase ${theme.showSpotlight ? 'bg-green-600 text-white' : 'bg-gray-300 text-gray-700'}`}
            >
              {theme.showSpotlight ? 'Active Render' : 'Hidden Switch'}
            </button>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase">Accent Design Tone</label>
              <div className="flex gap-2">
                <input type="color" value={theme.accentColor} onChange={e => setTheme({...theme, accentColor: e.target.value})} className="w-10 h-10 border border-gray-200 rounded cursor-pointer" />
                <input type="text" value={theme.accentColor} onChange={e => setTheme({...theme, accentColor: e.target.value})} className="w-full border border-gray-200 p-2 text-xs font-mono rounded-xl outline-none" />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase">Global Page Background</label>
              <div className="flex gap-2">
                <input type="color" value={theme.bgPrimary} onChange={e => setTheme({...theme, bgPrimary: e.target.value})} className="w-10 h-10 border border-gray-200 rounded cursor-pointer" />
                <input type="text" value={theme.bgPrimary} onChange={e => setTheme({...theme, bgPrimary: e.target.value})} className="w-full border border-gray-200 p-2 text-xs font-mono rounded-xl outline-none" />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase">Primary Typography text</label>
              <div className="flex gap-2">
                <input type="color" value={theme.textColor} onChange={e => setTheme({...theme, textColor: e.target.value})} className="w-10 h-10 border border-gray-200 rounded cursor-pointer" />
                <input type="text" value={theme.textColor} onChange={e => setTheme({...theme, textColor: e.target.value})} className="w-full border border-gray-200 p-2 text-xs font-mono rounded-xl outline-none" />
              </div>
            </div>
          </div>

          {/* Section Heading Text Color Customization Dashboard Corridor */}
          <div className="pt-4 border-t border-gray-100 space-y-4">
            <label className="block text-[11px] font-extrabold text-gray-900 uppercase tracking-wide">🎨 Custom Section Heading Text Colors (h3 labels)</label>
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 space-y-1.5">
                <span className="text-[10px] font-bold text-gray-500 uppercase">Philosophy Label Color</span>
                <div className="flex gap-1.5"><input type="color" value={theme.aboutHeaderColor || '#9ca3af'} onChange={e => setTheme({...theme, aboutHeaderColor: e.target.value})} className="w-8 h-8 rounded cursor-pointer" /><input type="text" value={theme.aboutHeaderColor || '#9ca3af'} onChange={e => setTheme({...theme, aboutHeaderColor: e.target.value})} className="w-full bg-white border border-gray-200 text-[11px] px-2 py-1 font-mono rounded-lg outline-none" /></div>
              </div>
              <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 space-y-1.5">
                <span className="text-[10px] font-bold text-gray-500 uppercase">Professional Log Color</span>
                <div className="flex gap-1.5"><input type="color" value={theme.experienceHeaderColor || '#9ca3af'} onChange={e => setTheme({...theme, experienceHeaderColor: e.target.value})} className="w-8 h-8 rounded cursor-pointer" /><input type="text" value={theme.experienceHeaderColor || '#9ca3af'} onChange={e => setTheme({...theme, experienceHeaderColor: e.target.value})} className="w-full bg-white border border-gray-200 text-[11px] px-2 py-1 font-mono rounded-lg outline-none" /></div>
              </div>
              <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 space-y-1.5">
                <span className="text-[10px] font-bold text-gray-500 uppercase">Selected Works Color</span>
                <div className="flex gap-1.5"><input type="color" value={theme.projectHeaderColor || '#9ca3af'} onChange={e => setTheme({...theme, projectHeaderColor: e.target.value})} className="w-8 h-8 rounded cursor-pointer" /><input type="text" value={theme.projectHeaderColor || '#9ca3af'} onChange={e => setTheme({...theme, projectHeaderColor: e.target.value})} className="w-full bg-white border border-gray-200 text-[11px] px-2 py-1 font-mono rounded-lg outline-none" /></div>
              </div>
            </div>
          </div>

          {/* Section Base Block Colors */}
          <div className="pt-4 border-t border-gray-100 space-y-4">
            <label className="block text-[11px] font-extrabold text-gray-900 uppercase tracking-wide">🔧 Section Block Container Hex Colors</label>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 space-y-1.5">
                <span className="text-[10px] font-bold text-gray-500 uppercase">About Cards</span>
                <div className="flex gap-1.5"><input type="color" value={theme.aboutCardBg || '#ffffff'} onChange={e => setTheme({...theme, aboutCardBg: e.target.value})} className="w-8 h-8 rounded cursor-pointer" /><input type="text" value={theme.aboutCardBg || '#ffffff'} onChange={e => setTheme({...theme, aboutCardBg: e.target.value})} className="w-full bg-white border border-gray-200 text-[11px] px-2 py-1 outline-none font-mono rounded-lg" /></div>
              </div>
              <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 space-y-1.5">
                <span className="text-[10px] font-bold text-gray-500 uppercase">Spotlight Banner</span>
                <div className="flex gap-1.5"><input type="color" value={theme.spotlightCardBg || '#ffffff'} onChange={e => setTheme({...theme, spotlightCardBg: e.target.value})} className="w-8 h-8 rounded cursor-pointer" /><input type="text" value={theme.spotlightCardBg || '#ffffff'} onChange={e => setTheme({...theme, spotlightCardBg: e.target.value})} className="w-full bg-white border border-gray-200 text-[11px] px-2 py-1 outline-none font-mono rounded-lg" /></div>
              </div>
              <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 space-y-1.5">
                <span className="text-[10px] font-bold text-gray-500 uppercase">Timeline Experience</span>
                <div className="flex gap-1.5"><input type="color" value={theme.experienceCardBg || '#ffffff'} onChange={e => setTheme({...theme, experienceCardBg: e.target.value})} className="w-8 h-8 rounded cursor-pointer" /><input type="text" value={theme.experienceCardBg || '#ffffff'} onChange={e => setTheme({...theme, experienceCardBg: e.target.value})} className="w-full bg-white border border-gray-200 text-[11px] px-2 py-1 outline-none font-mono rounded-lg" /></div>
              </div>
              <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 space-y-1.5">
                <span className="text-[10px] font-bold text-gray-500 uppercase">Project Grids</span>
                <div className="flex gap-1.5"><input type="color" value={theme.projectCardBg || '#ffffff'} onChange={e => setTheme({...theme, projectCardBg: e.target.value})} className="w-8 h-8 rounded cursor-pointer" /><input type="text" value={theme.projectCardBg || '#ffffff'} onChange={e => setTheme({...theme, projectCardBg: e.target.value})} className="w-full bg-white border border-gray-200 text-[11px] px-2 py-1 outline-none font-mono rounded-lg" /></div>
              </div>
              <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 space-y-1.5">
                <span className="text-[10px] font-bold text-gray-500 uppercase">Custom Structural Blocks</span>
                <div className="flex gap-1.5"><input type="color" value={theme.customSectionCardBg || '#ffffff'} onChange={e => setTheme({...theme, customSectionCardBg: e.target.value})} className="w-8 h-8 rounded cursor-pointer" /><input type="text" value={theme.customSectionCardBg || '#ffffff'} onChange={e => setTheme({...theme, customSectionCardBg: e.target.value})} className="w-full bg-white border border-gray-200 text-[11px] px-2 py-1 outline-none font-mono rounded-lg" /></div>
              </div>
            </div>
          </div>

          <button type="submit" className="px-4 py-2 bg-gray-900 text-white rounded-xl text-xs font-medium hover:bg-gray-800 transition">Deploy Theme Tokens</button>
        </form>

        {/* CUSTOM SECTIONS WORKBENCH (WITH INDEPENDENT LIVE INLINE MUTATION MANAGEMENT FRAME) */}
        <div className="bg-white border border-gray-200 p-6 rounded-2xl space-y-6 shadow-sm">
          <form onSubmit={createCustomSection} className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 border-b pb-2">➕ Create Custom Categories</h3>
            
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Section Headline Title (h3)</label>
                <input type="text" placeholder="e.g., My Ventures" value={newSection.title} onChange={e => setNewSection({...newSection, title: e.target.value})} required className="w-full border border-gray-200 p-2.5 text-xs rounded-xl outline-none" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Title Hex Color Code</label>
                <div className="flex gap-1.5">
                  <input type="color" value={newSection.titleColor} onChange={e => setNewSection({...newSection, titleColor: e.target.value})} className="w-8 h-8 rounded cursor-pointer shrink-0" />
                  <input type="text" value={newSection.titleColor} onChange={e => setNewSection({...newSection, titleColor: e.target.value})} className="w-full border border-gray-200 p-1 text-[11px] font-mono rounded-lg outline-none" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Body Content Hex Color Code (p)</label>
                <div className="flex gap-1.5">
                  <input type="color" value={newSection.contentColor} onChange={e => setNewSection({...newSection, contentColor: e.target.value})} className="w-8 h-8 rounded cursor-pointer shrink-0" />
                  <input type="text" value={newSection.contentColor} onChange={e => setNewSection({...newSection, contentColor: e.target.value})} className="w-full border border-gray-200 p-1 text-[11px] font-mono rounded-lg outline-none" />
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase">Section Block Content</label>
              <textarea placeholder="Outline tactical components..." value={newSection.content} onChange={e => setNewSection({...newSection, content: e.target.value})} required className="w-full border border-gray-200 p-2.5 text-xs rounded-xl h-16 outline-none" />
            </div>

            <div className="p-3 bg-gray-50 rounded-xl border border-gray-200/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <label className="text-[11px] font-bold text-gray-700 block">Venture Brand Logo Asset</label>
                <span className="text-[10px] text-gray-400 block">Upload an asset configuration. Empty fields hide the render pipeline without spacing gaps.</span>
              </div>
              <div className="flex items-center gap-2">
                <input type="file" accept="image/*" onChange={e => handleMediaPipe(e, (res) => setNewSection(p => ({ ...p, ventureLogo: res })))} className="text-xs text-gray-500" />
                {newSection.ventureLogo && (
                  <button type="button" onClick={() => setNewSection(p => ({ ...p, ventureLogo: "" }))} className="px-2 py-1 bg-red-100 text-red-600 font-bold rounded text-[10px]">Remove</button>
                )}
              </div>
            </div>

            <button type="submit" className="px-4 py-2 bg-gray-900 text-white rounded-xl text-xs font-medium hover:bg-gray-800 transition">Initialize Global Layout Section</button>
          </form>

          {/* CUSTOM CATEGORIES MANAGMENT AND MUTATION REGION */}
          {customSections.length > 0 && (
            <div className="space-y-4 pt-4 border-t border-gray-100">
              <label className="text-[10px] font-bold text-gray-400 uppercase block">Currently Active Custom Categories</label>
              <div className="grid gap-3">
                {customSections.map(s => (
                  <div key={s.id} className="bg-gray-50 border border-gray-200/70 p-4 rounded-xl space-y-3">
                    {editingSectionId === s.id ? (
                      <div className="space-y-3 p-2 bg-white border border-gray-200 rounded-lg">
                        <div className="grid sm:grid-cols-3 gap-2">
                          <input type="text" value={editingSectionData.title} onChange={e => setEditingSectionData({...editingSectionData, title: e.target.value})} className="border p-2 text-xs rounded-lg outline-none" />
                          <div>
                            <label className="text-[9px] block text-gray-400 font-bold">Title Color</label>
                            <input type="text" value={editingSectionData.titleColor} onChange={e => setEditingSectionData({...editingSectionData, titleColor: e.target.value})} className="border p-1 text-xs w-full font-mono rounded-lg" />
                          </div>
                          <div>
                            <label className="text-[9px] block text-gray-400 font-bold">Body Color</label>
                            <input type="text" value={editingSectionData.contentColor} onChange={e => setEditingSectionData({...editingSectionData, contentColor: e.target.value})} className="border p-1 text-xs w-full font-mono rounded-lg" />
                          </div>
                        </div>
                        <textarea value={editingSectionData.content} onChange={e => setEditingSectionData({...editingSectionData, content: e.target.value})} className="border w-full p-2 text-xs rounded-lg h-16" />
                        
                        <div className="flex justify-between items-center bg-gray-50 p-2 rounded-lg">
                          <span className="text-[10px] font-bold text-gray-500">Logo Matrix Block</span>
                          <div className="flex items-center gap-2">
                            <input type="file" accept="image/*" onChange={e => handleMediaPipe(e, (res) => setEditingSectionData(p => ({ ...p, ventureLogo: res })))} className="text-[10px]" />
                            {editingSectionData.ventureLogo && (
                              <button type="button" onClick={() => setEditingSectionData(p => ({ ...p, ventureLogo: "" }))} className="px-2 py-0.5 bg-red-100 text-red-600 rounded text-[9px] font-bold">Clear Logo</button>
                            )}
                          </div>
                        </div>

                        <div className="flex gap-2 justify-end">
                          <button type="button" onClick={() => { setEditingSectionId(null); setEditingSectionData(null); }} className="px-3 py-1 bg-gray-200 text-xs rounded-lg">Cancel</button>
                          <button type="button" onClick={saveSectionInlineMutation} className="px-3 py-1 bg-green-600 text-white text-xs rounded-lg font-bold">Apply Changes</button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-between items-start gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-3">
                            <span className="font-bold text-gray-800" style={{ color: s.titleColor }}>{s.title}</span>
                            <span className="text-[9px] bg-gray-200 px-1.5 py-0.5 rounded text-gray-500 font-mono">Colors: {s.titleColor || '#1d1d1f'} / {s.contentColor || '#6b7280'}</span>
                          </div>
                          <p className="text-xs text-gray-500 line-clamp-2" style={{ color: s.contentColor }}>{s.content}</p>
                          {s.ventureLogo && (
                            <div className="pt-1 flex items-center gap-1.5">
                              <span className="text-[9px] text-green-600 font-medium">✓ Venture Brand Logo Attached</span>
                              <img src={s.ventureLogo} alt="Preview Mini" className="w-5 h-5 object-contain border bg-white rounded" />
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <button type="button" onClick={() => initiateSectionEdit(s)} className="text-gray-600 hover:underline text-xs font-semibold">Modify</button>
                          <button type="button" onClick={() => dropCustomSection(s.id)} className="text-red-500 hover:underline text-xs font-semibold">Scrub Module</button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ENTERPRISE FOCUS FEATURE BANNER CONFIGURATION */}
        <form onSubmit={(e) => { e.preventDefault(); saveConfigurations('vicky_spotlight', spotlight, 'Enterprise spotlight configurations committed!'); }} className="bg-white border border-gray-200 p-6 rounded-2xl space-y-4 shadow-sm">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 border-b pb-2">🏢 Spotlight Banner Controller</h3>
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase">Feature Badge Label</label>
              <input type="text" value={spotlight.badge} onChange={e => setSpotlight({...spotlight, badge: e.target.value})} className="w-full border border-gray-200 p-2.5 text-xs rounded-xl outline-none" required />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase">Enterprise Asset Name</label>
              <input type="text" value={spotlight.title} onChange={e => setSpotlight({...spotlight, title: e.target.value})} className="w-full border border-gray-200 p-2.5 text-xs rounded-xl outline-none" required />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase">Target Integration URL Link</label>
              <input type="url" value={spotlight.link} onChange={e => setSpotlight({...spotlight, link: e.target.value})} className="w-full border border-gray-200 p-2.5 text-xs rounded-xl outline-none" />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase">Operational Banner Description</label>
            <textarea value={spotlight.description} onChange={e => setSpotlight({...spotlight, description: e.target.value})} className="w-full border border-gray-200 p-2.5 text-xs rounded-xl h-16 outline-none" required />
          </div>
          <button type="submit" className="px-4 py-2 bg-gray-900 text-white rounded-xl text-xs font-medium hover:bg-gray-800 transition">Save Spotlight Parameters</button>
        </form>

        {/* IDENTITY, HERO QUOTE, AND CORE BIOGRAPHY CONFIGURATIONS */}
        <form onSubmit={(e) => { e.preventDefault(); saveConfigurations('vicky_profile', profile, 'Identity profile committed successfully.'); }} className="bg-white border border-gray-200 p-6 rounded-2xl space-y-4 shadow-sm">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 border-b pb-2">👤 Profile Core Infrastructure Identity</h3>
          <div className="p-4 bg-gray-50 rounded-xl flex items-center gap-4 border border-gray-100">
            <div className="w-16 h-16 rounded-xl bg-gray-200 overflow-hidden border border-gray-300 shrink-0">
              {profile.avatar_photo && <img src={profile.avatar_photo} alt="Preview" className="w-full h-full object-cover" />}
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-bold text-gray-700">Upload Profile Display Photo</label>
              <input type="file" accept="image/*" onChange={e => handleMediaPipe(e, (res) => setProfile(prev => ({ ...prev, avatar_photo: res })))} className="text-xs cursor-pointer" />
            </div>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            <input type="text" value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})} className="border border-gray-200 p-2.5 text-xs rounded-xl outline-none" placeholder="Name Brand" required />
            <input type="text" value={profile.titleTitle} onChange={e => setProfile({...profile, titleTitle: e.target.value})} className="border border-gray-200 p-2.5 text-xs rounded-xl outline-none" placeholder="Designation Title" required />
            <input type="email" value={profile.contact_email} onChange={e => setProfile({...profile, contact_email: e.target.value})} className="border border-gray-200 p-2.5 text-xs rounded-xl outline-none" placeholder="Contact Email" required />
          </div>
          
          {/* Main Hero Quote Customization Input Slot */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase block">Main Hero Typography Heading Statement (Quote Header)</label>
            <textarea value={profile.heroHeading || ''} onChange={e => setProfile({...profile, heroHeading: e.target.value})} className="w-full border border-gray-200 p-2.5 text-xs rounded-xl h-14 outline-none" placeholder="e.g., Designing systems \nthat empower data." required />
          </div>

          <input type="text" value={profile.tagline} onChange={e => setProfile({...profile, tagline: e.target.value})} className="w-full border border-gray-200 p-2.5 text-xs rounded-xl outline-none" placeholder="Tagline Summary Statement" required />
          <textarea value={profile.about} onChange={e => setProfile({...profile, about: e.target.value})} className="w-full border border-gray-200 p-2.5 text-xs rounded-xl h-20 outline-none" placeholder="Detailed About Overview Summary..." required />
          <input type="text" value={profile.skills} onChange={e => setProfile({...profile, skills: e.target.value})} className="w-full border border-gray-200 p-2.5 text-xs rounded-xl outline-none" placeholder="Expertise Stack Tags" />
          <div className="grid sm:grid-cols-3 gap-4">
            <input type="url" placeholder="Blog Link" value={profile.blog_url} onChange={e => setProfile({...profile, blog_url: e.target.value})} className="border border-gray-200 p-2.5 text-xs rounded-xl outline-none" />
            <input type="url" placeholder="LinkedIn Node" value={profile.linkedin_url} onChange={e => setProfile({...profile, linkedin_url: e.target.value})} className="border border-gray-200 p-2.5 text-xs rounded-xl outline-none" />
            <input type="url" placeholder="GitHub Node" value={profile.github_url} onChange={e => setProfile({...profile, github_url: e.target.value})} className="border border-gray-200 p-2.5 text-xs rounded-xl outline-none" />
          </div>
          <button type="submit" className="px-4 py-2 bg-gray-900 text-white rounded-xl text-xs font-medium hover:bg-gray-800 transition">Save Profile Parameters</button>
        </form>

        {/* LOG TIMELINE EXPERIENCE WORKSTATION (WITH ZERO-PLACEHOLDER IMAGES & CRUD ACTIONS) */}
        <div className="bg-white border border-gray-200 p-6 rounded-2xl space-y-4 shadow-sm">
          <form onSubmit={(e) => { e.preventDefault(); const updated = [...experiences, { id: genId('e'), ...newExperience }]; setExperiences(updated); saveConfigurations('vicky_experiences', updated, 'Experience log node appended.'); setNewExperience({ company: '', role: '', duration: '', description: '', companyLogo: '' }); }} className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 border-b pb-2">💼 Log Timeline Event</h3>
            
            <div className="grid sm:grid-cols-3 gap-4">
              <input type="text" placeholder="Company / Institution" value={newExperience.company} onChange={e => setNewExperience({...newExperience, company: e.target.value})} required className="border border-gray-200 p-2.5 text-xs rounded-xl outline-none" />
              <input type="text" placeholder="Designation / Role" value={newExperience.role} onChange={e => setNewExperience({...newExperience, role: e.target.value})} required className="border border-gray-200 p-2.5 text-xs rounded-xl outline-none" />
              <input type="text" placeholder="Duration Metric" value={newExperience.duration} onChange={e => setNewExperience({...newExperience, duration: e.target.value})} required className="border border-gray-200 p-2.5 text-xs rounded-xl outline-none" />
            </div>
            
            <textarea placeholder="Outline operations and metrics..." value={newExperience.description} onChange={e => setNewExperience({...newExperience, description: e.target.value})} className="w-full border border-gray-200 p-2.5 text-xs rounded-xl h-16 outline-none" required />
            
            <div className="p-3 bg-gray-50 rounded-xl border border-gray-200/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <label className="text-xs font-bold text-gray-700 block">Company Corporate Logo Asset</label>
                <span className="text-[10px] text-gray-400 block">Uploading a logo passes it down stream. Clearing it hides container placeholders cleanly.</span>
              </div>
              <div className="flex items-center gap-2">
                <input type="file" accept="image/*" onChange={e => handleMediaPipe(e, (res) => setNewExperience(p => ({ ...p, companyLogo: res })))} className="text-xs text-gray-500" />
                {newExperience.companyLogo && (
                  <button type="button" onClick={() => setNewExperience(p => ({ ...p, companyLogo: "" }))} className="px-2 py-1 bg-red-100 text-red-600 font-bold rounded text-[10px]">Remove</button>
                )}
              </div>
            </div>

            <button type="submit" className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-xl text-xs font-medium transition">Append History Node</button>
          </form>

          {/* ACTIVE HISTORY LOG NODES MANAGER TRACK */}
          <div className="space-y-3 pt-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase block">Currently Active Corporate Log Tree</label>
            <div className="grid gap-2">
              {experiences.map(e => (
                <div key={e.id} className="bg-gray-50 border border-gray-100 p-3 rounded-xl">
                  {editingExpId === e.id ? (
                    <div className="space-y-2 p-2 bg-white border rounded-lg">
                      <div className="grid sm:grid-cols-3 gap-2">
                        <input type="text" value={editingExpData.company} onChange={e => setEditingExpData({...editingExpData, company: e.target.value})} className="border p-1.5 text-xs rounded" />
                        <input type="text" value={editingExpData.role} onChange={e => setEditingExpData({...editingExpData, role: e.target.value})} className="border p-1.5 text-xs rounded" />
                        <input type="text" value={editingExpData.duration} onChange={e => setEditingExpData({...editingExpData, duration: e.target.value})} className="border p-1.5 text-xs rounded" />
                      </div>
                      <textarea value={editingExpData.description} onChange={e => setEditingExpData({...editingExpData, description: e.target.value})} className="border w-full p-2 text-xs rounded h-12" />
                      
                      <div className="flex justify-between items-center bg-gray-50 p-2 rounded">
                        <span className="text-[10px] font-bold text-gray-400">Media Pipeline Logo</span>
                        <div className="flex items-center gap-2">
                          <input type="file" accept="image/*" onChange={e => handleMediaPipe(e, (res) => setEditingExpData(p => ({ ...p, companyLogo: res })))} className="text-[10px]" />
                          {editingExpData.companyLogo && (
                            <button type="button" onClick={() => setEditingExpData(p => ({ ...p, companyLogo: "" }))} className="px-2 py-0.5 bg-red-100 text-red-600 rounded text-[9px] font-bold">Scrub Logo</button>
                          )}
                        </div>
                      </div>

                      <div className="flex justify-end gap-2">
                        <button type="button" onClick={() => { setEditingExpId(null); setEditingExpData(null); }} className="px-2 py-1 bg-gray-200 text-xs rounded">Cancel</button>
                        <button type="button" onClick={saveExpInlineMutation} className="px-2 py-1 bg-green-600 text-white text-xs font-bold rounded">Save Node</button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-between items-center text-xs">
                      <div>
                        <span className="font-bold">{e.role}</span> at <span className="text-gray-600">{e.company}</span>
                        {e.companyLogo && <span className="ml-2 text-[10px] text-green-600 bg-green-50 px-1 py-0.2 rounded font-medium">✓ Logo Loaded</span>}
                      </div>
                      <div className="flex items-center gap-3">
                        <button type="button" onClick={() => initiateExpEdit(e)} className="text-gray-600 hover:underline">Edit</button>
                        <button type="button" onClick={() => { const updated = experiences.filter(ex => ex.id !== e.id); setExperiences(updated); saveConfigurations('vicky_experiences', updated, 'Experience log node scrubbed.'); }} className="text-red-500 hover:underline">Remove</button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* PROJECT BLUEPRINT RENDER LOG MODULE */}
        <div className="bg-white border border-gray-200 p-6 rounded-2xl space-y-4 shadow-sm">
          <form onSubmit={(e) => { e.preventDefault(); const updated = [...projects, { id: genId('p'), ...newProject }]; setProjects(updated); saveConfigurations('vicky_projects', updated, 'Project cards compiled.'); setNewProject({ title: '', description: '', web_url: '', category: '', photo: '' }); }} className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 border-b pb-2">🚀 Deploy Case Study Card</h3>
            <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between">
              <label className="text-xs font-bold text-gray-700">Project Cover Image Asset</label>
              <input type="file" accept="image/*" onChange={e => handleMediaPipe(e, (res) => setNewProject(prev => ({ ...prev, photo: res })))} className="text-xs text-gray-500 cursor-pointer" />
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              <input type="text" placeholder="Project Workspace Title" value={newProject.title} onChange={e => setNewProject({...newProject, title: e.target.value})} required className="border border-gray-200 p-2.5 text-xs rounded-xl outline-none" />
              <input type="text" placeholder="Classification Category" value={newProject.category} onChange={e => setNewProject({...newProject, category: e.target.value})} className="border border-gray-200 p-2.5 text-xs rounded-xl outline-none" />
              <input type="url" placeholder="Target Endpoint Link (URL)" value={newProject.web_url} onChange={e => setNewProject({...newProject, web_url: e.target.value})} className="border border-gray-200 p-2.5 text-xs rounded-xl outline-none" />
            </div>
            <textarea placeholder="Describe build vectors and technologies..." value={newProject.description} onChange={e => setNewProject({...newProject, description: e.target.value})} className="w-full border border-gray-200 p-2.5 text-xs rounded-xl h-16 outline-none" required />
            <button type="submit" className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-xl text-xs font-medium transition">Commit Card Deployment</button>
          </form>
          <div className="space-y-2">
            {projects.map(p => (
              <div key={p.id} className="flex justify-between items-center bg-gray-50 border border-gray-100 p-3 rounded-xl text-xs">
                <span className="font-bold">{p.title}</span>
                <button type="button" onClick={() => { const updated = projects.filter(pr => pr.id !== p.id); setProjects(updated); saveConfigurations('vicky_projects', updated, 'Project stripped.'); }} className="text-red-500 hover:underline">Strip Blueprint</button>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
