"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // 컴포넌트가 마운트된 후에만 테마 정보를 표시 (하이드레이션 이슈 방지)
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    // 서버 사이드 렌더링 시에는 기본 아이콘 표시
    return (
      <Button variant="ghost" size="icon" disabled>
        <Sun className="h-4 w-4" />
      </Button>
    )
  }

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label={theme === "dark" ? "라이트 모드로 변경" : "다크 모드로 변경"}
      className="relative"
    >
      {theme === "dark" ? (
        <Sun className="h-4 w-4 transition-all" />
      ) : (
        <Moon className="h-4 w-4 transition-all" />
      )}
    </Button>
  )
}