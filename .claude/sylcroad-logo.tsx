"use client"

import { useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Download } from "lucide-react"
import { cn } from "@/lib/utils"

interface SylcRoadLogoProps {
  className?: string
  showDownload?: boolean
  size?: "sm" | "md" | "lg" | "xl"
  variant?: "light" | "dark"
}

const SylcRoadLogoSVG = ({
  className,
  variant = "dark",
}: {
  className?: string
  variant?: "light" | "dark"
}) => {
  const textColor = variant === "dark" ? "#FFFFFF" : "#000000"
  const subtitleColor = variant === "dark" ? "#737373" : "#6B7280"

  return (
    <svg
      viewBox="0 0 400 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Main Logo Text - SylcRoad using Euclid Circular A */}
      <text
        x="200"
        y="60"
        textAnchor="middle"
        fontFamily="'Euclid Circular A', system-ui, -apple-system, sans-serif"
        fontSize="56"
        fontWeight="700"
        letterSpacing="-0.02em"
        fill={textColor}
      >
        SylcRoad
      </text>
      {/* Subtitle - Component Library */}
      <text
        x="200"
        y="95"
        textAnchor="middle"
        fontFamily="'Euclid Circular A', system-ui, -apple-system, sans-serif"
        fontSize="14"
        fontWeight="400"
        letterSpacing="0.05em"
        fill={subtitleColor}
      >
        Component Library
      </text>
    </svg>
  )
}

export const SylcRoadLogo = ({
  className,
  showDownload = true,
  size = "xl",
  variant = "dark",
}: SylcRoadLogoProps) => {
  const svgRef = useRef<HTMLDivElement>(null)

  const sizeClasses = {
    sm: "w-48",
    md: "w-72",
    lg: "w-96",
    xl: "w-[600px]",
  }

  const downloadAsSVG = useCallback(() => {
    const svgElement = svgRef.current?.querySelector("svg")
    if (!svgElement) return

    const svgData = new XMLSerializer().serializeToString(svgElement)
    const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" })
    const svgUrl = URL.createObjectURL(svgBlob)

    const downloadLink = document.createElement("a")
    downloadLink.href = svgUrl
    downloadLink.download = "sylcroad-logo.svg"
    document.body.appendChild(downloadLink)
    downloadLink.click()
    document.body.removeChild(downloadLink)
    URL.revokeObjectURL(svgUrl)
  }, [])

  const downloadAsPNG = useCallback(() => {
    const svgElement = svgRef.current?.querySelector("svg")
    if (!svgElement) return

    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size (2x for retina)
    const scale = 2
    canvas.width = 800 * scale
    canvas.height = 240 * scale
    ctx.scale(scale, scale)

    // Fill background
    if (variant === "dark") {
      ctx.fillStyle = "#0a0a0a"
    } else {
      ctx.fillStyle = "#ffffff"
    }
    ctx.fillRect(0, 0, 800, 240)

    const svgData = new XMLSerializer().serializeToString(svgElement)
    const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" })
    const url = URL.createObjectURL(svgBlob)

    const img = new Image()
    img.onload = () => {
      ctx.drawImage(img, 100, 60, 600, 120)
      URL.revokeObjectURL(url)

      canvas.toBlob((blob) => {
        if (!blob) return
        const pngUrl = URL.createObjectURL(blob)
        const downloadLink = document.createElement("a")
        downloadLink.href = pngUrl
        downloadLink.download = "sylcroad-logo.png"
        document.body.appendChild(downloadLink)
        downloadLink.click()
        document.body.removeChild(downloadLink)
        URL.revokeObjectURL(pngUrl)
      }, "image/png")
    }
    img.src = url
  }, [variant])

  return (
    <Card
      className={cn(
        "border-0 shadow-none",
        variant === "dark" ? "bg-[#0a0a0a]" : "bg-white",
        className
      )}
    >
      <CardContent className="flex flex-col items-center justify-center p-12 gap-8">
        <div ref={svgRef} className={cn(sizeClasses[size])}>
          <SylcRoadLogoSVG className="w-full h-auto" variant={variant} />
        </div>

        {showDownload && (
          <div className="flex gap-4">
            <Button
              onClick={downloadAsSVG}
              variant="outline"
              size="lg"
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              Download SVG
            </Button>
            <Button
              onClick={downloadAsPNG}
              variant="default"
              size="lg"
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              Download PNG
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export { SylcRoadLogoSVG }
export default SylcRoadLogo
