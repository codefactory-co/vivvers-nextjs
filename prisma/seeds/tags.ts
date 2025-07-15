import { PrismaClient, Tag } from '@prisma/client'
import { uuidv7 } from 'uuidv7'
import { techStackOptions, generalTagOptions } from '../../src/lib/data/tags'

export async function seedTags(prisma: PrismaClient): Promise<Tag[]> {
  const tags: Tag[] = []

  // 기술 스택 태그 생성
  for (const techTag of techStackOptions) {
    const tag = await prisma.tag.create({
      data: {
        id: uuidv7(),
        name: techTag.label,
        slug: techTag.value,
      }
    })
    tags.push(tag)
  }

  // 일반 태그 생성
  for (const generalTag of generalTagOptions) {
    const tag = await prisma.tag.create({
      data: {
        id: uuidv7(),
        name: generalTag.label,
        slug: generalTag.value,
      }
    })
    tags.push(tag)
  }

  return tags
}