'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Github, Linkedin, ExternalLink } from 'lucide-react'

interface SocialLinksInputProps {
  value: {
    github?: string
    linkedin?: string
    portfolio?: string
  }
  onChange: (links: { github?: string; linkedin?: string; portfolio?: string }) => void
  disabled?: boolean
}

export function SocialLinksInput({ value, onChange, disabled }: SocialLinksInputProps) {
  const handleChange = (field: string, url: string) => {
    onChange({
      ...value,
      [field]: url
    })
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="github" className="flex items-center gap-2">
          <Github className="h-4 w-4" />
          GitHub
        </Label>
        <Input
          id="github"
          type="url"
          placeholder="https://github.com/username"
          value={value.github || ''}
          onChange={(e) => handleChange('github', e.target.value)}
          disabled={disabled}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="linkedin" className="flex items-center gap-2">
          <Linkedin className="h-4 w-4" />
          LinkedIn
        </Label>
        <Input
          id="linkedin"
          type="url"
          placeholder="https://linkedin.com/in/username"
          value={value.linkedin || ''}
          onChange={(e) => handleChange('linkedin', e.target.value)}
          disabled={disabled}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="portfolio" className="flex items-center gap-2">
          <ExternalLink className="h-4 w-4" />
          포트폴리오
        </Label>
        <Input
          id="portfolio"
          type="url"
          placeholder="https://your-portfolio.com"
          value={value.portfolio || ''}
          onChange={(e) => handleChange('portfolio', e.target.value)}
          disabled={disabled}
        />
      </div>
    </div>
  )
}