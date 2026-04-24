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
    if (container) container.appendChild(script);
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
    if (container) container.appendChild(script);
  }, []);
  return <div id="tv-market" className="tradingview-widget-container"><div className="tradingview-widget-container__widget"></div></div>;
}

export default function Home() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('הכל');

  useEffect(() => {
    fetch('/api/news')
      .then(r => r.json())
      .then(data => { setNews(data.items || []); setLoading(false); });
  }, []);

  const categories = ['הכל', 'מניות', 'כלכלה', 'עסקים'];
  const filtered = activeCategory === 'הכל' ? news : news.filter(n => n.category === activeCategory);
  const hero = filtered[0];
  const secondary = filtered.slice(1, 5);
  const cards = filtered.slice(5);

  return (
    <main dir="rtl" style={{background:'#f0ede6', minHeight:'100vh', fontFamily:'system-ui,sans-serif'}}>

      {/* Topbar */}
      <nav style={{background:'#1a1a1a', padding:'0 24px', display:'flex', alignItems:'center', justifyContent:'space-between', height:'52px'}}>
        <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
          <span style={{fontSize:'16px', fontWeight:500, color:'#fff'}}>TBD</span>
          <span style={{background:'#c9a84c', color:'#1a1a1a', fontSize:'9px', fontWeight:500, padding:'2px 7px', borderRadius:'3px', letterSpacing:'1px'}}>BETA</span>
        </div>
        <div style={{display:'flex', gap:'22px'}}>
          {['מניות','קריפטו','נדל"ן','מאקרו','דו"חות'].map(n => (
            <a key={n} style={{fontSize:'12px', color:'#aaa', textDecoration:'none', cursor:'pointer'}}>{n}</a>
          ))}
        </div>
      </nav>

      {/* Ticker TradingView */}
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
        <div style={{display:'grid', gridTemplateColumns:'2fr 1fr'}}>
          <div style={{padding:'28px 24px', borderRight:'1px solid #e2ddd4', background:'#fff'}}>
            <span style={{fontSize:'11px', fontWeight:500, color:'#c9a84c', letterSpacing:'.5px', textTransform:'uppercase'}}>{hero.source} · {hero.category}</span>
            <h1 style={{fontSize:'22px', fontWeight:500, color:'#111', lineHeight:1.45, margin:'12px 0 10px'}}>
              <a href={hero.link} target="_blank" rel="noopener noreferrer" style={{textDecoration:'none', color:'inherit'}}>{hero.title}</a>
            </h1>
            <span style={{fontSize:'12px', color:'#aaa'}}>{timeAgo(hero.pubDate)} · {hero.source}</span>
            <hr style={{border:'none', borderTop:'1px solid #ede9e1', margin:'20px 0'}} />
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'18px'}}>
              {secondary.map((item, i) => (
                <div key={i}>
                  <div style={{fontSize:'10px', fontWeight:500, color:'#c9a84c', textTransform:'uppercase', marginBottom:'5px'}}>{item.source}</div>
                  <a href={item.link} target="_blank" rel="noopener noreferrer" style={{textDecoration:'none'}}>
                    <div style={{fontSize:'13px', color:'#222', lineHeight:1.45}}>{item.title}</div>
                  </a>
                  <div style={{fontSize:'11px', color:'#aaa', marginTop:'5px'}}>{timeAgo(item.pubDate)}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div style={{padding:'24px 20px', background:'#f0ede6'}}>
            <div style={{fontSize:'10px', fontWeight:500, color:'#999', letterSpacing:'1px', textTransform:'uppercase', marginBottom:'12px', paddingBottom:'8px', borderBottom:'1px solid #dedad2'}}>שוק בזמן אמת</div>
            <div style={{background:'#fff', borderRadius:'8px', overflow:'hidden', marginBottom:'20px'}}>
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
        </div>
      )}

      {/* Category Bar */}
      <div style={{background:'#e8e3d8', borderTop:'1px solid #dedad2', borderBottom:'1px solid #dedad2', padding:'0 24px', display:'flex'}}>
        {categories.map((c) => (
          <div key={c} onClick={() => setActiveCategory(c)} style={{fontSize:'12px', color: activeCategory===c ? '#1a1a1a' : '#888', padding:'11px 16px', borderBottom: activeCategory===c ? '2px solid #c9a84c' : '2px solid transparent', fontWeight: activeCategory===c ? 500 : 400, cursor:'pointer'}}>
            {c}
          </div>
        ))}
      </div>

      {/* Cards */}
      {!loading && (
        <div style={{background:'#f7f5f0', padding:'20px 24px'}}>
          <div style={{display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'14px'}}>
            {cards.map((card, i) => (
              <div key={i} style={{background:'#fff', border:'0.5px solid #e2ddd4', borderRadius:'10px', padding:'16px'}}>
                <div style={{fontSize:'10px', fontWeight:500, color:'#c9a84c', textTransform:'uppercase', letterSpacing:'.5px', marginBottom:'7px'}}>{card.source}</div>
                <a href={card.link} target="_blank" rel="noopener noreferrer" style={{textDecoration:'none'}}>
                  <div style={{fontSize:'13px', color:'#222', lineHeight:1.45, marginBottom:'8px'}}>{card.title}</div>
                </a>
                <div style={{fontSize:'11px', color:'#aaa'}}>{timeAgo(card.pubDate)}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer style={{background:'#1a1a1a', padding:'14px 24px', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <span style={{fontSize:'13px', fontWeight:500, color:'#888'}}>TBD</span>
        <span style={{fontSize:'11px', color:'#555'}}>כל הזכויות שמורות © 2025</span>
      </footer>

    </main>
  );
}