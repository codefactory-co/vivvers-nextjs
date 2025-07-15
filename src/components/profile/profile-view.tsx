'use client'

import { useRouter } from 'next/navigation'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Github, Linkedin, ExternalLink, Edit3, Mail, Calendar, User } from 'lucide-react'
import { User as UserType } from '@prisma/client'
import type { UserStats } from '@/types/user'
import { ProfileProjectsSection } from '@/components/profile/profile-projects-section'

interface ProfileViewProps {
  user: UserType
  isOwner: boolean
  stats: UserStats
}

export function ProfileView({ user, isOwner, stats }: ProfileViewProps) {
  const router = useRouter()
  const socialLinks = user.socialLinks as { github?: string; linkedin?: string; portfolio?: string } || {}

  const handleEditClick = () => {
    router.push('/profile/edit')
  }

  return (
    <div className="space-y-6">
      {/* 헤더 섹션 */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <Avatar className="w-24 h-24">
              <AvatarImage src={user.avatarUrl || ''} alt={user.username} />
              <AvatarFallback>
                <User className="w-12 h-12" />
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold">{user.username}</h1>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="w-4 h-4" />
                    <span>{user.email}</span>
                  </div>
                </div>
                
                {isOwner && (
                  <Button onClick={handleEditClick} variant="outline">
                    <Edit3 className="w-4 h-4 mr-2" />
                    편집
                  </Button>
                )}
              </div>
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>가입일: {new Date(user.createdAt).toLocaleDateString('ko-KR')}</span>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* 자기소개 */}
      {user.bio && (
        <Card>
          <CardHeader>
            <CardTitle>자기소개</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap">{user.bio}</p>
          </CardContent>
        </Card>
      )}

      {/* 스킬 */}
      {user.skills && (user.skills as string[]).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>스킬</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {(user.skills as string[]).map((skill, index) => (
                <Badge key={index} variant="secondary">
                  {skill}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 경력 */}
      {user.experience && (
        <Card>
          <CardHeader>
            <CardTitle>경력</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap">{user.experience}</p>
          </CardContent>
        </Card>
      )}

      {/* 소셜 링크 */}
      {(socialLinks.github || socialLinks.linkedin || socialLinks.portfolio) && (
        <Card>
          <CardHeader>
            <CardTitle>링크</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {socialLinks.github && (
                <a
                  href={socialLinks.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Github className="w-4 h-4" />
                  GitHub
                </a>
              )}
              {socialLinks.linkedin && (
                <a
                  href={socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Linkedin className="w-4 h-4" />
                  LinkedIn
                </a>
              )}
              {socialLinks.portfolio && (
                <a
                  href={socialLinks.portfolio}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  포트폴리오
                </a>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 프로젝트 섹션 */}
      <ProfileProjectsSection 
        userId={user.id}
        isOwner={isOwner}
      />

      {/* 통계 */}
      <Card>
        <CardHeader>
          <CardTitle>통계</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold">{stats.projectCount}</div>
              <div className="text-sm text-muted-foreground">프로젝트</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{stats.totalLikes}</div>
              <div className="text-sm text-muted-foreground">좋아요</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{stats.followerCount}</div>
              <div className="text-sm text-muted-foreground">팔로워</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}