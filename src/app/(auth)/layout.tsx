// src/app/(auth)/layout.tsx
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-cream flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-stone-900 flex-col items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(201,169,110,0.15)_0%,_transparent_70%)]" />
        <div className="relative text-center">
          <div className="text-white font-serif text-3xl tracking-[0.25em] mb-8">AURUM</div>
          <svg className="animate-float w-48 h-48 mx-auto mb-8" viewBox="0 0 240 240" fill="none">
            <polygon points="120,20 200,100 120,135 40,100" fill="#e8d5b0" stroke="#c9a96e" strokeWidth="1.5"/>
            <polygon points="120,20 200,100 120,88" fill="#c9a96e" opacity="0.7"/>
            <polygon points="120,20 40,100 120,88" fill="#b89060" opacity="0.5"/>
            <ellipse cx="120" cy="185" rx="65" ry="16" stroke="#c9a96e" strokeWidth="1.5" fill="none" opacity="0.5"/>
            <line x1="55" y1="178" x2="55" y2="108" stroke="#c9a96e" strokeWidth="1.5"/>
            <line x1="185" y1="178" x2="185" y2="108" stroke="#c9a96e" strokeWidth="1.5"/>
          </svg>
          <h2 className="text-white font-serif text-3xl font-light mb-4">Fine Jewellery<br />for the Modern Soul</h2>
          <p className="text-stone-400 text-sm leading-relaxed max-w-xs">Crafted with intention, worn with love. Discover pieces that tell your story.</p>
        </div>
      </div>

      {/* Right panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <div className="lg:hidden text-center mb-8">
            <a href="/" className="font-serif text-2xl tracking-[0.2em]">AURUM</a>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
