"use client";
import React from "react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

export const BoxesCore = ({ className, ...rest }: { className?: string }) => {
  const { theme } = useTheme();
  const rows = new Array(150).fill(1);
  const cols = new Array(100).fill(1);
  
  // Theme-responsive color palettes
  const lightModeColors = [
    "rgb(14 165 233)",  // sky-600
    "rgb(219 39 119)",  // pink-600
    "rgb(34 197 94)",   // green-600
    "rgb(202 138 4)",   // yellow-600
    "rgb(220 38 38)",   // red-600
    "rgb(147 51 234)",  // purple-600
    "rgb(37 99 235)",   // blue-600
    "rgb(79 70 229)",   // indigo-600
    "rgb(124 58 237)",  // violet-600
  ];

  const darkModeColors = [
    "rgb(125 211 252)", // sky-300
    "rgb(249 168 212)", // pink-300
    "rgb(134 239 172)", // green-300
    "rgb(253 224 71)",  // yellow-300
    "rgb(252 165 165)", // red-300
    "rgb(216 180 254)", // purple-300
    "rgb(147 197 253)", // blue-300
    "rgb(165 180 252)", // indigo-300
    "rgb(196 181 253)", // violet-300
  ];

  const colors = theme === 'light' ? lightModeColors : darkModeColors;

  const getRandomColor = () => {
    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <div
      style={{
        transform: `translate(-40%,-60%) skewX(-48deg) skewY(14deg) scale(0.675) rotate(0deg) translateZ(0)`,
      }}
      className={cn(
        "absolute left-1/4 p-4 -top-1/4 flex -translate-x-1/2 -translate-y-1/2 w-full h-full z-0",
        className
      )}
      {...rest}
    >
      {rows.map((_, i) => (
        <motion.div
          key={`row` + i}
          className="w-16 h-8 border-l border-border relative"
        >
          {cols.map((_, j) => (
            <motion.div
              whileHover={{
                backgroundColor: getRandomColor(),
                transition: { duration: 0 },
              }}
              animate={{
                transition: { duration: 2 },
              }}
              key={`col` + j}
              className="w-16 h-8 border-r border-t border-border relative"
            >
              {j % 2 === 0 && i % 2 === 0 ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="absolute h-6 w-10 -top-[14px] -left-[22px] text-muted-foreground stroke-[1px] pointer-events-none"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6v12m6-6H6"
                  />
                </svg>
              ) : null}
            </motion.div>
          ))}
        </motion.div>
      ))}
    </div>
  );
};

export const Boxes = React.memo(BoxesCore);