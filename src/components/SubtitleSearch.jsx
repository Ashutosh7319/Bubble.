import { Search, Download, Upload, FileText, RefreshCw } from 'lucide-react';
import { useRef, useState } from 'react';

const SubtitleSearch = ({ title }) => {
  const fileInputRef = useRef(null);
  const [isConverting, setIsConverting] = useState(false);
  const [converted, setConverted] = useState(false);

  const handleSrtConversion = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsConverting(true);
    setConverted(false);
    const reader = new FileReader();
    reader.onload = (event) => {
      let srtText = event.target.result;
      
      // Strip UTF-8 BOM or Byte Order Marks if present
      srtText = srtText.replace(/^[\uFEFF\uFFFE]/, '').trim();
      
      // Normalize line endings to \n
      srtText = srtText.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
      
      // Split into blocks and remove sequence numbers
      let blocks = srtText.split(/\n{2,}/);
      let vttBlocks = blocks.map(block => {
        let lines = block.trim().split('\n');
        if (lines.length > 0 && /^\d+$/.test(lines[0].trim())) {
          lines.shift();
        }
        return lines.join('\n');
      }).filter(block => block.trim());
      srtText = vttBlocks.join('\n\n');
      
      // Fix timestamps (comma -> period)
      let vttText = srtText.replace(/(\d{1,2}:\d{2}:\d{2}),(\d{3})/g, '$1.$2');
      
      // Clean existing WEBVTT header and prepend clean WEBVTT
      vttText = vttText.replace(/^[\uFEFF\uFFFE\s]*WEBVTT.*\n*/i, '').trim();
      vttText = 'WEBVTT\n\n' + vttText;

      const blob = new Blob([vttText], { type: 'text/vtt;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name.replace('.srt', '.vtt');
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      setIsConverting(false);
      setConverted(true);
      if (fileInputRef.current) fileInputRef.current.value = '';
      setTimeout(() => setConverted(false), 3000);
    };
    reader.readAsText(file);
  };

  const searchQuery = encodeURIComponent(title || '');

  const subtitleSites = [
    { name: 'SubDL', url: `https://subdl.com/subtitle/search?q=${searchQuery}`, color: '#3b82f6' },
    { name: 'OpenSubtitles', url: `https://www.opensubtitles.org/en/search/sublanguageid-all/moviename-${searchQuery}`, color: '#eab308' },
    { name: 'YIFY Subs', url: `https://yts-subs.com/search/${searchQuery}`, color: '#22c55e' }
  ];

  return (
    <div style={{ 
      padding: '1.2rem', 
      borderRadius: 'var(--radius-lg)', 
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.05)'
    }}>
      {/* Header */}
      <h3 style={{ 
        display: 'flex', alignItems: 'center', gap: '0.5rem', 
        marginBottom: '0.8rem', fontSize: '1rem', fontWeight: 600, color: 'rgba(255,255,255,0.9)' 
      }}>
        <Search size={16} color="var(--text-muted)" />
        Find Subtitles
      </h3>
      
      <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.2rem', lineHeight: 1.6 }}>
        VidKing's subtitle server is temporarily unavailable. Download subtitles from the sites below and upload the <strong style={{ color: 'var(--text-secondary)' }}>.vtt</strong> file into the player.
      </p>

      {/* Subtitle Sites */}
      <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '1.2rem' }}>
        {subtitleSites.map((site) => (
          <a
            key={site.name}
            href={site.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
              padding: '0.45rem 0.9rem',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '6px',
              fontSize: '0.8rem', fontWeight: 500, color: 'rgba(255,255,255,0.8)',
              transition: 'all 0.25s ease', textDecoration: 'none'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
              e.currentTarget.style.borderColor = `${site.color}50`;
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <Download size={13} color={site.color} />
            {site.name}
          </a>
        ))}
      </div>

      {/* SRT to VTT Converter */}
      <div style={{ 
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem',
        padding: '0.8rem', borderRadius: 'var(--radius-sm)',
        background: 'rgba(0,0,0,0.3)', flexWrap: 'wrap'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flex: 1, minWidth: '200px' }}>
          <FileText size={16} color="var(--text-muted)" />
          <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            Have a <strong>.srt</strong> file? Convert it to .vtt
          </span>
        </div>
        
        <input 
          type="file" accept=".srt" ref={fileInputRef} 
          onChange={handleSrtConversion} style={{ display: 'none' }} 
          id="srt-upload"
        />
        <label 
          htmlFor="srt-upload" 
          style={{
            padding: '0.4rem 0.8rem',
            background: converted ? 'rgba(34,197,94,0.15)' : 'rgba(255,255,255,0.06)',
            border: converted ? '1px solid rgba(34,197,94,0.3)' : '1px solid rgba(255,255,255,0.08)',
            borderRadius: '6px',
            fontSize: '0.78rem', fontWeight: 600,
            color: converted ? '#22c55e' : 'rgba(255,255,255,0.8)',
            cursor: 'pointer',
            display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
            transition: 'all 0.2s ease', whiteSpace: 'nowrap'
          }}
          onMouseOver={(e) => { if (!converted) e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}
          onMouseOut={(e) => { if (!converted) e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
        >
          <RefreshCw size={13} style={{ animation: isConverting ? 'spin 1s linear infinite' : 'none' }} />
          {converted ? '✓ Done!' : 'Convert to .VTT'}
        </label>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );
};

export default SubtitleSearch;
