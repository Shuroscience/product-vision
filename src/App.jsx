import { useState, useEffect, useCallback } from 'react'
import { initialFeatures, STATUSES, PILLARS } from './features'
import { loadFromCloud, saveToCloud, fetchLinearTicket } from './api'

const accentMap = {
  Exploring: 'var(--status-exploring)',
  Designing: 'var(--status-designing)',
  Building: 'var(--status-building)',
  Shipped: 'var(--status-shipped)',
  Paused: 'var(--status-paused)',
};

function App() {
  const [features] = useState(initialFeatures);
  const [featureMeta, setFeatureMeta] = useState(() => {
    const meta = {};
    initialFeatures.forEach(f => {
      meta[f.id] = { status: f.status, targetDate: f.targetDate, pillar: f.pillar };
    });
    return meta;
  });
  const [cloudNotes, setCloudNotes] = useState({});
  const [route, setRoute] = useState({ view: 'gallery', featureId: null });
  const [filter, setFilter] = useState('All');
  const [saveStatus, setSaveStatus] = useState('idle');

  useEffect(() => {
    loadFromCloud().then(data => {
      if (data) {
        if (data.notes) setCloudNotes(data.notes);
        if (data.meta) setFeatureMeta(prev => ({ ...prev, ...data.meta }));
      }
    });
  }, []);

  const persist = useCallback(async (notes, meta) => {
    setSaveStatus('saving');
    const ok = await saveToCloud({ notes, meta });
    setSaveStatus(ok ? 'saved' : 'error');
    if (ok) setTimeout(() => setSaveStatus('idle'), 2000);
  }, []);

  const addNote = useCallback((featureId, note) => {
    setCloudNotes(prev => {
      const updated = { ...prev, [featureId]: [...(prev[featureId] || []), note] };
      persist(updated, featureMeta);
      return updated;
    });
  }, [featureMeta, persist]);

  const updateMeta = useCallback((featureId, updates) => {
    setFeatureMeta(prev => {
      const updated = { ...prev, [featureId]: { ...prev[featureId], ...updates } };
      persist(cloudNotes, updated);
      return updated;
    });
  }, [cloudNotes, persist]);

  const getNotesForFeature = (featureId) => {
    const feature = features.find(f => f.id === featureId);
    const defaults = feature?.defaultNotes || [];
    const cloud = cloudNotes[featureId] || [];
    return [...defaults, ...cloud].sort((a, b) => b.date.localeCompare(a.date));
  };

  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.slice(1);
      if (hash && hash !== '/') {
        if (features.find(f => f.id === hash)) {
          setRoute({ view: 'detail', featureId: hash });
          return;
        }
      }
      setRoute({ view: 'gallery', featureId: null });
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, [features]);

  const navigateTo = useCallback((id) => { window.location.hash = id || '/'; }, []);

  const enriched = features.map(f => ({
    ...f,
    status: featureMeta[f.id]?.status || f.status,
    targetDate: featureMeta[f.id]?.targetDate || f.targetDate,
    pillar: featureMeta[f.id]?.pillar || f.pillar,
    noteCount: (f.defaultNotes?.length || 0) + (cloudNotes[f.id]?.length || 0),
  }));

  const counts = enriched.reduce((a, f) => { a[f.status] = (a[f.status] || 0) + 1; return a; }, {});
  const filtered = filter === 'All' ? enriched : enriched.filter(f => f.status === filter);

  return (
    <div className="app-container">
      <header className="header">
        <div className="header-left">
          <div className="logo-mark">NS</div>
          <div>
            <div className="header-title">Product Vision</div>
            <div className="header-subtitle">NextSense Smartbuds Roadmap</div>
          </div>
        </div>
        {route.view === 'gallery' && (
          <nav className="header-nav">
            <button className={`nav-pill ${filter === 'All' ? 'active' : ''}`} onClick={() => setFilter('All')}>All ({enriched.length})</button>
            {STATUSES.map(s => counts[s] ? (
              <button key={s} className={`nav-pill ${filter === s ? 'active' : ''}`} onClick={() => setFilter(s)}>{s} ({counts[s]})</button>
            ) : null)}
          </nav>
        )}
      </header>

      {route.view === 'gallery' ? (
        <Gallery features={filtered} onSelect={navigateTo} />
      ) : (
        <DetailView
          feature={enriched.find(f => f.id === route.featureId)}
          notes={getNotesForFeature(route.featureId)}
          onBack={() => navigateTo(null)}
          onUpdateMeta={updateMeta}
          onAddNote={addNote}
          saveStatus={saveStatus}
        />
      )}
    </div>
  );
}

function Gallery({ features, onSelect }) {
  if (!features.length) return <div className="empty-state"><p>No features match this filter.</p></div>;
  return (
    <div className="gallery">
      {features.map(f => <FeatureCard key={f.id} feature={f} onClick={() => onSelect(f.id)} />)}
    </div>
  );
}

