import { PrismaClient, Tag } from '@prisma/client'
import { uuidv7 } from 'uuidv7'
import { generalTagOptions } from '../../src/lib/data/tags'

export async function seedTags(prisma: PrismaClient): Promise<Tag[]> {
  const tags: Tag[] = []

  // 일반 태그 생성
  for (const generalTag of generalTagOptions) {
    const tag = await prisma.tag.create({
      data: {
        id: uuidv7(),
        name: generalTag.label
      }
    })
    tags.push(tag)
  }

  // 기술 관련 태그 추가 생성
  const techTags = [
    'React', 'TypeScript', 'JavaScript', 'Next.js', 'Node.js',
    'Python', 'Django', 'FastAPI', 'Java', 'Spring',
    'Vue.js', 'Angular', 'Svelte', 'Flutter', 'React Native',
    'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Prisma',
    'AWS', 'Google Cloud', 'Azure', 'Docker', 'Kubernetes',
    'GraphQL', 'REST API', 'WebSocket', 'gRPC', 'WebRTC',
    'TailwindCSS', 'CSS', 'Sass', 'styled-components', 'Material-UI',
    'Git', 'GitHub', 'GitLab', 'CI/CD', 'DevOps',
    'TensorFlow', 'PyTorch', 'OpenAI', 'Machine Learning', 'AI',
    'Blockchain', 'Web3', 'Solidity', 'Smart Contract', 'NFT',
    'Unity', 'Unreal Engine', 'Three.js', 'WebGL', 'Canvas',
    'Figma', 'Sketch', 'Adobe XD', 'Photoshop', 'Illustrator',
    'Firebase', 'Supabase', 'Amplify', 'Vercel', 'Netlify'
  ]

  for (const techName of techTags) {
    const tag = await prisma.tag.create({
      data: {
        id: uuidv7(),
        name: techName
      }
    })
    tags.push(tag)
  }

  return tags
}