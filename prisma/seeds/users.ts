import { PrismaClient, User } from '@prisma/client'
import { uuidv7 } from 'uuidv7'

export async function seedUsers(prisma: PrismaClient): Promise<User[]> {
  const userData = [
    {
      id: uuidv7(),
      username: "kimcoder",
      email: "kim@example.com",
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      bio: "풀스택 개발자입니다. React와 Node.js를 주로 사용합니다.",
    },
    {
      id: uuidv7(),
      username: "parkdesigner",
      email: "park@example.com",
      avatarUrl: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      bio: "UI/UX 디자이너이자 프론트엔드 개발자입니다.",
    },
    {
      id: uuidv7(),
      username: "leestudent",
      email: "lee@example.com",
      avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      bio: "컴퓨터공학과 학생입니다. 백엔드 개발에 관심이 많습니다.",
    },
    {
      id: uuidv7(),
      username: "choistartu",
      email: "choi@example.com",
      avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
      bio: "스타트업 창업자입니다. 핀테크 서비스를 개발하고 있습니다.",
    },
    {
      id: uuidv7(),
      username: "yoondata",
      email: "yoon@example.com",
      avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      bio: "데이터 사이언티스트입니다. 머신러닝과 AI에 관심이 많습니다.",
    },
    {
      id: uuidv7(),
      username: "songmobile",
      email: "song@example.com",
      avatarUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face",
      bio: "모바일 앱 개발자입니다. Flutter와 React Native를 사용합니다.",
    }
  ]

  const users: User[] = []
  
  for (const user of userData) {
    const created = await prisma.user.create({
      data: user
    })
    users.push(created)
  }

  return users
}