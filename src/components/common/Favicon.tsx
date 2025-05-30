"use client";

import { useEffect } from "react";

export default function Favicon() {
  useEffect(() => {
    try {
      // Create a canvas to render the SVG
      const canvas = document.createElement("canvas");
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext("2d");

      if (!ctx) return;

      const svgData = `
      <svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
        <defs>
          <linearGradient id="cameraGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#0ea5e9" stop-opacity="1" />
            <stop offset="50%" stop-color="#4f46e5" stop-opacity="1" />
            <stop offset="100%" stop-color="#6366f1" stop-opacity="1" />
          </linearGradient>
          
          <linearGradient id="lensGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#3b82f6" stop-opacity="1" />
            <stop offset="100%" stop-color="#1e40af" stop-opacity="1" />
          </linearGradient>
          
          <linearGradient id="playGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#a855f7" stop-opacity="1" />
            <stop offset="100%" stop-color="#7e22ce" stop-opacity="1" />
          </linearGradient>
          
          <filter id="cameraShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="8" dy="12" stdDeviation="12" flood-opacity="0.5" />
          </filter>
          
          <filter id="innerGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="24" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          
          <pattern id="noisePattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
            <rect width="100" height="100" fill="#ffffff" opacity="0.04" />
            <rect width="25" height="25" fill="#ffffff" opacity="0.06" />
            <rect x="25" y="25" width="25" height="25" fill="#ffffff" opacity="0.06" />
            <rect x="50" y="50" width="25" height="25" fill="#ffffff" opacity="0.06" />
            <rect x="75" y="75" width="25" height="25" fill="#ffffff" opacity="0.06" />
          </pattern>
        </defs>

        <!-- Background glow effect -->
        <rect x="30" y="80" width="360" height="280" rx="60" ry="60" 
              fill="#4f46e5" opacity="0.25" filter="url(#innerGlow)" 
              transform="translate(8, 8)" />

        <!-- Main camera body - MAXIMIZED SIZE -->
        <rect x="30" y="80" width="360" height="280" rx="60" ry="60" 
              fill="url(#cameraGradient)" filter="url(#cameraShadow)" 
              stroke="#1e293b" stroke-width="20" />

        <!-- Texture overlay -->
        <rect x="30" y="80" width="360" height="280" rx="60" ry="60" 
              fill="url(#noisePattern)" />

        <!-- Glass effect overlay -->
        <rect x="30" y="80" width="360" height="140" rx="60" ry="60" 
              fill="#ffffff" opacity="0.12" />

        <!-- Camera lens/side - ENLARGED -->
        <path d="M390,160 L480,120 L480,320 L390,280 Z" 
              fill="url(#lensGradient)" stroke="#1e293b" stroke-width="20" 
              stroke-linejoin="round" />

        <!-- Lens texture -->
        <path d="M390,160 L480,120 L480,320 L390,280 Z" 
              fill="url(#noisePattern)" />

        <!-- Lens highlight -->
        <path d="M400,170 L470,140 L470,170 L400,200 Z" 
              fill="#ffffff" opacity="0.2" />

        <!-- MAXIMIZED Play button with glow -->
        <path d="M120,160 L320,220 L120,280 Z" 
              fill="url(#playGradient)" stroke="#1e293b" stroke-width="16" 
              stroke-linejoin="round" filter="url(#innerGlow)" />

        <!-- Play button highlight -->
        <path d="M140,180 L280,220 L140,260 Z" 
              fill="#ffffff" opacity="0.35" />

        <!-- Camera details - ENLARGED -->
        <circle cx="80" cy="130" r="22" fill="#ffffff" opacity="0.8" />
        <circle cx="80" cy="130" r="12" fill="#1e293b" opacity="0.9" />

        <!-- Modern accent lines -->
        <path d="M60,340 L360,340" stroke="#ffffff" stroke-width="8" 
              stroke-dasharray="20 20" opacity="0.5" />

        <!-- Decorative elements - ENLARGED -->
        <circle cx="200" cy="110" r="8" fill="#ffffff" opacity="0.6" />
        <circle cx="250" cy="110" r="8" fill="#ffffff" opacity="0.6" />
        <circle cx="300" cy="110" r="8" fill="#ffffff" opacity="0.6" />
      </svg>`;

      const img = new Image();

      img.onload = () => {
        // Fill background with a subtle color to make icon more visible
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, 512, 512);

        // Draw the image to the canvas
        ctx.drawImage(img, 0, 0);

        // Generate the main favicon
        const mainFavicon =
          (document.querySelector("link[rel='icon']") as HTMLLinkElement) ||
          (document.createElement("link") as HTMLLinkElement);
        mainFavicon.type = "image/png";
        mainFavicon.rel = "icon";
        mainFavicon.href = canvas.toDataURL("image/png");
        document.head.appendChild(mainFavicon);

        // Create different size favicons
        const sizes = [16, 32, 64, 128, 192, 512];
        sizes.forEach((size) => {
          // Create a new canvas for this size
          const sizeCanvas = document.createElement("canvas");
          sizeCanvas.width = size;
          sizeCanvas.height = size;
          const sizeCtx = sizeCanvas.getContext("2d");

          if (sizeCtx) {
            // Add white background for better visibility at small sizes
            sizeCtx.fillStyle = "#ffffff";
            sizeCtx.fillRect(0, 0, size, size);

            // Draw the image scaled to this size with antialiasing
            sizeCtx.imageSmoothingEnabled = true;
            sizeCtx.imageSmoothingQuality = "high";
            sizeCtx.drawImage(img, 0, 0, size, size);

            // Create a link tag for this size
            const link = document.createElement("link");
            link.rel = "icon";
            link.type = "image/png";
            link.sizes = `${size}x${size}`;
            link.href = sizeCanvas.toDataURL("image/png");
            document.head.appendChild(link);

            // For certain sizes, also create Apple touch icons
            if (size >= 180) {
              const appleLink = document.createElement("link");
              appleLink.rel = "apple-touch-icon";
              appleLink.sizes = `${size}x${size}`;
              appleLink.href = sizeCanvas.toDataURL("image/png");
              document.head.appendChild(appleLink);
            }
          }
        });

        console.log("Enhanced favicon generation complete with all effects");
      };

      // Handle errors
      img.onerror = (e) => {
        console.error("Error loading favicon SVG:", e);
      };

      // Use a safer way to encode the SVG
      const encodedSvg = encodeURIComponent(svgData)
        .replace(/'/g, "%27")
        .replace(/"/g, "%22");

      img.src = `data:image/svg+xml,${encodedSvg}`;
    } catch (error) {
      console.error("Fatal error in favicon generation:", error);
    }
  }, []);

  return null;
}
