export default function GameBackground() {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      <svg
        className="w-full h-full"
        viewBox="0 0 1920 1080"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <linearGradient id="skyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#87CEEB', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#ADD8E6', stopOpacity: 1 }} />
          </linearGradient>
          <linearGradient id="sandGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#F2D1A7', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#E1B88A', stopOpacity: 1 }} />
          </linearGradient>
          <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="5" dy="5" stdDeviation="5" floodColor="#000000" floodOpacity="0.2" />
          </filter>
        </defs>

        {/* Sky */}
        <rect x="0" y="0" width="1920" height="1080" fill="url(#skyGradient)" />

        {/* Sun */}
        <circle cx="1700" cy="150" r="80" fill="#FFD700" opacity="0.8" />

        {/* Clouds */}
        <g fill="#FFFFFF" opacity="0.9">
          <ellipse cx="300" cy="200" rx="150" ry="50" />
          <ellipse cx="350" cy="180" rx="120" ry="60" />
          <ellipse cx="900" cy="150" rx="200" ry="70" />
          <ellipse cx="950" cy="130" rx="150" ry="80" />
          <ellipse cx="1400" cy="250" rx="180" ry="60" />
        </g>
        
        {/* Sea */}
        <path d="M0,700 C400,650 800,750 1200,700 S1920,650 1920,700 V1080 H0 Z" fill="#1E90FF" opacity="0.7" />
        <path d="M0,720 C300,680 700,760 1100,720 S1920,680 1920,720 V1080 H0 Z" fill="#4169E1" opacity="0.6" />

        {/* Waves */}
        <g fill="none" stroke="#FFFFFF" strokeWidth="3" opacity="0.5">
            <path d="M0,710 C200,690 400,730 600,710 S1000,690 1200,710s400,20,600-20" />
            <path d="M-100,730 C100,710 300,750 500,730 S900,710 1100,730s400,20,600-20" />
            <path d="M100,750 C300,730 500,770 700,750 S1100,730 1300,750s400,20,600-20" />
        </g>

        {/* Sand */}
        <rect x="0" y="750" width="1920" height="330" fill="url(#sandGradient)" />

        {/* Palm Tree 1 */}
        <g transform="translate(150, 400) rotate(-5)" style={{ filter: 'url(#shadow)' }}>
            <path d="M0,350 Q20,175 0,0" stroke="#8B4513" strokeWidth="25" fill="none" />
            <g transform="translate(0, 0)">
                <path d="M0,0 C50,-100 150,-100 200,-20" stroke="#006400" strokeWidth="15" fill="none" transform="rotate(20)" />
                <path d="M0,0 C-50,-100 -150,-100 -200,-20" stroke="#006400" strokeWidth="15" fill="none" transform="rotate(-20)" />
                <path d="M0,0 C70,-80 120,-150 100,-200" stroke="#228B22" strokeWidth="15" fill="none" transform="rotate(50)" />
                <path d="M0,0 C-70,-80 -120,-150 -100,-200" stroke="#228B22" strokeWidth="15" fill="none" transform="rotate(-50)" />
                <path d="M0,0 C100,0 150,-50 180,-100" stroke="#008000" strokeWidth="15" fill="none" transform="rotate(80)" />
                <path d="M0,0 C-100,0 -150,-50 -180,-100" stroke="#008000" strokeWidth="15" fill="none" transform="rotate(-80)" />
            </g>
        </g>
        
        {/* Palm Tree 2 */}
        <g transform="translate(1700, 450) rotate(8)" style={{ filter: 'url(#shadow)' }}>
            <path d="M0,300 Q-15,150 0,0" stroke="#A0522D" strokeWidth="20" fill="none" />
             <g transform="translate(0, 0) scale(0.8)">
                <path d="M0,0 C50,-100 150,-100 200,-20" stroke="#006400" strokeWidth="15" fill="none" transform="rotate(15)" />
                <path d="M0,0 C-50,-100 -150,-100 -200,-20" stroke="#006400" strokeWidth="15" fill="none" transform="rotate(-15)" />
                <path d="M0,0 C70,-80 120,-150 100,-200" stroke="#228B22" strokeWidth="15" fill="none" transform="rotate(45)" />
                <path d="M0,0 C-70,-80 -120,-150 -100,-200" stroke="#228B22" strokeWidth="15" fill="none" transform="rotate(-45)" />
                <path d="M0,0 C100,0 150,-50 180,-100" stroke="#008000" strokeWidth="15" fill="none" transform="rotate(75)" />
            </g>
        </g>
        
        {/* Beach chair and Umbrella */}
        <g transform="translate(400, 800)" style={{ filter: 'url(#shadow)' }}>
             <g transform="rotate(-15)">
                {/* Umbrella */}
                <path d="M-150,0 A150,150 0 0,1 150,0 Z" fill="#FF6B6B" stroke="#c0392b" strokeWidth="4" />
                 <path d="M0,-140 V50" stroke="#8d6e63" strokeWidth="8" />
                 <circle cx="0" cy="-140" r="10" fill="#c0392b" />

                {/* Chair */}
                <g transform="translate(100, -20)">
                    <rect x="0" y="0" width="100" height="15" fill="#a1887f" rx="5"/>
                    <rect x="0" y="20" width="100" height="15" fill="#a1887f" rx="5"/>
                    <rect x="10" y="-20" width="15" height="60" fill="#d7ccc8" rx="5" transform="rotate(15)"/>
                    <rect x="75" y="-20" width="15" height="60" fill="#d7ccc8" rx="5" transform="rotate(15)"/>
                </g>
            </g>
        </g>

        {/* Designer Bag */}
        <g transform="translate(1400, 850)" style={{ filter: 'url(#shadow)' }}>
            <path d="M20,0 C0,0 0,40 20,40 H130 C150,40 150,0 130,0 Z" fill="#8E44AD" />
            <path d="M40,-30 C40,-50 110,-50 110,-30" stroke="#F1C40F" strokeWidth="6" fill="none" />
            <rect x="70" y="15" width="10" height="10" fill="#F1C40F" />
        </g>
        
      </svg>
    </div>
  );
}
