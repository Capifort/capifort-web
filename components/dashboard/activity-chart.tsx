'use client'

import { useMemo, useState } from 'react'

interface Series {
  key: string
  label: string
  color: string
  dash?: string
  data: number[]
}

const days = ['May 25', 'May 26', 'May 27', 'May 28', 'May 29', 'May 30', 'May 31']

const series: Series[] = [
  { key: 'uploads',   label: 'Uploads',   color: 'var(--text)',   dash: undefined, data: [420, 610, 580, 690, 720, 760, 840] },
  { key: 'processed', label: 'Processed', color: 'var(--muted)',  dash: '5 4',     data: [260, 340, 400, 380, 460, 500, 560] },
  { key: 'queries',   label: 'Queries',   color: 'var(--subtle)', dash: '1.5 3.5', data: [60, 120, 180, 210, 240, 260, 300] },
]

const WIDTH = 640
const HEIGHT = 200
const PAD_L = 32
const PAD_R = 8
const PAD_T = 12
const PAD_B = 24

export function ActivityChart() {
  const [hoverIdx, setHoverIdx] = useState<number | null>(null)

  const max = useMemo(() => Math.max(...series.flatMap((s) => s.data)), [])
  const niceMax = Math.ceil(max / 200) * 200

  const plotW = WIDTH - PAD_L - PAD_R
  const plotH = HEIGHT - PAD_T - PAD_B

  const x = (i: number) => PAD_L + (i / (days.length - 1)) * plotW
  const y = (v: number) => PAD_T + plotH - (v / niceMax) * plotH

  const linePath = (data: number[]) =>
    data.map((v, i) => `${i === 0 ? 'M' : 'L'} ${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join(' ')

  const gridLines = [0, 0.25, 0.5, 0.75, 1]

  const handleMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const px = ((e.clientX - rect.left) / rect.width) * WIDTH
    const ratio = Math.min(1, Math.max(0, (px - PAD_L) / plotW))
    const idx = Math.round(ratio * (days.length - 1))
    setHoverIdx(idx)
  }

  return (
    <div>
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="w-full h-auto"
        onMouseMove={handleMove}
        onMouseLeave={() => setHoverIdx(null)}
        role="img"
        aria-label="Workspace activity over the last 7 days"
      >
        {/* Gridlines + y labels */}
        {gridLines.map((g) => {
          const val = Math.round(niceMax * g)
          const yy = PAD_T + plotH - g * plotH
          return (
            <g key={g}>
              <line x1={PAD_L} x2={WIDTH - PAD_R} y1={yy} y2={yy} stroke="var(--border-subtle)" strokeWidth={1} />
              <text x={0} y={yy + 3} className="dash-small-label" fill="var(--subtle)" fontSize={10}>
                {val >= 1000 ? `${val / 1000}K` : val}
              </text>
            </g>
          )
        })}

        {/* Crosshair */}
        {hoverIdx !== null && (
          <line
            x1={x(hoverIdx)} x2={x(hoverIdx)}
            y1={PAD_T} y2={PAD_T + plotH}
            stroke="var(--border-hover)" strokeWidth={1}
          />
        )}

        {/* Series lines */}
        {series.map((s) => (
          <path
            key={s.key}
            d={linePath(s.data)}
            fill="none"
            stroke={s.color}
            strokeWidth={2}
            strokeDasharray={s.dash}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ))}

        {/* Hover markers */}
        {hoverIdx !== null && series.map((s) => (
          <circle
            key={s.key}
            cx={x(hoverIdx)}
            cy={y(s.data[hoverIdx])}
            r={3}
            fill={s.color}
            stroke="var(--surface)"
            strokeWidth={1.5}
          />
        ))}

        {/* X axis labels */}
        {days.map((d, i) => (
          <text
            key={d}
            x={x(i)}
            y={HEIGHT - 4}
            textAnchor={i === 0 ? 'start' : i === days.length - 1 ? 'end' : 'middle'}
            className="dash-small-label"
            fill="var(--subtle)"
            fontSize={10}
          >
            {d}
          </text>
        ))}
      </svg>

      {/* Tooltip */}
      {hoverIdx !== null && (
        <div className="dash-caption text-[var(--muted)] mb-2 -mt-1">
          {days[hoverIdx]} —{' '}
          {series.map((s, i) => (
            <span key={s.key} style={{ color: s.color }}>
              {s.label} {s.data[hoverIdx]}{i < series.length - 1 ? '  ·  ' : ''}
            </span>
          ))}
        </div>
      )}

      {/* Legend */}
      <div className="flex items-center gap-5 mt-2">
        {series.map((s) => (
          <div key={s.key} className="flex items-center gap-1.5">
            <svg width="14" height="8" aria-hidden>
              <line x1={0} y1={4} x2={14} y2={4} stroke={s.color} strokeWidth={2} strokeDasharray={s.dash} strokeLinecap="round" />
            </svg>
            <span className="dash-small-label text-[var(--muted)]">{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
