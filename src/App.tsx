import { useState, type ReactNode } from 'react'
import Vinyl from '../components/vinyl'

// --- Adaptable Section Title ---
const SectionTitle = ({ children, theme }: { children: ReactNode; theme: 'club' | 'lounge' }) => (
  <h2 className={`mb-6 text-2xl font-bold tracking-tighter uppercase border-b-2 pb-2 text-white transition-all duration-500 ${
    theme === 'club' 
      ? 'border-fuchsia-500/50 drop-shadow-[0_0_10px_rgba(217,70,239,0.4)]' 
      : 'border-amber-500/40 drop-shadow-[0_0_10px_rgba(245,158,11,0.2)]'
  }`}>
    <span className={`mr-2 transition-colors duration-500 ${theme === 'club' ? 'text-fuchsia-500' : 'text-amber-400'}`}>//</span>
    {children}
  </h2>
)

// --- Dynamic Glassmorphism Card ---
const Card = ({ children, theme, className = "" }: { children: ReactNode; theme: 'club' | 'lounge'; className?: string }) => (
  <div className={`rounded-2xl p-6 backdrop-blur-xl border transition-all duration-500 ${
    theme === 'club'
      ? 'bg-black/60 border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.6)] hover:border-fuchsia-500/30'
      : 'bg-zinc-950/75 border-zinc-800/60 shadow-[0_4px_30px_rgba(0,0,0,0.4)] hover:border-amber-500/20'
  } ${className}`}>
    {children}
  </div>
)

// --- Adaptable Badge ---
const Badge = ({ children, theme }: { children: ReactNode; theme: 'club' | 'lounge' }) => (
  <span className={`inline-flex items-center rounded-md text-white px-2.5 py-0.5 text-xs font-black tracking-wider uppercase transition-all duration-500 ${
    theme === 'club' 
      ? 'bg-fuchsia-600 shadow-[0_0_10px_rgba(192,38,211,0.4)]' 
      : 'bg-amber-600/90 shadow-[0_0_10px_rgba(217,119,6,0.2)]'
  }`}>
    {children}
  </span>
)

