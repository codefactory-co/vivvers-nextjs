import { Star } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface ProjectFeaturesProps {
  features: string[]
  className?: string
}

export function ProjectFeatures({ features, className }: ProjectFeaturesProps) {
  return (
    <Card className={cn("", className)}>
      <CardHeader>
        <CardTitle>주요 기능</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-3">
              <Star className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
              <span className="leading-relaxed">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}