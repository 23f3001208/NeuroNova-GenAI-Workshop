"use client";

import React, { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";
import { Card } from "@/components/ui/card";
import { api } from "@/trpc/react";
import { Button } from "@/components/ui/button";
import svgPanZoom from "svg-pan-zoom";
import { useTheme } from "next-themes";

interface MeetingCardProps {
  projectId: string;
}

const MeetingCard: React.FC<MeetingCardProps> = ({ projectId }) => {
  const ref = useRef<HTMLDivElement>(null);
  const svgRef = useRef<string | null>(null);
  const panZoomInstance = useRef<any>(null);
  const [isRendered, setIsRendered] = useState(false);
  const { resolvedTheme } = useTheme();

  const { data: mermaidChart, isLoading } = api.project.getMermaidCode.useQuery(
    { projectId },
  );
  useEffect(() => {
    if (!mermaidChart?.chartCode) return;

    mermaid.initialize({
      startOnLoad: false,
      theme: resolvedTheme === "dark" ? "dark" : "default",
      themeCSS: `
    rect {
      rx: 8;
      ry: 8;
    }
  `,
    });

    const renderMermaid = async () => {
      try {
        const { svg } = await mermaid.render(
          "githubDiagram",
          mermaidChart.chartCode,
        );
        const styledSvg = svg.replace(/<svg([^>]*?)>/, (_match, attrs) => {
          const cleanedAttrs = attrs
            .replace(/(width|height|style)="[^"]*"/g, "")
            .trim();

          return `<svg ${cleanedAttrs} preserveAspectRatio="xMidYMid meet" width="100%" height="100%" style="max-width:100%; max-height:100%; display:block;">`;
        });

        if (!ref.current) return;
        ref.current.innerHTML = styledSvg;

        requestAnimationFrame(() => {
          const svgElement = ref.current?.querySelector<SVGSVGElement>("svg");

          if (svgElement && svgElement.getBBox().width > 0) {
            panZoomInstance.current = svgPanZoom(svgElement, {
              zoomEnabled: true,
              controlIconsEnabled: false,
              fit: true,
              center: true,
              panEnabled: true,
              minZoom: 0.5,
              maxZoom: 10,
            });

            setIsRendered(true);
            svgRef.current = styledSvg;
          } else {
            console.warn("SVG Element is not Ready or has Zero Width.");
          }
        });
      } catch (err) {
        console.error("Error Rendering Mermaid Diagram:", err);
        setIsRendered(false);
      }
    };

    renderMermaid();

    return () => {
      if (panZoomInstance.current) {
        panZoomInstance.current.destroy();
        panZoomInstance.current = null;
      }
    };
  }, [mermaidChart, resolvedTheme]);

  const downloadSVG = () => {
    if (!svgRef.current) return;
    const blob = new Blob([svgRef.current], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "Repo-Structure.svg";
    link.click();

    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    if (panZoomInstance.current) {
      panZoomInstance.current.resize();
      panZoomInstance.current.fit();
      panZoomInstance.current.center();
      panZoomInstance.current.zoom(1);
    }
  };

  return (
    <Card className="bg-card border-border col-span-1 mt-3 border p-5 shadow-sm">
      <div className="mb-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-foreground w-full text-center font-semibold sm:text-left">
            GitHub Repository Structure
          </h2>
          {isRendered && (
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button
                onClick={handleReset}
                variant="outline"
                className="border-border"
              >
                Reset View
              </Button>
              <Button
                onClick={downloadSVG}
                variant="outline"
                className="border-border"
              >
                Download as SVG
              </Button>
            </div>
          )}
        </div>
      </div>
      {isLoading ? (
        <p className="text-muted-foreground text-center text-sm">
          Loading Chart...
        </p>
      ) : mermaidChart ? (
        <div
          ref={ref}
          className="mt-[-20] overflow-auto rounded-lg"
          style={{
            width: "100%",
            height: "300px",
            border: "1px solid var(--border)",
            cursor: "grab",
          }}
        />
      ) : (
        <p className="text-center text-sm text-red-500">
          No Mermaid Chart Found
        </p>
      )}
    </Card>
  );
};

export default MeetingCard;