function CardPreview({ prototype }) {
  if (!prototype || prototype.type === 'placeholder') {
    return (
      <div className="card-preview card-preview-placeholder">
        <div className="card-preview-icon">◇</div>
      </div>
    );
  }
  if (prototype.type === 'figma') {
    return (
      <div className="card-preview">
        <iframe
          src={`https://www.figma.com/embed?embed_host=nextsense&url=${encodeURIComponent(prototype.url)}`}
          className="card-preview-iframe"
          tabIndex={-1}
          loading="lazy"
        />
      </div>
    );
  }
  if (prototype.type === 'iframe') {
    return (
      <div className="card-preview">
        <iframe
          src={prototype.url}
          className="card-preview-iframe"
          tabIndex={-1}
          loading="lazy"
        />
      </div>
    );
  }
  return (
    <div className="card-preview card-preview-placeholder">
      <div className="card-preview-icon">◇</div>
    </div>
  );
}

function FeatureCard({ feature, onClick }) {
  const firstProto = feature.prototypes?.[0] || null;
  return (
    <div className="feature-card" style={{ '--card-accent': accentMap[feature.status] }} onClick={onClick}>
      <CardPreview prototype={firstProto} />
      <div className="card-body">
      <div className="card-header"><div className="card-title">{feature.title}</div></div>
      <div className="card-summary">{feature.summary}</div>
      <div className="card-meta">
        <span className={`status-badge status-${feature.status.toLowerCase()}`}>
          <span className="status-dot"></span>{feature.status}
        </span>
        {feature.targetDate && <span className="ship-date">{feature.targetDate}</span>}
        <span className="pillar-tag">{feature.pillar}</span>
        {feature.noteCount > 0 && <span className="card-note-count">{feature.noteCount} note{feature.noteCount !== 1 ? 's' : ''}</span>}
      </div>
      </div>
    </div>
  );
}

