'use client';
import { useEffect, useState } from 'react';

interface NewsItem {
  title: string;
  link: string;
  pubDate: string;
  source: string;
  category: string;
  content: string;
}

function timeAgo(dateStr: string) {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 60000);
  if (diff < 60) return `לפני ${diff} דקות`;
  if (diff < 1440) return `לפני ${Math.floor(diff / 60)} שעות`;
  return `לפני ${Math.floor(diff / 1440)} ימים`;
}

function TradingViewTicker() {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js';
    script.async = true;
    script.innerHTML = JSON.stringify({
      symbols: [
        { proName: 'FOREXCOM:SPXUSD', title: 'S&P 500' },
        { proName: 'NASDAQ:NDX', title: 'NASDAQ' },
        { description: 'TA-35', proName: 'TASE:TA35' },
        { description: 'BTC', proName: 'BINANCE:BTCUSDT' },
        { description: 'USD/ILS', proName: 'FX:USDILS' },
        { description: 'זהב', proName: 'FOREXCOM:XAUUSD' },
        { description: 'נפט', proName: 'NYMEX:CL1!' },
        { description: 'AAPL', proName: 'NASDAQ:AAPL' },
        { description: 'TSLA', proName: 'NASDAQ:TSLA' },
        { description: 'NVDA', proName: 'NASDAQ:NVDA' },
      ],
      showSymbolLogo: false,
      isTransparent: false,
      displayMode: 'adaptive',
      colorTheme: 'dark',
      locale: 'he_IL',
    });
    const container = document.getElementById('tv-ticker');
    if (container && !container.querySelector('script')) container.appendChild(script);
  }, []);
  return <div id="tv-ticker" className="tradingview-widget-container"><div className="tradingview-widget-container__widget"></div></div>;
}

function TradingViewMarket() {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-market-overview.js';
    script.async = true;
    script.innerHTML = JSON.stringify({
      colorTheme: 'dark',
      dateRange: '1D',
      showChart: false,
      locale: 'he_IL',
      width: '100%',
      height: '220',
      isTransparent: true,
      showSymbolLogo: false,
      tabs: [
        { title: 'ישראל', symbols: [{ s: 'TASE:TA35', d: 'TA-35' }, { s: 'TASE:TA90', d: 'TA-90' }, { s: 'FX:USDILS', d: 'USD/ILS' }] },
        { title: 'ארה"ב', symbols: [{ s: 'FOREXCOM:SPXUSD', d: 'S&P 500' }, { s: 'NASDAQ:NDX', d: 'NASDAQ' }, { s: 'DJ:DJI', d: 'DOW' }] },
        { title: 'אירופה', symbols: [{ s: 'FOREXCOM:DEU40', d: 'DAX' }, { s: 'SPREADEX:FTSE', d: 'FTSE 100' }, { s: 'EURONEXT:CAC40', d: 'CAC 40' }] },
      ],
    });
    const container = document.getElementById('tv-market');
    if (container && !container.querySelector('script')) container.appendChild(script);
  }, []);
  return <div id="tv-market" className="tradingview-widget-container"><div className="tradingview-widget-container__widget"></div></div>;
}

function TradingViewSearch({ symbol, onClose }: { symbol: string; onClose: () => void }) {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-symbol-overview.js';
    script.async = true;
    script.innerHTML = JSON.stringify({
      symbols: [[symbol]],
      chartOnly: false,
      width: '100%',
      height: '400',
      locale: 'he_IL',
      colorTheme: 'dark',
      autosize: false,
      showVolume: false,
    });
    const container = document.getElementById('tv-symbol');
    if (container && !container.querySelector('script')) container.appendChild(script);
  }, [symbol]);

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ background: '#111827', border: '1px solid #1e2330', borderRadius: '12px', width: '100%', maxWidth: '800px', padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <span style={{ color: '#f1f5f9', fontWeight: 500, fontSize: '16px' }}>{symbol}</span>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '20px', cursor: 'pointer' }}>✕</button>
        </div>
        <div id="tv-symbol" className="tradingview-widget-container"><div className="tradingview-widget-container__widget"></div></div>
      </div>
    </div>
  );
}

