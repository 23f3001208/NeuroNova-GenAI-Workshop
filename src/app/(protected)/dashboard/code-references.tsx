"use client";

import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { lucario } from "react-syntax-highlighter/dist/esm/styles/prism";
import { cn } from "@/lib/utils";
import React from "react";

type Props = {
  filesReferences: { fileName: string; sourceCode: string; summary: string }[];
};

const CodeReferences = ({ filesReferences }: Props) => {
  const [tab, setTab] = React.useState(filesReferences[0]?.fileName);
  if (filesReferences.length === 0) return null;

  return (
    <div className="max-w-[80vw]">
      <Tabs value={tab} onValueChange={setTab}>
        <div className="bg-muted border-border flex gap-2 overflow-x-auto rounded-md border p-1">
          {filesReferences.map((file) => (
            <button
              onClick={() => setTab(file.fileName)}
              key={file.fileName}
              className={cn(
                "text-muted-foreground rounded-md px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-colors",
                {
                  "bg-background text-foreground border-border border":
                    tab === file.fileName,
                },
              )}
            >
              {file.fileName}
            </button>
          ))}
        </div>
        {filesReferences.map((file) => (
          <TabsContent
            key={file.fileName}
            value={file.fileName}
            className="bg-card border-border max-h-[40vh] max-w-7xl overflow-scroll rounded-md border"
          >
            <SyntaxHighlighter language="typescript" style={lucario}>
              {file.sourceCode}
            </SyntaxHighlighter>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default CodeReferences;
