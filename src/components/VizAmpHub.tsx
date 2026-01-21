'use client';

import Image from 'next/image';

// Custom SVG Icons (avoiding lucide-react dependency)
function WindIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.348 14.652a3.75 3.75 0 0 1 0-5.304m5.304 0a3.75 3.75 0 0 1 0 5.304m-7.425 2.121a6.75 6.75 0 0 1 0-9.546m9.546 0a6.75 6.75 0 0 1 0 9.546M5.106 18.894c-3.808-3.807-3.808-9.98 0-13.788m13.788 0c3.808 3.807 3.808 9.98 0 13.788" />
    </svg>
  );
}

function UsersIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
    </svg>
  );
}

function DropletsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" />
    </svg>
  );
}

function ZapIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
    </svg>
  );
}

function CloudIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15a4.5 4.5 0 0 0 4.5 4.5H18a3.75 3.75 0 0 0 1.332-7.257 3 3 0 0 0-3.758-3.848 5.25 5.25 0 0 0-10.233 2.33A4.502 4.502 0 0 0 2.25 15Z" />
    </svg>
  );
}

const sensorData = [
  { id: 'iaq', Icon: WindIcon, label: 'Air Quality', left: '10%', top: '30%', delay: 0 },
  { id: 'occupancy', Icon: UsersIcon, label: 'Occupancy', left: '90%', top: '30%', delay: 0.4 },
  { id: 'water', Icon: DropletsIcon, label: 'Water', left: '10%', top: '70%', delay: 0.8 },
  { id: 'energy', Icon: ZapIcon, label: 'Energy', left: '90%', top: '70%', delay: 1.2 },
] as const;

const inboundPaths = [
  { id: 'iaq', d: 'M40,135 C80,135 120,180 200,225' },
  { id: 'occupancy', d: 'M360,135 C320,135 280,180 200,225' },
  { id: 'water', d: 'M40,315 C80,315 120,270 200,225' },
  { id: 'energy', d: 'M360,315 C320,315 280,270 200,225' },
] as const;

const outboundPath = { id: 'cloud', d: 'M200,225 C200,180 200,120 200,60' };

