import { PrismaClient } from '@prisma/client'
import { seedUsers } from './seeds/users'
import { seedTags } from './seeds/tags'
import { seedProjects } from './seeds/projects'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 시드 데이터 생성을 시작합니다...')

  try {
    // 기존 데이터 정리 (관계 순서 고려)
    console.log('📝 기존 데이터 정리 중...')
    
    // Delete in reverse dependency order
    await prisma.projectCommentLike.deleteMany().catch(() => {})
    await prisma.projectComment.deleteMany().catch(() => {})
    await prisma.projectTag.deleteMany().catch(() => {})
    await prisma.projectLike.deleteMany().catch(() => {})
    await prisma.project.deleteMany().catch(() => {})
    await prisma.tag.deleteMany().catch(() => {})
    await prisma.user.deleteMany().catch(() => {})

    // 1. 사용자 생성
    console.log('👥 사용자 생성 중...')
    const users = await seedUsers(prisma)
    console.log(`✅ ${users.length}명의 사용자가 생성되었습니다.`)

    // 2. 태그 생성
    console.log('🏷️ 태그 생성 중...')
    const tags = await seedTags(prisma)
    console.log(`✅ ${tags.length}개의 태그가 생성되었습니다.`)

    // 3. 프로젝트 생성 (사용자와 태그 관계 포함)
    console.log('📂 프로젝트 생성 중...')
    const projects = await seedProjects(prisma, users, tags)
    console.log(`✅ ${projects.length}개의 프로젝트가 생성되었습니다.`)

    console.log('🎉 시드 데이터 생성이 완료되었습니다!')
  } catch (error) {
    console.error('❌ 시드 데이터 생성 중 오류가 발생했습니다:', error)
    throw error
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })