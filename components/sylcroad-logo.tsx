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

// SylcRoad Icon - the geometric K mark
export const SylcRoadIcon = ({
  className,
  variant = "dark",
}: {
  className?: string
  variant?: "light" | "dark"
}) => {
  const fillColor = variant === "dark" ? "#FFFFFF" : "#000000"

  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Top chevron pointing right */}
      <polygon
        points="0,0 45,0 90,22 45,44 45,22 0,44"
        fill={fillColor}
      />
      {/* Bottom chevron pointing left */}
      <polygon
        points="0,56 45,56 45,78 90,56 90,100 45,100 0,78"
        fill={fillColor}
      />
    </svg>
  )
}

const SylcRoadLogoSVG = ({
  className,
  variant = "dark",
  showIcon = true,
}: {
  className?: string
  variant?: "light" | "dark"
  showIcon?: boolean
}) => {
  const textColor = variant === "dark" ? "#FFFFFF" : "#000000"

  return (
    <svg
      viewBox={showIcon ? "0 0 500 100" : "0 0 400 100"}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {showIcon && (
        <g transform="translate(0, 15)">
          {/* Top arrow pointing right */}
          <polygon
            points="0,0 35,0 70,17.5 35,35 0,35"
            fill={textColor}
          />
          {/* Bottom arrow pointing left */}
          <polygon
            points="0,35 35,35 35,52.5 70,70 0,70"
            fill={textColor}
          />
        </g>
      )}
      {/* Main Logo Text - SylcRoad */}
      <text
        x={showIcon ? "290" : "200"}
        y="68"
        textAnchor="middle"
        fontFamily="'Inter', 'Euclid Circular A', system-ui, -apple-system, sans-serif"
        fontSize="72"
        fontWeight="800"
        letterSpacing="-0.03em"
        fill={textColor}
      >
        SylcRoad
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