export function VizAmpHub() {
  return (
    <div
      className="relative w-full max-w-[320px] sm:max-w-[400px] md:max-w-[500px] mx-auto p-4 sm:p-6 md:p-8 overflow-hidden"
      style={{ aspectRatio: '1 / 1.1' }}
      role="img"
      aria-label="Amp Hub gateway collecting data from air quality, occupancy, water, and energy sensors, then transmitting to the cloud"
    >
      <div className="relative w-full h-full">

        {/* Signal waves emanating from hub - hidden on small screens to prevent overflow */}
        <div
          className="absolute z-0 pointer-events-none hidden sm:block"
          style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}
        >
          <div className="amphub-signal-wave amphub-signal-wave-1" />
          <div className="amphub-signal-wave amphub-signal-wave-2" />
          <div className="amphub-signal-wave amphub-signal-wave-3" />
        </div>

        {/* SVG paths and animated dots */}
        <svg
          viewBox="0 0 400 450"
          className="absolute inset-0 w-full h-full pointer-events-none overflow-visible sm:overflow-visible"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="inboundGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--color-primary, #1DB9A0)" stopOpacity="0.1" />
              <stop offset="100%" stopColor="var(--color-primary, #1DB9A0)" stopOpacity="0.3" />
            </linearGradient>
            <linearGradient id="outboundGradient" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="var(--color-primary, #1DB9A0)" stopOpacity="0.3" />
              <stop offset="100%" stopColor="var(--color-primary, #1DB9A0)" stopOpacity="0.5" />
            </linearGradient>
            <filter id="dotGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Inbound paths from sensors */}
          {inboundPaths.map((p) => (
            <path
              key={`path-${p.id}`}
              d={p.d}
              fill="none"
              stroke="url(#inboundGradient)"
              strokeWidth="1.5"
              strokeDasharray="6 4"
              className="amphub-path"
            />
          ))}

          {/* Outbound path to cloud */}
          <path
            d={outboundPath.d}
            fill="none"
            stroke="url(#outboundGradient)"
            strokeWidth="2"
            strokeDasharray="8 4"
            className="amphub-path-outbound"
          />

          {/* Animated dots flowing inward */}
          {inboundPaths.map((p, index) => (
            <circle
              key={`dot-in-${p.id}`}
              r="5"
              fill="var(--color-primary, #1DB9A0)"
              filter="url(#dotGlow)"
              className="amphub-flow-dot"
            >
              <animateMotion
                dur="2s"
                repeatCount="indefinite"
                begin={`${index * 0.4}s`}
                calcMode="spline"
                keySplines="0.4 0 0.2 1"
                keyTimes="0;1"
                path={p.d}
              />
            </circle>
          ))}

          {/* Animated dot flowing to cloud */}
          <circle
            r="6"
            fill="var(--color-primary, #1DB9A0)"
            filter="url(#dotGlow)"
            className="amphub-flow-dot-outbound"
          >
            <animateMotion
              dur="1.5s"
              repeatCount="indefinite"
              begin="2s"
              calcMode="spline"
              keySplines="0.4 0 0.2 1"
              keyTimes="0;1"
              path={outboundPath.d}
            />
          </circle>
        </svg>

        {/* Cloud destination */}
        <div
          className="absolute z-10 flex flex-col items-center amphub-cloud"
          style={{ left: '50%', top: '5%', transform: 'translateX(-50%)' }}
        >
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[var(--color-primary,#1DB9A0)] to-[var(--color-primary-dark,#0D9B82)] shadow-lg flex items-center justify-center amphub-cloud-icon">
            <CloudIcon className="w-7 h-7 text-white" />
          </div>
          <span className="text-xs text-[var(--muted)] mt-2 font-medium">Amp Cloud</span>
        </div>

        {/* Sensor icons */}
        {sensorData.map((sensor) => (
          <div
            key={`sensor-${sensor.id}`}
            className="absolute flex flex-col items-center z-10 amphub-sensor-icon"
            style={{
              left: sensor.left,
              top: sensor.top,
              transform: 'translate(-50%, -50%)',
              animationDelay: `${sensor.delay}s`,
            }}
          >
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-[var(--background)] border border-[var(--border)] shadow-sm flex items-center justify-center transition-all hover:shadow-md hover:border-[var(--color-primary)]">
              <sensor.Icon className="w-5 h-5 sm:w-6 sm:h-6 text-[var(--muted)]" />
            </div>
            <span className="text-[10px] sm:text-xs text-[var(--muted)] mt-1.5 font-medium whitespace-nowrap">
              {sensor.label}
            </span>
          </div>
        ))}

        {/* Central Amp Hub device */}
        <div
          className="absolute z-20"
          style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}
        >
          {/* Processing rings */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="amphub-processing-ring amphub-processing-ring-1" />
            <div className="amphub-processing-ring amphub-processing-ring-2" />
            <div className="amphub-processing-ring amphub-processing-ring-3" />
          </div>

          {/* Device image */}
          <div className="relative w-[160px] h-[160px] sm:w-[200px] sm:h-[200px] flex items-center justify-center">
            <Image
              src="/images/hardware/amp-hub.png"
              alt="Amp Hub Device"
              width={180}
              height={180}
              className="object-contain drop-shadow-xl relative z-10"
              priority
            />
            {/* LED indicator */}
            <div
              className="absolute w-2 h-2 rounded-full bg-[var(--color-primary)] amphub-led"
              style={{ bottom: '25%', left: '50%', transform: 'translateX(-50%)' }}
            />
          </div>
        </div>

        {/* Processing status text */}
        <div
          className="absolute z-10 text-center"
          style={{ left: '50%', top: '72%', transform: 'translateX(-50%)' }}
        >
          <span className="text-[10px] text-[var(--color-primary)] font-medium tracking-wider uppercase amphub-processing-text">
            Processing
          </span>
        </div>

      </div>
    </div>
  );
}

export default VizAmpHub;
