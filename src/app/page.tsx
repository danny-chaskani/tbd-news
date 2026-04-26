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
      colorTheme: 'light',
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

  return (
    <main dir="rtl" style={{background:'#f0ede6', minHeight:'100vh', fontFamily:'system-ui,sans-serif'}}>

      {/* Topbar */}
      <nav style={{background:'#1a1a1a', padding:'0 16px', display:'flex', alignItems:'center', justifyContent:'space-between', height:'52px'}}>
        <div style={{display:'flex', alignItems:'center', gap:'8px'}}>
          <span style={{fontSize:'16px', fontWeight:500, color:'#faf8f4'}}>TBD</span>
          <span style={{background:'#c9a84c', color:'#1a1a1a', fontSize:'9px', fontWeight:500, padding:'2px 6px', borderRadius:'3px', letterSpacing:'1px'}}>BETA</span>
        </div>
        {!isMobile && (
          <div style={{display:'flex', gap:'20px'}}>
            {['מניות','קריפטו','נדל"ן','מאקרו','דו"חות'].map(n => (
              <a key={n} style={{fontSize:'12px', color:'#aaa', textDecoration:'none', cursor:'pointer'}}>{n}</a>
            ))}
          </div>
        )}
      </nav>

      {/* Ticker */}
      <div style={{background:'#242424'}}>
        <TradingViewTicker />
      </div>

      {/* Loading */}
      {loading && (
        <div style={{textAlign:'center', padding:'60px', color:'#888', fontSize:'14px'}}>
          טוען חדשות...
        </div>
      )}

      {/* Hero + Sidebar */}
      {!loading && hero && (
        <div style={{display:'grid', gridTemplateColumns: isMobile ? '1fr' : '2fr 1fr'}}>

          {/* Hero */}
          <div style={{padding: isMobile ? '20px 16px' : '28px 24px', borderRight: isMobile ? 'none' : '1px solid #e2ddd4', borderBottom: isMobile ? '1px solid #e2ddd4' : 'none', background:'#faf8f4'}}>
            <span style={{fontSize:'11px', fontWeight:500, color:'#c9a84c', letterSpacing:'.5px', textTransform:'uppercase'}}>{hero.source} · {hero.category}</span>
            <h1 style={{fontSize: isMobile ? '19px' : '22px', fontWeight:500, color:'#111', lineHeight:1.45, margin:'10px 0 8px'}}>
              <a href={hero.link} target="_blank" rel="noopener noreferrer" style={{textDecoration:'none', color:'inherit'}}>{hero.title}</a>
            </h1>
            <span style={{fontSize:'12px', color:'#aaa'}}>{timeAgo(hero.pubDate)} · {hero.source}</span>
            <hr style={{border:'none', borderTop:'1px solid #ede9e1', margin:'16px 0'}} />
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'14px'}}>
              {secondary.map((item, i) => (
                <div key={i}>
                  <div style={{fontSize:'10px', fontWeight:500, color:'#c9a84c', textTransform:'uppercase', marginBottom:'4px'}}>{item.source}</div>
                  <a href={item.link} target="_blank" rel="noopener noreferrer" style={{textDecoration:'none'}}>
                    <div style={{fontSize:'13px', color:'#222', lineHeight:1.45}}>{item.title}</div>
                  </a>
                  <div style={{fontSize:'11px', color:'#aaa', marginTop:'4px'}}>{timeAgo(item.pubDate)}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar - desktop only */}
          {!isMobile && (
            <div style={{padding:'24px 20px', background:'#f0ede6'}}>
              <div style={{fontSize:'10px', fontWeight:500, color:'#999', letterSpacing:'1px', textTransform:'uppercase', marginBottom:'12px', paddingBottom:'8px', borderBottom:'1px solid #dedad2'}}>שוק בזמן אמת</div>
              <div style={{background:'#faf8f4', borderRadius:'8px', overflow:'hidden', marginBottom:'20px'}}>
                <TradingViewMarket />
              </div>
              <div style={{fontSize:'10px', fontWeight:500, color:'#999', letterSpacing:'1px', textTransform:'uppercase', marginBottom:'12px', paddingBottom:'8px', borderBottom:'1px solid #dedad2'}}>הכי חדש</div>
              {news.slice(0, 4).map((item, i) => (
                <div key={i} style={{padding:'9px 0', borderBottom:'0.5px solid #e2ddd4'}}>
                  <div style={{fontSize:'11px', color:'#ccc', marginBottom:'3px'}}>0{i+1}</div>
                  <a href={item.link} target="_blank" rel="noopener noreferrer" style={{textDecoration:'none'}}>
                    <div style={{fontSize:'12px', color:'#333', lineHeight:1.4}}>{item.title}</div>
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Mobile market strip */}
      {!loading && isMobile && (
        <div style={{background:'#faf8f4', padding:'12px 16px', borderBottom:'1px solid #e2ddd4', display:'flex', gap:'8px', overflowX:'auto'}}>
          {[
            {name:'TA-35', val:'2,184', chg:'+0.84%', up:true},
            {name:'S&P', val:'5,312', chg:'+0.31%', up:true},
            {name:'BTC', val:'64K', chg:'-1.20%', up:false},
            {name:'USD', val:'3.72', chg:'+0.12%', up:true},
          ].map(m => (
            <div key={m.name} style={{background:'#f0ede6', borderRadius:'8px', padding:'8px 12px', minWidth:'80px', textAlign:'center', flexShrink:0}}>
              <div style={{fontSize:'10px', color:'#888', marginBottom:'2px'}}>{m.name}</div>
              <div style={{fontSize:'13px', fontWeight:500, color:'#1a1a1a'}}>{m.val}</div>
              <div style={{fontSize:'11px', color: m.up ? '#27ae60' : '#e74c3c'}}>{m.chg}</div>
            </div>
          ))}
        </div>
      )}

      {/* Category Bar */}
      <div style={{background:'#e8e3d8', borderTop:'1px solid #dedad2', borderBottom:'1px solid #dedad2', padding:'0 16px', display:'flex', overflowX:'auto'}}>
        {categories.map((c) => (
          <div key={c} onClick={() => setActiveCategory(c)} style={{fontSize:'12px', color: activeCategory===c ? '#1a1a1a' : '#888', padding:'11px 14px', borderBottom: activeCategory===c ? '2px solid #c9a84c' : '2px solid transparent', fontWeight: activeCategory===c ? 500 : 400, cursor:'pointer', whiteSpace:'nowrap'}}>
            {c}
          </div>
        ))}
      </div>

      {/* Cards */}
      {!loading && (
        <div style={{background:'#f7f5f0', padding: isMobile ? '16px' : '20px 24px'}}>
          <div style={{display:'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3,1fr)', gap:'12px'}}>
            {cards.map((card, i) => (
              <div key={i} style={{background:'#faf8f4', border:'0.5px solid #e2ddd4', borderRadius:'10px', padding:'14px'}}>
                <div style={{fontSize:'10px', fontWeight:500, color:'#c9a84c', textTransform:'uppercase', letterSpacing:'.5px', marginBottom:'6px'}}>{card.source}</div>
                <a href={card.link} target="_blank" rel="noopener noreferrer" style={{textDecoration:'none'}}>
                  <div style={{fontSize:'13px', color:'#222', lineHeight:1.45, marginBottom:'7px'}}>{card.title}</div>
                </a>
                <div style={{fontSize:'11px', color:'#aaa'}}>{timeAgo(card.pubDate)}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer style={{background:'#1a1a1a', padding:'14px 16px', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <span style={{fontSize:'13px', fontWeight:500, color:'#888'}}>TBD</span>
        <span style={{fontSize:'11px', color:'#555'}}>כל הזכויות שמורות © 2025</span>
      </footer>

    </main>
  );
}