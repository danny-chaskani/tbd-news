'use client';
import { useEffect, useState } from 'react';

interface NewsItem {
  title: string;
  link: string;
  pubDate: string;
  source: string;
  category: string;
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
        {
          title: 'מדדים',
          symbols: [
            { s: 'FOREXCOM:SPXUSD', d: 'S&P 500' },
            { s: 'NASDAQ:NDX', d: 'NASDAQ' },
            { s: 'TASE:TA35', d: 'TA-35' },
          ],
        },
        {
          title: 'מט"ח',
          symbols: [
            { s: 'FX:USDILS', d: 'USD/ILS' },
            { s: 'FX:EURUSD', d: 'EUR/USD' },
          ],
        },
      ],
    });
    const container = document.getElementById('tv-market');
    if (container && !container.querySelector('script')) container.appendChild(script);
  }, []);
  return <div id="tv-market" className="tradingview-widget-container"><div className="tradingview-widget-container__widget"></div></div>;
}

export default function Home() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('הכל');
  const [isMobile, setIsMobile] = useState(false);

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

  const categories = ['הכל', 'מניות', 'כלכלה', 'עסקים'];
  const filtered = activeCategory === 'הכל' ? news : news.filter(n => n.category === activeCategory);
  const hero = filtered[0];
  const secondary = filtered.slice(1, isMobile ? 3 : 5);
  const cards = filtered.slice(isMobile ? 3 : 5);

  const C = {
    bg: '#0d0f14',
    bgCard: '#111827',
    bgSide: '#0a0c10',
    border: '#1e2330',
    borderLight: '#253047',
    text: '#f1f5f9',
    textMuted: '#94a3b8',
    textDim: '#475569',
    accent: '#3b82f6',
    accentGold: '#f59e0b',
    up: '#22c55e',
    down: '#ef4444',
  };

  return (
    <main dir="rtl" style={{background:C.bg, minHeight:'100vh', fontFamily:'system-ui,sans-serif'}}>

      {/* Topbar */}
      <nav style={{background:C.bg, borderBottom:`1px solid ${C.border}`, padding:'0 20px', display:'flex', alignItems:'center', justifyContent:'space-between', height:'52px'}}>
        <div style={{display:'flex', alignItems:'center', gap:'8px'}}>
          <span style={{fontSize:'16px', fontWeight:500, color:C.text, letterSpacing:'.5px'}}>TBD</span>
          <span style={{background:C.accent, color:'#fff', fontSize:'9px', fontWeight:500, padding:'2px 6px', borderRadius:'3px', letterSpacing:'1px'}}>BETA</span>
        </div>
        {!isMobile && (
          <div style={{display:'flex', gap:'22px'}}>
            {['מניות','קריפטו','נדל"ן','מאקרו','דו"חות'].map(n => (
              <a key={n} style={{fontSize:'12px', color:C.textDim, textDecoration:'none', cursor:'pointer', transition:'color .15s'}}
                onMouseEnter={e => (e.currentTarget.style.color=C.textMuted)}
                onMouseLeave={e => (e.currentTarget.style.color=C.textDim)}>{n}</a>
            ))}
          </div>
        )}
      </nav>

      {/* Ticker */}
      <div style={{background:'#111827', borderBottom:`1px solid ${C.border}`}}>
        <TradingViewTicker />
      </div>

      {/* Loading */}
      {loading && (
        <div style={{textAlign:'center', padding:'60px', color:C.textDim, fontSize:'14px'}}>
          טוען חדשות...
        </div>
      )}

      {/* Hero + Sidebar */}
      {!loading && hero && (
        <div style={{display:'grid', gridTemplateColumns: isMobile ? '1fr' : '2fr 1fr'}}>

          {/* Hero */}
          <div style={{padding: isMobile ? '20px 16px' : '28px 24px', borderRight: isMobile ? 'none' : `1px solid ${C.border}`, borderBottom: isMobile ? `1px solid ${C.border}` : 'none', background:C.bg}}>
            <span style={{fontSize:'11px', fontWeight:500, color:C.accent, letterSpacing:'1px', textTransform:'uppercase'}}>{hero.source} · BREAKING</span>
            <h1 style={{fontSize: isMobile ? '18px' : '22px', fontWeight:500, color:C.text, lineHeight:1.45, margin:'12px 0 10px'}}>
              <a href={hero.link} target="_blank" rel="noopener noreferrer" style={{textDecoration:'none', color:'inherit'}}>{hero.title}</a>
            </h1>
            <span style={{fontSize:'12px', color:C.textDim}}>{timeAgo(hero.pubDate)} · {hero.source}</span>
            <hr style={{border:'none', borderTop:`1px solid ${C.border}`, margin:'20px 0'}} />
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'18px'}}>
              {secondary.map((item, i) => (
                <div key={i}>
                  <div style={{fontSize:'10px', fontWeight:500, color:C.accent, textTransform:'uppercase', letterSpacing:'.5px', marginBottom:'5px'}}>{item.source}</div>
                  <a href={item.link} target="_blank" rel="noopener noreferrer" style={{textDecoration:'none'}}>
                    <div style={{fontSize:'13px', color:C.textMuted, lineHeight:1.45}}>{item.title}</div>
                  </a>
                  <div style={{fontSize:'11px', color:C.textDim, marginTop:'5px'}}>{timeAgo(item.pubDate)}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          {!isMobile && (
            <div style={{padding:'24px 20px', background:C.bgSide, borderLeft:`1px solid ${C.border}`}}>
              <div style={{fontSize:'10px', fontWeight:500, color:C.textDim, letterSpacing:'1px', textTransform:'uppercase', marginBottom:'12px', paddingBottom:'8px', borderBottom:`1px solid ${C.border}`}}>שוק בזמן אמת</div>
              <div style={{background:C.bgCard, borderRadius:'8px', overflow:'hidden', marginBottom:'20px', border:`1px solid ${C.border}`}}>
                <TradingViewMarket />
              </div>
              <div style={{fontSize:'10px', fontWeight:500, color:C.textDim, letterSpacing:'1px', textTransform:'uppercase', marginBottom:'12px', paddingBottom:'8px', borderBottom:`1px solid ${C.border}`}}>הכי חדש</div>
              {news.slice(0, 4).map((item, i) => (
                <div key={i} style={{padding:'9px 0', borderBottom:`0.5px solid ${C.border}`}}>
                  <div style={{fontSize:'11px', color:C.accent, marginBottom:'3px', fontWeight:500}}>0{i+1}</div>
                  <a href={item.link} target="_blank" rel="noopener noreferrer" style={{textDecoration:'none'}}>
                    <div style={{fontSize:'12px', color:C.textMuted, lineHeight:1.4}}>{item.title}</div>
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Mobile market strip */}
      {!loading && isMobile && (
        <div style={{background:C.bgCard, padding:'12px 16px', borderBottom:`1px solid ${C.border}`, display:'flex', gap:'8px', overflowX:'auto'}}>
          {[
            {name:'TA-35', val:'2,184', chg:'+0.84%', up:true},
            {name:'S&P', val:'5,312', chg:'+0.31%', up:true},
            {name:'BTC', val:'64K', chg:'-1.20%', up:false},
            {name:'USD', val:'3.72', chg:'+0.12%', up:true},
          ].map(m => (
            <div key={m.name} style={{background:C.bg, border:`1px solid ${C.border}`, borderRadius:'8px', padding:'8px 12px', minWidth:'80px', textAlign:'center', flexShrink:0}}>
              <div style={{fontSize:'10px', color:C.textDim, marginBottom:'2px'}}>{m.name}</div>
              <div style={{fontSize:'13px', fontWeight:500, color:C.text}}>{m.val}</div>
              <div style={{fontSize:'11px', color: m.up ? C.up : C.down}}>{m.chg}</div>
            </div>
          ))}
        </div>
      )}

      {/* Category Bar */}
      <div style={{background:C.bgCard, borderTop:`1px solid ${C.border}`, borderBottom:`1px solid ${C.border}`, padding:'0 16px', display:'flex', overflowX:'auto'}}>
        {categories.map((c) => (
          <div key={c} onClick={() => setActiveCategory(c)} style={{fontSize:'12px', color: activeCategory===c ? C.text : C.textDim, padding:'11px 16px', borderBottom: activeCategory===c ? `2px solid ${C.accent}` : '2px solid transparent', fontWeight: activeCategory===c ? 500 : 400, cursor:'pointer', whiteSpace:'nowrap', transition:'color .15s'}}>
            {c}
          </div>
        ))}
      </div>

      {/* Cards */}
      {!loading && (
        <div style={{background:C.bg, padding: isMobile ? '16px' : '20px 24px'}}>
          <div style={{display:'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3,1fr)', gap:'12px'}}>
            {cards.map((card, i) => (
              <div key={i} style={{background:C.bgCard, border:`0.5px solid ${C.border}`, borderRadius:'10px', padding:'16px', cursor:'pointer', transition:'border-color .15s'}}
                onMouseEnter={e => (e.currentTarget.style.borderColor=C.borderLight)}
                onMouseLeave={e => (e.currentTarget.style.borderColor=C.border)}>
                <div style={{fontSize:'10px', fontWeight:500, color:C.accent, textTransform:'uppercase', letterSpacing:'.5px', marginBottom:'7px'}}>{card.source}</div>
                <a href={card.link} target="_blank" rel="noopener noreferrer" style={{textDecoration:'none'}}>
                  <div style={{fontSize:'13px', color:C.textMuted, lineHeight:1.45, marginBottom:'8px'}}>{card.title}</div>
                </a>
                <div style={{fontSize:'11px', color:C.textDim}}>{timeAgo(card.pubDate)}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer style={{background:C.bgCard, borderTop:`1px solid ${C.border}`, padding:'14px 20px', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <span style={{fontSize:'13px', fontWeight:500, color:C.textMuted}}>TBD</span>
        <span style={{fontSize:'11px', color:C.textDim}}>כל הזכויות שמורות © 2025</span>
      </footer>

    </main>
  );
}