function DetailView({ feature, notes, onBack, onUpdateMeta, onAddNote, saveStatus }) {
  if (!feature) {
    return (
      <div className="detail-view">
        <button className="back-link" onClick={onBack}>← All features</button>
        <div className="empty-state"><p>Feature not found.</p></div>
      </div>
    );
  }

  return (
    <div className="detail-view">
      <button className="back-link" onClick={onBack}>
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        All features
      </button>

      <div className="detail-header">
        <h1 className="detail-title">{feature.title}</h1>
        <p className="detail-summary">{feature.summary}</p>
        <div className="detail-meta">
          <div className="editable-field">
            <span className="field-label">Status</span>
            <select className="editable-select" value={feature.status} onChange={e => onUpdateMeta(feature.id, { status: e.target.value })}>
              {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="editable-field">
            <span className="field-label">Target</span>
            <input className="editable-input" type="text" value={feature.targetDate} onChange={e => onUpdateMeta(feature.id, { targetDate: e.target.value })} placeholder="e.g. Q2 2026" />
          </div>
          <div className="editable-field">
            <span className="field-label">Pillar</span>
            <select className="editable-select" value={feature.pillar} onChange={e => onUpdateMeta(feature.id, { pillar: e.target.value })}>
              {PILLARS.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <SaveIndicator status={saveStatus} />
        </div>
      </div>

      <div className="detail-sections">
        <div className="section-block">
          <div className="section-header"><span className="section-title">Prototypes</span></div>
          <div className="section-body"><PrototypeGallery prototypes={feature.prototypes || []} /></div>
        </div>

        <div className="section-block">
          <div className="section-header"><span className="section-title">Vision & Context</span></div>
          <div className="section-body" dangerouslySetInnerHTML={{ __html: feature.vision }} />
        </div>

        <div className="section-block">
          <div className="section-header">
            <span className="section-title">Notes & Tickets</span>
            <span style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>{notes.length} note{notes.length !== 1 ? 's' : ''}</span>
          </div>
          <div className="section-body">
            {notes.length === 0 && <p style={{ color: 'var(--text-tertiary)', fontStyle: 'italic' }}>No notes yet.</p>}
            {notes.map((note, i) => <NoteItem key={`${note.date}-${i}`} note={note} />)}
          </div>
          <AddNoteForm featureId={feature.id} onAdd={onAddNote} />
        </div>
      </div>
    </div>
  );
}

function NoteItem({ note }) {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    if (!note.tickets?.length) return;
    let cancelled = false;
    Promise.all(note.tickets.map(fetchLinearTicket)).then(res => {
      if (!cancelled) setTickets(res);
    });
    return () => { cancelled = true; };
  }, [note.tickets]);

  return (
    <div className="note-item">
      <div className="note-header">
        <span className="note-date">{note.date}</span>
        {note.author && <span className="note-author">{note.author}</span>}
      </div>
      <div className="note-text">{note.text}</div>
      {tickets.length > 0 && (
        <div className="note-tickets">
          {tickets.map(t => (
            <a key={t.id} href={t.url} target="_blank" rel="noopener noreferrer" className="linear-ticket">
              <svg className="linear-ticket-icon" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5.2 57.1a47.5 47.5 0 0 1 37.7 37.7L5.2 57.1Z" fill="currentColor"/>
                <path d="M2 50a48 48 0 0 0 3 16.5L43.5 5A48 48 0 0 0 2 50Z" fill="currentColor"/>
                <path d="M50 2a48 48 0 0 0-3.4.1L5.1 43.6A48 48 0 0 1 50 2Z" fill="currentColor"/>
                <path d="M98 50A48 48 0 0 1 50 98l48-48Z" fill="currentColor"/>
                <path d="M98 50A48 48 0 0 0 50 2l48 48Z" fill="currentColor"/>
              </svg>
              <span>{t.id}</span>
              {t.title && <span className="linear-ticket-title">— {t.title}</span>}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

function AddNoteForm({ featureId, onAdd }) {
  const [text, setText] = useState('');
  const [author, setAuthor] = useState(() => {
    try { return window.localStorage?.getItem('ns-vision-author') || ''; } catch { return ''; }
  });
  const [ticketInput, setTicketInput] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!text.trim()) return;
    setSubmitting(true);

    try { if (author.trim()) window.localStorage?.setItem('ns-vision-author', author.trim()); } catch {}

    const ticketIds = [];
    if (ticketInput.trim()) {
      const matches = ticketInput.match(/\b[A-Z]{1,6}-\d{1,6}\b/g);
      if (matches) ticketIds.push(...matches);
    }

    const note = {
      date: new Date().toISOString().split('T')[0],
      author: author.trim() || 'Anonymous',
      text: text.trim(),
      tickets: [...new Set(ticketIds)],
    };

    await onAdd(featureId, note);
    setText('');
    setTicketInput('');
    setSubmitting(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleSubmit();
  };

  return (
    <div className="add-note-form">
      <div className="add-note-input-group">
        <textarea
          className="add-note-textarea"
          placeholder="Add a note... (⌘+Enter to save)"
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={submitting}
        />
        <div className="add-note-bottom">
          <input
            className="add-note-small-input add-note-author-input"
            placeholder="Your name"
            value={author}
            onChange={e => setAuthor(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={submitting}
          />
          <input
            className="add-note-small-input add-note-ticket-input"
            placeholder="Linear tickets (e.g. NS-123, NS-456)"
            value={ticketInput}
            onChange={e => setTicketInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={submitting}
          />
          <button className="add-note-btn" onClick={handleSubmit} disabled={!text.trim() || submitting}>
            {submitting ? <span className="spinner" /> : 'Add note'}
          </button>
        </div>
      </div>
    </div>
  );
}

function SaveIndicator({ status }) {
  if (status === 'idle') return null;
  const map = { saving: ['saving', 'Saving…'], saved: ['saved', 'Saved'], error: ['error', 'Save failed'] };
  const [cls, label] = map[status] || [];
  if (!cls) return null;
  return <span className={`save-indicator ${cls}`}>{status === 'saving' && <span className="spinner" />}{label}</span>;
}

function PrototypeGallery({ prototypes }) {
  const [activeIdx, setActiveIdx] = useState(0);

  if (!prototypes || prototypes.length === 0) {
    return (
      <div className="prototype-area">
        <div className="prototype-placeholder">
          <div className="prototype-placeholder-icon">◇</div>
          <div>No prototypes attached yet</div>
        </div>
      </div>
    );
  }

  const current = prototypes[activeIdx] || prototypes[0];
  const hasMultiple = prototypes.length > 1;

  const typeLabel = (p) => {
    if (p.label) return p.label;
    const labels = { figma: 'Figma', image: 'Screenshot', html: 'Interactive', placeholder: 'Placeholder' };
    return labels[p.type] || p.type;
  };

  return (
    <div>
      {hasMultiple && (
        <div className="proto-tabs">
          {prototypes.map((p, i) => (
            <button
              key={i}
              className={`proto-tab ${i === activeIdx ? 'active' : ''}`}
              onClick={() => setActiveIdx(i)}
            >
              <span className="proto-tab-type">{typeLabel(p)}</span>
            </button>
          ))}
        </div>
      )}
      <PrototypeEmbed prototype={current} />
    </div>
  );
}

function PrototypeEmbed({ prototype }) {
  if (!prototype || prototype.type === 'placeholder') {
    return (
      <div className="prototype-area">
        <div className="prototype-placeholder">
          <div className="prototype-placeholder-icon">◇</div>
          <div>{prototype?.content || 'No prototype attached yet'}</div>
        </div>
      </div>
    );
  }
  if (prototype.type === 'image') return <div className="prototype-area"><img src={prototype.src} alt={prototype.alt || 'Prototype'} /></div>;
  if (prototype.type === 'figma') return <div className="prototype-area"><iframe src={`https://www.figma.com/embed?embed_host=nextsense&url=${encodeURIComponent(prototype.url)}`} allowFullScreen /></div>;
  if (prototype.type === 'html') return <div className="prototype-area"><iframe srcDoc={prototype.html} style={{ width: '100%', minHeight: '500px', border: 'none' }} /></div>;
  if (prototype.type === 'iframe') return <div className="prototype-area"><iframe src={prototype.url} style={{ width: '100%', minHeight: '700px', border: 'none' }} allowFullScreen /></div>;
  return null;
}

export default App