function FearGreed() {
  const [showTooltip, setShowTooltip] = useState(false);
  const value = 68;
  const label = value >= 75 ? 'חמדנות קיצונית' : value >= 55 ? 'חמדנות' : value >= 45 ? 'ניטרלי' : value >= 25 ? 'פחד' : 'פחד קיצוני';
  const color = value >= 75 ? '#ef4444' : value >= 55 ? '#f59e0b' : value >= 45 ? '#94a3b8' : value >= 25 ? '#3b82f6' : '#6366f1';
  const angle = (value / 100) * 180 - 90;

  return (
    <div style={{ background: '#111827', border: '1px solid #1e2330', borderRadius: '10px', padding: '16px', marginBottom: '16px', position: 'relative' }}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}>

      {showTooltip && (
        <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: '8px', background: '#1e293b', border: '1px solid #334155', borderRadius: '10px', padding: '14px', zIndex: 100, width: '260px', fontSize: '12px', color: '#94a3b8', lineHeight: 1.6 }}>
          <div style={{ fontSize: '13px', fontWeight: 500, color: '#f1f5f9', marginBottom: '8px' }}>מדד פחד/חמדנות</div>
          <p style={{ margin: '0 0 8px' }}>מדד זה מראה את הסנטימנט הכללי של המשקיעים בשוק, בסולם מ-0 עד 100.</p>
          <div style={{ display: 'grid', gap: '4px' }}>
            <div><span style={{ color: '#6366f1' }}>■</span> 0–24 פחד קיצוני – המשקיעים פאניקה</div>
            <div><span style={{ color: '#3b82f6' }}>■</span> 25–44 פחד – זהירות בשוק</div>
            <div><span style={{ color: '#94a3b8' }}>■</span> 45–54 ניטרלי – שוק מאוזן</div>
            <div><span style={{ color: '#f59e0b' }}>■</span> 55–74 חמדנות – אופטימיות</div>
            <div><span style={{ color: '#ef4444' }}>■</span> 75–100 חמדנות קיצונית – שוק חם מאוד</div>
          </div>
          <div style={{ marginTop: '8px', fontSize: '11px', color: '#475569' }}>כלי זה משמש משקיעים להחלטות קנייה ומכירה.</div>
        </div>
      )}

      <div style={{ fontSize: '10px', color: '#475569', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>מדד פחד/חמדנות</span>
        <span style={{ fontSize: '14px' }}>ℹ️</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <svg width="80" height="48" viewBox="0 0 80 48">
          <path d="M8 44 A32 32 0 0 1 72 44" fill="none" stroke="#1e2330" strokeWidth="8" strokeLinecap="round" />
          <path d="M8 44 A32 32 0 0 1 72 44" fill="none" stroke={color} strokeWidth="8" strokeLinecap="round"
            strokeDasharray={`${value * 1.005} 100.5`} />
          <line x1="40" y1="44" x2={40 + 28 * Math.cos((angle * Math.PI) / 180)} y2={44 + 28 * Math.sin((angle * Math.PI) / 180)}
            stroke="#f1f5f9" strokeWidth="2" strokeLinecap="round" />
          <circle cx="40" cy="44" r="3" fill="#f1f5f9" />
        </svg>
        <div>
          <div style={{ fontSize: '24px', fontWeight: 500, color }}>{value}</div>
          <div style={{ fontSize: '12px', color: '#94a3b8' }}>{label}</div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('הכל');
  const [isMobile, setIsMobile] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [lang, setLang] = useState<'he' | 'en'>('he');
  const [selectedArticle, setSelectedArticle] = useState<NewsItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    fetch('/api/news')
      .then(r => r.json())
      .then(data => { setNews(data.items || []); setLoading(false); });
  }, []);

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      const sym = searchQuery.toUpperCase().trim();
      setSelectedSymbol(sym);
      setSearchHistory(prev => [sym, ...prev.filter(s => s !== sym)].slice(0, 5));
      setSearchQuery('');
    }
  };

  const shareWhatsapp = (article: NewsItem) => {
    const text = encodeURIComponent(`${article.title}\n${article.link}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const shareTelegram = (article: NewsItem) => {
    const text = encodeURIComponent(article.title);
    const url = encodeURIComponent(article.link);
    window.open(`https://t.me/share/url?url=${url}&text=${text}`, '_blank');
  };

  const categories = ['הכל', 'מניות', 'כלכלה', 'עסקים', 'ישראל'];
  const filtered = activeCategory === 'הכל' ? news : news.filter(n => n.category === activeCategory);
  const hero = filtered[0];
  const secondary = filtered.slice(1, isMobile ? 3 : 5);
  const cards = filtered.slice(isMobile ? 3 : 5);

  const C = {
    bg: isDark ? '#0d0f14' : '#f8fafc',
    bgCard: isDark ? '#111827' : '#ffffff',
    bgSide: isDark ? '#0a0c10' : '#f1f5f9',
    border: isDark ? '#1e2330' : '#e2e8f0',
    borderLight: isDark ? '#253047' : '#cbd5e1',
    text: isDark ? '#f1f5f9' : '#0f172a',
    textMuted: isDark ? '#94a3b8' : '#475569',
    textDim: isDark ? '#475569' : '#94a3b8',
    accent: '#3b82f6',
    up: '#22c55e',
    down: '#ef4444',
  };

  return (
    <main dir="rtl" style={{ background: C.bg, minHeight: '100vh', fontFamily: 'system-ui,sans-serif', transition: 'background .2s' }}>

      {selectedSymbol && (
        <TradingViewSearch symbol={selectedSymbol} onClose={() => setSelectedSymbol(null)} />
      )}

      {/* Article Modal */}
      {selectedArticle && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 1000, overflowY: 'auto', padding: '20px' }}>
          <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: '12px', maxWidth: '800px', margin: '0 auto', padding: isMobile ? '20px 16px' : '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              <span style={{ fontSize: '11px', color: C.accent, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '.5px' }}>{selectedArticle.source} · {selectedArticle.category}</span>
              <button onClick={() => setSelectedArticle(null)} style={{ background: 'none', border: 'none', color: C.textMuted, fontSize: '20px', cursor: 'pointer' }}>✕</button>
            </div>
            <h1 style={{ fontSize: isMobile ? '20px' : '26px', fontWeight: 500, color: C.text, lineHeight: 1.4, marginBottom: '12px' }}>{selectedArticle.title}</h1>
            <div style={{ fontSize: '12px', color: C.textDim, marginBottom: '20px' }}>{timeAgo(selectedArticle.pubDate)} · {selectedArticle.source}</div>
            {selectedArticle.content && (
              <p style={{ fontSize: '15px', color: C.textMuted, lineHeight: 1.7, marginBottom: '24px' }}>{selectedArticle.content}</p>
            )}
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button onClick={() => shareWhatsapp(selectedArticle)} style={{ background: '#25d366', border: 'none', color: '#fff', padding: '8px 16px', borderRadius: '8px', fontSize: '13px', cursor: 'pointer', fontWeight: 500 }}>
                שתף בוואטסאפ
              </button>
              <button onClick={() => shareTelegram(selectedArticle)} style={{ background: '#0088cc', border: 'none', color: '#fff', padding: '8px 16px', borderRadius: '8px', fontSize: '13px', cursor: 'pointer', fontWeight: 500 }}>
                שתף בטלגרם
              </button>
              <a href={selectedArticle.link} target="_blank" rel="noopener noreferrer" style={{ background: 'transparent', border: `1px solid ${C.border}`, color: C.textMuted, padding: '8px 16px', borderRadius: '8px', fontSize: '13px', cursor: 'pointer', textDecoration: 'none' }}>
                {lang === 'he' ? 'קרא מקור' : 'Read Original'}
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Topbar */}
      <nav style={{ background: C.bg, borderBottom: `1px solid ${C.border}`, padding: '0 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '52px', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          <span style={{ fontSize: '16px', fontWeight: 500, color: C.text }}>TBD</span>
          <span style={{ background: C.accent, color: '#fff', fontSize: '9px', padding: '2px 6px', borderRadius: '3px' }}>BETA</span>
        </div>

        {/* Search */}
        <div style={{ flex: 1, maxWidth: '300px' }}>
          <input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onKeyDown={handleSearch}
            placeholder="חפש מניה... (AAPL, TEVA, NVDA)"
            style={{ width: '100%', background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: '8px', padding: '6px 12px', fontSize: '12px', color: C.text, outline: 'none' }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
          {!isMobile && (
            <div style={{ display: 'flex', gap: '18px' }}>
              {['מניות', 'קריפטו', 'נדל"ן', 'מאקרו'].map(n => (
                <a key={n} style={{ fontSize: '12px', color: C.textDim, textDecoration: 'none', cursor: 'pointer' }}>{n}</a>
              ))}
            </div>
          )}
          <button onClick={() => setLang(l => l === 'he' ? 'en' : 'he')} style={{ background: C.bgCard, border: `1px solid ${C.border}`, color: C.textMuted, padding: '4px 10px', borderRadius: '6px', fontSize: '11px', cursor: 'pointer' }}>
            {lang === 'he' ? 'EN' : 'עב'}
          </button>
          <button onClick={() => setIsDark(d => !d)} style={{ background: C.bgCard, border: `1px solid ${C.border}`, color: C.textMuted, padding: '4px 10px', borderRadius: '6px', fontSize: '14px', cursor: 'pointer' }}>
            {isDark ? '☀️' : '🌙'}
          </button>
        </div>
      </nav>

      {/* Search History */}
      {searchHistory.length > 0 && (
        <div style={{ background: C.bgCard, borderBottom: `1px solid ${C.border}`, padding: '8px 20px', display: 'flex', gap: '8px', alignItems: 'center', overflowX: 'auto' }}>
          <span style={{ fontSize: '11px', color: C.textDim, flexShrink: 0 }}>חיפושים אחרונים:</span>
          {searchHistory.map(s => (
            <button key={s} onClick={() => setSelectedSymbol(s)} style={{ background: C.bgSide, border: `1px solid ${C.border}`, color: C.accent, padding: '3px 10px', borderRadius: '20px', fontSize: '11px', cursor: 'pointer', flexShrink: 0 }}>{s}</button>
          ))}
        </div>
      )}

      {/* Ticker */}
      <div style={{ background: '#111827', borderBottom: `1px solid ${C.border}` }}>
        <TradingViewTicker />
      </div>

      {loading && (
        <div style={{ textAlign: 'center', padding: '60px', color: C.textDim, fontSize: '14px' }}>טוען חדשות...</div>
      )}

      {/* Hero + Sidebar */}
      {!loading && hero && (
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '2fr 1fr' }}>
          <div style={{ padding: isMobile ? '20px 16px' : '28px 24px', borderRight: isMobile ? 'none' : `1px solid ${C.border}`, borderBottom: isMobile ? `1px solid ${C.border}` : 'none', background: C.bg }}>
            <span style={{ fontSize: '11px', fontWeight: 500, color: C.accent, letterSpacing: '1px', textTransform: 'uppercase' }}>{hero.source} · {hero.category}</span>
            <h1 onClick={() => setSelectedArticle(hero)} style={{ fontSize: isMobile ? '18px' : '22px', fontWeight: 500, color: C.text, lineHeight: 1.45, margin: '12px 0 10px', cursor: 'pointer' }}>
              {hero.title}
            </h1>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '12px', color: C.textDim }}>{timeAgo(hero.pubDate)} · {hero.source}</span>
              <button onClick={() => shareWhatsapp(hero)} style={{ background: 'none', border: 'none', color: '#25d366', fontSize: '16px', cursor: 'pointer', padding: '0' }}>📱</button>
            </div>
            <hr style={{ border: 'none', borderTop: `1px solid ${C.border}`, margin: '20px 0' }} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' }}>
              {secondary.map((item, i) => (
                <div key={i} style={{ cursor: 'pointer' }} onClick={() => setSelectedArticle(item)}>
                  <div style={{ fontSize: '10px', fontWeight: 500, color: C.accent, textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: '5px' }}>{item.source}</div>
                  <div style={{ fontSize: '13px', color: C.textMuted, lineHeight: 1.45 }}>{item.title}</div>
                  <div style={{ fontSize: '11px', color: C.textDim, marginTop: '5px' }}>{timeAgo(item.pubDate)}</div>
                </div>
              ))}
            </div>
          </div>

          {!isMobile && (
            <div style={{ padding: '24px 20px', background: C.bgSide }}>
              <FearGreed />
              <div style={{ fontSize: '10px', color: C.textDim, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '12px', paddingBottom: '8px', borderBottom: `1px solid ${C.border}` }}>שוק בזמן אמת</div>
              <div style={{ background: C.bgCard, borderRadius: '8px', overflow: 'hidden', marginBottom: '20px', border: `1px solid ${C.border}` }}>
                <TradingViewMarket />
              </div>
              <div style={{ fontSize: '10px', color: C.textDim, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '12px', paddingBottom: '8px', borderBottom: `1px solid ${C.border}` }}>הכי חדש</div>
              {news.slice(0, 4).map((item, i) => (
                <div key={i} onClick={() => setSelectedArticle(item)} style={{ padding: '9px 0', borderBottom: `0.5px solid ${C.border}`, cursor: 'pointer' }}>
                  <div style={{ fontSize: '11px', color: C.accent, marginBottom: '3px', fontWeight: 500 }}>0{i + 1}</div>
                  <div style={{ fontSize: '12px', color: C.textMuted, lineHeight: 1.4 }}>{item.title}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Mobile Fear & Greed */}
      {!loading && isMobile && (
        <div style={{ padding: '12px 16px', borderBottom: `1px solid ${C.border}` }}>
          <FearGreed />
        </div>
      )}

      {/* Category Bar */}
      <div style={{ background: C.bgCard, borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, padding: '0 16px', display: 'flex', overflowX: 'auto' }}>
        {categories.map((c) => (
          <div key={c} onClick={() => setActiveCategory(c)} style={{ fontSize: '12px', color: activeCategory === c ? C.text : C.textDim, padding: '11px 16px', borderBottom: activeCategory === c ? `2px solid ${C.accent}` : '2px solid transparent', fontWeight: activeCategory === c ? 500 : 400, cursor: 'pointer', whiteSpace: 'nowrap' }}>
            {c}
          </div>
        ))}
      </div>

      {/* Cards */}
      {!loading && (
        <div style={{ background: C.bg, padding: isMobile ? '16px' : '20px 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3,1fr)', gap: '12px' }}>
            {cards.map((card, i) => (
              <div key={i} onClick={() => setSelectedArticle(card)} style={{ background: C.bgCard, border: `0.5px solid ${C.border}`, borderRadius: '10px', padding: '16px', cursor: 'pointer' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '7px' }}>
                  <div style={{ fontSize: '10px', fontWeight: 500, color: C.accent, textTransform: 'uppercase', letterSpacing: '.5px' }}>{card.source}</div>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button onClick={e => { e.stopPropagation(); shareWhatsapp(card); }} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px', padding: '0' }}>📱</button>
                    <button onClick={e => { e.stopPropagation(); shareTelegram(card); }} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px', padding: '0' }}>✈️</button>
                  </div>
                </div>
                <div style={{ fontSize: '13px', color: C.textMuted, lineHeight: 1.45, marginBottom: '8px' }}>{card.title}</div>
                <div style={{ fontSize: '11px', color: C.textDim }}>{timeAgo(card.pubDate)}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer style={{ background: C.bgCard, borderTop: `1px solid ${C.border}`, padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '13px', fontWeight: 500, color: C.textMuted }}>TBD</span>
        <span style={{ fontSize: '11px', color: C.textDim }}>כל הזכויות שמורות © 2025</span>
      </footer>

    </main>
  );
}