"use client"

import { useState } from "react"

interface ColorPalette {
  name: string
  description: string
  hex: string
  hsl: string
  cssVar: string
}

const colorPalettes: Record<string, ColorPalette[]> = {
  "Background Colors": [
    {
      name: "Primary Background",
      description: "Main page background - very dark gray",
      hex: "#0A0B0B",
      hsl: "180 4% 4%",
      cssVar: "--background"
    },
    {
      name: "Card Background", 
      description: "Elevated card background",
      hex: "#1A1B1C",
      hsl: "210 4% 11%",
      cssVar: "--card"
    },
    {
      name: "Popover Background",
      description: "Modal and dropdown background", 
      hex: "#202124",
      hsl: "210 4% 13%",
      cssVar: "--popover"
    }
  ],
  "Text Colors": [
    {
      name: "Primary Text",
      description: "Main content text",
      hex: "#E8E9EA", 
      hsl: "210 7% 91%",
      cssVar: "--foreground"
    },
    {
      name: "Secondary Text",
      description: "Subtitle and helper text",
      hex: "#9AA0A6",
      hsl: "210 7% 63%", 
      cssVar: "--muted-foreground"
    },
    {
      name: "Accent Text",
      description: "Links and interactive text",
      hex: "#8AB4F8",
      hsl: "210 85% 75%",
      cssVar: "--accent-foreground"
    }
  ],
  "Interactive Colors": [
    {
      name: "Primary Blue",
      description: "Main action buttons and links",
      hex: "#4285F4",
      hsl: "217 89% 61%",
      cssVar: "--primary"
    },
    {
      name: "Primary Hover",
      description: "Hover state for primary elements",
      hex: "#1A73E8", 
      hsl: "217 91% 51%",
      cssVar: "--primary-hover"
    },
    {
      name: "Secondary Action",
      description: "Secondary buttons and elements",
      hex: "#2D2E30",
      hsl: "210 4% 18%",
      cssVar: "--secondary"
    }
  ],
  "Border & Surface": [
    {
      name: "Border",
      description: "Default border color",
      hex: "#3C4043",
      hsl: "210 4% 25%",
      cssVar: "--border"
    },
    {
      name: "Input Border",
      description: "Form input borders",
      hex: "#5F6368",
      hsl: "210 6% 38%",
      cssVar: "--input"
    },
    {
      name: "Focus Ring",
      description: "Focus indicator ring",
      hex: "#8AB4F8",
      hsl: "210 85% 75%", 
      cssVar: "--ring"
    }
  ],
  "Status Colors": [
    {
      name: "Success",
      description: "Success states and confirmations",
      hex: "#34A853",
      hsl: "137 56% 43%",
      cssVar: "--success"
    },
    {
      name: "Warning", 
      description: "Warning states and alerts",
      hex: "#FBBC04",
      hsl: "45 97% 50%",
      cssVar: "--warning"
    },
    {
      name: "Destructive",
      description: "Error states and dangerous actions",
      hex: "#EA4335",
      hsl: "4 90% 58%",
      cssVar: "--destructive"
    }
  ]
}

function ColorCard({ color }: { color: ColorPalette }) {
  const [copied, setCopied] = useState<string | null>(null)

  const copyToClipboard = (value: string, type: string) => {
    navigator.clipboard.writeText(value)
    setCopied(`${color.name}-${type}`)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="group bg-card border border-border rounded-lg p-4 hover:border-border/80 transition-colors">
      <div 
        className="w-full h-20 rounded-md mb-4 border border-border/50"
        style={{ backgroundColor: color.hex }}
      />
      
      <div className="space-y-2">
        <h3 className="font-medium text-foreground">{color.name}</h3>
        <p className="text-sm text-muted-foreground">{color.description}</p>
        
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">HEX</span>
            <button
              onClick={() => copyToClipboard(color.hex, 'hex')}
              className="text-xs font-mono text-foreground hover:text-primary transition-colors"
            >
              {copied === `${color.name}-hex` ? 'Copied!' : color.hex}
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">HSL</span>
            <button
              onClick={() => copyToClipboard(color.hsl, 'hsl')}
              className="text-xs font-mono text-foreground hover:text-primary transition-colors"
            >
              {copied === `${color.name}-hsl` ? 'Copied!' : color.hsl}
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">CSS Var</span>
            <button
              onClick={() => copyToClipboard(color.cssVar, 'var')}
              className="text-xs font-mono text-foreground hover:text-primary transition-colors"
            >
              {copied === `${color.name}-var` ? 'Copied!' : color.cssVar}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ColorPage() {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Color Palette
          </h1>
          <p className="text-muted-foreground">
            Vivvers 프로젝트의 다크 테마 컬러 시스템입니다. 각 컬러를 클릭하여 값을 복사할 수 있습니다.
          </p>
        </div>

        <div className="space-y-8">
          {Object.entries(colorPalettes).map(([category, colors]) => (
            <section key={category}>
              <h2 className="text-xl font-semibold text-foreground mb-4">
                {category}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {colors.map((color) => (
                  <ColorCard key={color.name} color={color} />
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-12 p-6 bg-card border border-border rounded-lg">
          <h3 className="text-lg font-semibold text-foreground mb-3">
            사용 방법
          </h3>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>• CSS 변수: <code className="bg-background px-2 py-1 rounded text-xs">hsl(var(--background))</code></p>
            <p>• Tailwind 클래스: <code className="bg-background px-2 py-1 rounded text-xs">bg-background text-foreground</code></p>
            <p>• HSL 값: <code className="bg-background px-2 py-1 rounded text-xs">hsl(180 4% 4%)</code></p>
            <p>• HEX 값: <code className="bg-background px-2 py-1 rounded text-xs">#0A0B0B</code></p>
          </div>
        </div>
      </div>
    </div>
  )
}