"use client"

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ArrowRight, Code, Users, Star } from 'lucide-react'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { 
    opacity: 0, 
    y: 30,
    filter: 'blur(4px)'
  },
  visible: { 
    opacity: 1, 
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.8,
      ease: "easeOut" as const
    }
  }
}

const iconVariants = {
  hidden: { scale: 0, rotate: -180 },
  visible: { 
    scale: 1, 
    rotate: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut" as const,
      delay: 0.8
    }
  }
}

export function HeroSection() {
  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-6xl mx-auto text-center"
      >
        <motion.div 
          variants={itemVariants}
          className="mb-6"
        >
          <div className="flex justify-center items-center gap-2 mb-4">
            <motion.div variants={iconVariants}>
              <Code className="h-8 w-8 text-primary" />
            </motion.div>
            <span className="text-sm font-medium text-muted-foreground">
              Vivvers
            </span>
          </div>
        </motion.div>

        <motion.h1 
          variants={itemVariants}
          className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6"
        >
          <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            프로젝트를 세상에
          </span>
          <br />
          <span className="text-foreground">선보이세요</span>
        </motion.h1>

        <motion.p 
          variants={itemVariants}
          className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed"
        >
          개발자들의 창의적인 프로젝트를 공유하고 발견할 수 있는 
          <br className="hidden md:block" />
          한국 최대 프로젝트 홍보 플랫폼입니다
        </motion.p>

        <motion.div 
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
        >
          <Button size="lg" className="group">
            프로젝트 업로드하기
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
          <Button size="lg" variant="outline">
            프로젝트 둘러보기
          </Button>
        </motion.div>

        <motion.div 
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
        >
          <motion.div 
            variants={iconVariants}
            className="flex flex-col items-center gap-3"
          >
            <div className="rounded-full bg-primary/10 p-4">
              <Code className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold">개발자 중심</h3>
            <p className="text-sm text-muted-foreground text-center">
              개발자들을 위한 전문적인 프로젝트 홍보 공간
            </p>
          </motion.div>

          <motion.div 
            variants={iconVariants}
            className="flex flex-col items-center gap-3"
          >
            <div className="rounded-full bg-primary/10 p-4">
              <Users className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold">커뮤니티</h3>
            <p className="text-sm text-muted-foreground text-center">
              동료 개발자들과 소통하고 피드백을 받아보세요
            </p>
          </motion.div>

          <motion.div 
            variants={iconVariants}
            className="flex flex-col items-center gap-3"
          >
            <div className="rounded-full bg-primary/10 p-4">
              <Star className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold">발견과 성장</h3>
            <p className="text-sm text-muted-foreground text-center">
              새로운 기술과 아이디어를 발견하고 성장하세요
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  )
}