// --- Optimized Borderless Explosive Gallery (Padded-Overflow Buffer) ---
const PhotoGallery = ({ theme }: { theme: 'club' | 'lounge' }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [displayIndex, setDisplayIndex] = useState(0)
  const [sweepDirection, setSweepDirection] = useState<'forward' | 'backward'>('forward')

  const photos = [
    { url: '/assets/sensiatrubixweb.webp', caption: 'Free Dope - Rubix Warehouse - Brunswick' },
    { url: '/assets/gallery-one.webp', caption: 'Micky Finn & General Levy Support - Rubix Warehouse - Brunswick' },
    { url: '/assets/scribe-support.webp', caption: 'Scribe (I was his DJ that night)- Rubix Warehouse - Brunswick' },
    { url: '/assets/sensiwarriorslogo.webp', caption: 'Sensi Warriors Logo' },
  ]

  const cols = 20
  const rows = 20

  const triggerShatterTransition = (nextIndex: number, direction: 'forward' | 'backward') => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setSweepDirection(direction)
    
    setTimeout(() => {
      setDisplayIndex(nextIndex)
    }, 600)

    setTimeout(() => {
      setCurrentIndex(nextIndex)
      setIsTransitioning(false)
    }, 1250)
  }

  const next = () => triggerShatterTransition((currentIndex + 1) % photos.length, 'forward')
  const prev = () => triggerShatterTransition((currentIndex - 1 + photos.length) % photos.length, 'backward')

  return (
    /* 1. '-m-12' and 'p-12' create a invisible buffer area.
      2. 'overflow-hidden' on the parent "fences in" the shards so they don't 
         expand the page width, killing the horizontal scroll glitch.
      3. The inner div remains 'overflow-visible' so the shards are free 
         to fly into that buffer area.
    */
    <div className="relative p-40 -m-40 overflow-hidden">
      <div className="relative group overflow-visible aspect-video sm:aspect-[21/9]">
        
        {/* Dynamic Grid Dispersal System */}
        <div 
          className="absolute inset-0 grid w-full h-full will-change-transform"
          style={{
            gridTemplateColumns: `repeat(${cols}, 1fr)`,
            gridTemplateRows: `repeat(${rows}, 1fr)`,
          }}
        >
          {Array.from({ length: rows * cols }).map((_, index) => {
            const r = Math.floor(index / cols)
            const c = index % cols
            const centerX = (cols - 1) / 2
            const centerY = (rows - 1) / 2
            const baseVectorX = (c - centerX)
            const baseVectorY = (r - centerY)

            const xDir = baseVectorX * (300 + Math.random() * 150) * (1 + (c / cols) * 2.5)
            const yDir = baseVectorY * (300 + Math.random() * 150)
            const randomRotation = (Math.random() - 0.5) * 360 

            const maxDelay = 400 
            const baseDelay = sweepDirection === 'forward' 
              ? (c / (cols - 1)) * maxDelay 
              : ((cols - 1 - c) / (cols - 1)) * maxDelay

            const finalDelay = baseDelay + (Math.random() * 45)

            return (
              <div
                key={`${displayIndex}-${index}`}
                className="w-full h-full transition-all duration-[1100ms] cubic-bezier(0.16, 1, 0.3, 1)"
                style={{
                  backgroundImage: `url('${photos[displayIndex].url}')`,
                  backgroundSize: `${cols * 105}% ${rows * 105}%`,
                  backgroundPosition: `calc(${c} / ${cols - 1} * 100%) calc(${r} / ${rows - 1} * 100%)`,
                  transform: isTransitioning 
                    ? `translate3d(${xDir}px, ${yDir}px, 0) rotate(${randomRotation}deg) scale(0.01)` 
                    : 'translate3d(0, 0, 0) rotate(0deg) scale(1.01)',
                  opacity: isTransitioning ? 0 : 1,
                  transitionDelay: isTransitioning ? `${finalDelay}ms` : '0ms',
                  backfaceVisibility: 'hidden',
                  willChange: 'transform, opacity'
                }}
              />
            )
          })}
        </div>

        {/* Controls Overlay */}
        <div className="absolute bottom-4 left-6 right-6 flex justify-between items-end z-20">
          <p className="text-xs font-mono tracking-widest text-white uppercase opacity-80 drop-shadow-md max-w-[70%] truncate">
            {photos[currentIndex].caption}
          </p>
          <div className="flex gap-2 shrink-0">
            <button onClick={prev} disabled={isTransitioning} className="h-10 w-10 flex items-center justify-center rounded-full backdrop-blur-md border border-white/20 text-white hover:bg-white/10 active:scale-95 disabled:opacity-40">←</button>
            <button onClick={next} disabled={isTransitioning} className="h-10 w-10 flex items-center justify-center rounded-full backdrop-blur-md border border-white/20 text-white hover:bg-white/10 active:scale-95 disabled:opacity-40">→</button>
          </div>
        </div>
      </div>
    </div>
  )
}
export default function App() {
  const [vinylLoaded, setVinylLoaded] = useState(false)
  const [theme, setTheme] = useState<'club' | 'lounge'>('club')

  const targetEmail = 'your-email@gmail.com'
  const secondEmail = 'management-email@gmail.com'
  const subject = encodeURIComponent('DJ Sensi Booking Inquiry')
  const body = encodeURIComponent(`Hi DJ Sensi,\n\nI want to inquire about booking you for an upcoming event...\n\n`)
  const mailtoString = `mailto:${targetEmail}?cc=${secondEmail}&subject=${subject}&body=${body}`

  return (
    <div className="min-h-screen bg-[#050507] text-zinc-100 font-sans overflow-x-hidden relative transition-colors duration-700 selection:bg-white selection:text-black">
      <div className={`fixed inset-0 z-[1] transition-opacity duration-1000 ${theme === 'club' ? 'opacity-15' : 'opacity-0'}`}>
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat" 
          style={{ backgroundImage: "url('/assets/clubtheme.webp')" }} 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050507]/60 via-[#050507]/80 to-[#050507]" />
      </div>

      {/* Lounge Background */}
  <div className={`absolute inset-0 transition-opacity duration-1000 ${theme === 'lounge' ? 'opacity-15' : 'opacity-0'}`}>
    <div 
      className="absolute inset-0 bg-cover bg-center bg-no-repeat" 
      style={{ backgroundImage: "url('/assets/loungetheme.webp')" }} 
    />
    <div className="absolute inset-0 bg-gradient-to-b from-[#050507]/60 via-[#050507]/80 to-[#050507]" />
  </div>
      {/* --- DYNAMIC AMBIENT LIGHTS BASED ON THEME --- */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#141417_1px,transparent_1px),linear-gradient(to_bottom,#141417_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none opacity-30 z-0" />
      
      {/* Club Mood Lighting (Vibrant Pink & Deep Blue) */}
      <div className={`fixed -top-[10%] -left-[10%] w-[60%] h-[60%] bg-fuchsia-600/15 blur-[130px] rounded-full pointer-events-none transition-all duration-1000 z-0 ${
        theme === 'club' ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
      }`} />
      <div className={`fixed top-[30%] -right-[10%] w-[50%] h-[50%] bg-blue-600/15 blur-[120px] rounded-full pointer-events-none transition-all duration-1000 z-0 ${
        theme === 'club' ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
      }`} />

      {/* Lounge Mood Lighting (Muted Amber & Warm Wood Undertones) */}
      <div className={`fixed top-[10%] left-[15%] w-[70%] h-[50%] bg-amber-700/10 blur-[140px] rounded-full pointer-events-none transition-all duration-1000 z-0 ${
        theme === 'lounge' ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
      }`} />
      <div className={`fixed -bottom-[10%] right-[10%] w-[40%] h-[50%] bg-orange-900/10 blur-[120px] rounded-full pointer-events-none transition-all duration-1000 z-0 ${
        theme === 'lounge' ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
      }`} />

      <div className="relative z-10 mx-auto flex max-w-3xl flex-col px-6 pb-24 pt-8 w-full">
        
        {/* Navigation Bar with Fitted Mode Switcher */}
        <nav className="mb-12 flex items-center justify-between text-xs tracking-widest font-mono text-zinc-500 uppercase border-b border-zinc-900 pb-4 w-full gap-4">
          <span className="truncate">SENSI // BOOKING SITE</span>
          
          <div className="flex items-center bg-zinc-950 border border-zinc-800 p-0.5 rounded-full shrink-0 shadow-inner">
            <button 
              onClick={() => setTheme('club')}
              className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase transition-all duration-300 ${
                theme === 'club' ? 'bg-white text-black shadow-md' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              Club
            </button>
            <button 
              onClick={() => setTheme('lounge')}
              className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase transition-all duration-300 ${
                theme === 'lounge' ? 'bg-amber-600 text-white shadow-md' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              Lounge
            </button>
          </div>
        </nav>

        {/* Identity Block */}
        <header className="mb-12 flex flex-col-reverse sm:flex-row items-start sm:items-center justify-between gap-6 w-full">
          <div>
            <h1 className="font-sensi text-9xl text-outline uppercase">
              SENSI
            </h1>
            <p className={`text-xs font-mono tracking-widest mt-2 uppercase transition-colors duration-500 ${
              theme === 'club' ? 'text-fuchsia-400' : 'text-amber-400'
            }`}>
              DJ / PRODUCER / DESIGNER / CURATOR
            </p>
          </div>

          <div className="relative group shrink-0 -translate-y-[12px]">
  <div className={`absolute -inset-1 rounded-full blur opacity-20 group-hover:opacity-50 transition duration-500 bg-gradient-to-r ${
    theme === 'club' ? 'from-fuchsia-500 to-blue-500' : 'from-amber-500 to-orange-500'
  }`} />
  <div className="relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-2 border-white/10 bg-zinc-950 shadow-2xl">
    <img 
      src="/assets/profile.jpg" 
      alt="Portrait" 
      className="h-full w-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" 
    />
  </div>
</div>
        </header>

{/* Turntable Console */}
<div className="mt-6 flex flex-col items-center justify-center w-full max-w-full overflow-hidden">
  
  {/* Clear Instructional Prompt */}
  <div className="mb-4 text-[10px] font-mono uppercase tracking-widest text-zinc-400 animate-pulse">
    [ Interactive Platform: Click or Drag to Play ]
  </div>

  <div className="w-full max-w-[640px] md:max-w-[900px] aspect-[900/500] relative brightness-[0.8] contrast-[1.1]">
    <img src="/assets/turntable_base.png" alt="Base" className="absolute inset-0 w-full h-full object-contain pointer-events-none z-0" />
    <div className="absolute left-[17.5%] top-[-6%] w-[55%] h-[100%] z-10 flex items-center justify-center">
      <Vinyl onReady={() => setVinylLoaded(true)} />
    </div>
    {vinylLoaded && (
      <img src="/assets/tonearm.png" alt="Tonearm" className="absolute left-[31%] top-[2.2%] w-[55%] h-[70%] object-contain pointer-events-none z-20 opacity-0 animate-tonearmFade" />
    )}
  </div>

  {/* Refined Credit Placement */}
  <div className="mt-8 pt-4 border-t border-zinc-900/50 text-center text-[9px] text-zinc-600 uppercase tracking-widest max-w-md leading-relaxed opacity-60">
    <p>
      3D Model: “Vinyl Single” by mikedludlam (<a href="https://skfb.ly/oxIvC" target="_blank" rel="noopener noreferrer" className="underline hover:text-white transition-colors">CC BY 4.0</a>)
    </p>
    <p className="mt-1">
      Implementation, Tonearm Design, and Audio Engineering by DJ Sensi.
    </p>
  </div>
</div>
        <main className="flex flex-col gap-14 mt-12 w-full">
          
          {/* Photo Gallery Section */}
          <section className="w-full">
            <SectionTitle theme={theme}>Gallery</SectionTitle>
            <PhotoGallery theme={theme} />
          </section>

          {/* Bio Section */}
          <section className="w-full">
            <SectionTitle theme={theme}>The Sound</SectionTitle>
            <div className="text-base text-zinc-300 leading-relaxed space-y-4 font-normal">
            <p>With over 20 years of experience behind the decks, DJ Sensi’s sound is deeply rooted in the foundations of Hip Hop, Funk, and Soul. 
              His vinyl-driven approach seamlessly bridges these genres with the high-energy pulse of Jungle and Drum & Bass. Over the years, sharing stages with legends such as Afrika Bambaataa, Wu-Tang Clan (Killa Beez), DJ Hype, Krafty Kuts, DJ Yoda, and 5× World DMC Champion DJ Craze.</p>
  
  <p>His musical journey has taken him across the globe, including an international tour with Eminem’s super-group, 
    Slaughterhouse—featuring Royce Da 5’9, Joe Budden, Joell Ortiz, and Crooked I—as well as extensive performances throughout Europe, the UK, and South-East Asia.</p>
  
  <p>Versatility is the hallmark of his craft. Whether holding down a vibrant club set or curating a sophisticated vibe in a lounge or brewery setting, Sensi moves between genres with ease. He maintains a deep, lifelong immersion in the Jungle scene while consistently keeping his Funk and Soul roots at the forefront of his performance.</p>
  
  <p>This dedication led him to become one half of Sensi Warriors, a high-energy jungle-focused duo that supported industry heavyweights including Mickey Finn, General Levy, Aphrodite, and Ed Solo.</p>
  
  <p>Today, Sensi continues to evolve while returning to his musical roots. Armed with sharp technical scratching, seamless mixing, and an instinctive ability to read any crowd, he remains a master of moving dancefloors wherever he plays.</p>
  
  <p className={`text-sm font-mono uppercase tracking-wide border-t border-zinc-900/80 pt-4 transition-colors duration-500 ${
    theme === 'club' ? 'text-fuchsia-400' : 'text-amber-400'
  }`}>
    For DJ bookings, please reach out via email or my socials.
  </p>
            </div>
          </section>

          {/* Booking Block */}
          <section id="booking" className="w-full">
            <SectionTitle theme={theme}>Secure a Date</SectionTitle>
            <Card theme={theme}>
              <div className="text-center py-4 space-y-4">
                <p className="text-zinc-400 font-mono text-xs uppercase tracking-wider">
                  Direct Promoter & Event Booking Inquiries
                </p>
                <p className="text-sm text-zinc-300 max-w-md mx-auto">
                  Click below to open your email client with our official performance specification template pre-loaded.
                </p>
                <a 
                  href="mailto:sensiwarriors@gmail.com"
                  className={`inline-block w-full text-white font-black uppercase text-xs tracking-widest py-4 rounded-xl hover:scale-[1.01] active:scale-[0.99] text-center transition-all duration-500 shadow-xl ${
                    theme === 'club' 
                      ? 'bg-gradient-to-r from-fuchsia-600 to-fuchsia-700 shadow-fuchsia-500/10' 
                      : 'bg-gradient-to-r from-amber-600 to-amber-700 shadow-amber-600/10'
                  }`}
                >
                  Open Booking Template
                </a>
              </div>
            </Card>
          </section>

          {/* Audio Network */}
          <section className="w-full">
            <SectionTitle theme={theme}>Audio Network</SectionTitle>
            <div className="flex flex-col gap-6 w-full">
              
              <div 
                className="relative w-full rounded-2xl p-4 md:p-8 overflow-hidden bg-cover bg-center border border-white/5 shadow-2xl flex flex-col gap-4"
                style={{ backgroundImage: `linear-gradient(rgba(10, 10, 12, 0.92), rgba(10, 10, 12, 0.92)), url('/assets/boombox for mixcloud widget.png')` }}
              >
                <div className="w-full bg-black/40 rounded-lg p-1 backdrop-blur-sm border border-white/5">
                  <iframe
                    width="100%"
                    height="60"
                    src="https://player-widget.mixcloud.com/widget/iframe/?hide_cover=1&mini=1&feed=%2FBazzinvaders%2Fsaturday-night-fire-vol-1%2F"
                    allow="encrypted-media; fullscreen; autoplay"
                    className="w-full h-[60px]"
                    title="DJ Sensi Mix 1"
                  />
                </div>
                <div className="w-full bg-black/40 rounded-lg p-1 backdrop-blur-sm border border-white/5">
                  <iframe
                    width="100%"
                    height="60"
                    src="https://player-widget.mixcloud.com/widget/iframe/?hide_cover=1&mini=1&feed=%2FSensi_Warriors%2Flos-hermanos-del-bajo-mixtape-vol-1%2F"
                    allow="encrypted-media; fullscreen; autoplay"
                    className="w-full h-[60px]"
                    title="DJ Sensi Mix 2"
                  />
                </div>
                <div className="w-full bg-black/40 rounded-lg p-1 backdrop-blur-sm border border-white/5">
                  <iframe
                    width="100%"
                    height="60"
                    src="https://player-widget.mixcloud.com/widget/iframe/?hide_cover=1&mini=1&feed=%2FBazzinvaders%2Fultra-music-festival-aerial7-dj-competition%2F"
                    allow="encrypted-media; fullscreen; autoplay"
                    className="w-full h-[60px]"
                    title="DJ Sensi Mix 3"
                  />
                </div>
              </div>

              {/* Social Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
              <a href="https://www.youtube.com/@SensiWarriors" target="_blank" rel="noreferrer" className="block w-full">
  <Card theme={theme}>
    <div className="flex items-center justify-between">
      <div>
        <div className="text-sm font-bold text-white">YouTube</div>
        <div className={`text-xs font-mono mt-0.5 transition-colors duration-500 ${theme === 'club' ? 'text-fuchsia-400' : 'text-amber-400'}`}>/SENSI WARRIORS</div>
      </div>
      <Badge theme={theme}>Videos</Badge>
    </div> 
  </Card>
</a>
                <a href="https://instagram.com/sensiwarriors" target="_blank" rel="noreferrer" className="block w-full">
                  <Card theme={theme}>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-bold text-white">Instagram</div>
                        <div className={`text-xs font-mono mt-0.5 transition-colors duration-500 ${theme === 'club' ? 'text-fuchsia-400' : 'text-amber-400'}`}>@sensiwarriors</div>
                      </div>
                      <Badge theme={theme}>Socials</Badge>
                    </div> 
                  </Card>
                </a>
                
                <a href="https://instagram.com/de_la_sensi" target="_blank" rel="noreferrer" className="block w-full">
                  <Card theme={theme}>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-bold text-white">Instagram</div>
                        <div className={`text-xs font-mono mt-0.5 transition-colors duration-500 ${theme === 'club' ? 'text-fuchsia-400' : 'text-amber-400'}`}>@de_la_sensi</div>
                      </div>
                      <Badge theme={theme}>Socials</Badge>
                    </div> 
                  </Card>
                </a>

                <a href="https://facebook.com/sensiwarriors" target="_blank" rel="noreferrer" className="block w-full">
                  <Card theme={theme}>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-bold text-white">Facebook</div>
                        <div className={`text-xs font-mono mt-0.5 transition-colors duration-500 ${theme === 'club' ? 'text-fuchsia-400' : 'text-amber-400'}`}>/sensiwarriors</div>
                      </div>
                      <Badge theme={theme}>Socials</Badge>
                    </div> 
                  </Card>
                </a>
              </div>

            </div>
          </section>
        </main>

        <footer className="mt-20 text-center font-mono text-[10px] text-zinc-600 uppercase tracking-widest w-full">
          © {new Date().getFullYear()} DJ SENSI. DESIGNED BY SENSI. ALL RIGHTS RESERVED.
        </footer>
      </div>
    </div>
  )
}