"use client";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import useProject from "@/hooks/use-project";
import { api } from "@/trpc/react";
import React from "react";
import AskQuestionCard from "../dashboard/ask-question-card";
import MDEditor from "@uiw/react-md-editor";
import CodeReferences from "../dashboard/code-references";
import { useTheme } from "next-themes";

const QAPage = () => {
  const { resolvedTheme } = useTheme();
  const { projectId } = useProject();
  const { data: questions, isLoading } = api.project.getQuestions.useQuery({
    projectId,
  });
  const [questionIndex, setQuestionIndex] = React.useState(0);
  const question = questions?.[questionIndex];
  return (
    <Sheet>
      <AskQuestionCard />
      <div className="h-4"></div>
      <h1 className="font-semibold">Saved Questions</h1>
      {questions && questions.length === 0 && (
        <div className="mt-3 text-sm">No Questions Saved</div>
      )}
      {isLoading && (
        <div className="mt-3 text-sm font-semibold">Loading...</div>
      )}
      <div className="h-2"></div>
      <div className="flex flex-col gap-2">
        {questions?.map((question, index) => {
          return (
            <React.Fragment key={question.id}>
              <SheetTrigger onClick={() => setQuestionIndex(index)}>
                <div className="border-border flex items-center gap-4 overflow-hidden rounded-lg border bg-white p-4 shadow-sm dark:bg-zinc-900 dark:text-white">
                  <img
                    className="rounded-full"
                    height={30}
                    width={30}
                    src={question.user.imageUrl ?? ""}
                  />
                  <div className="flex min-w-0 flex-col overflow-hidden text-left">
                    <div className="flex min-w-0 items-center gap-2">
                      <p className="line-clamp-1 min-w-0 overflow-hidden text-sm font-medium break-words text-ellipsis text-gray-700 dark:text-gray-200">
                        {question.question}
                      </p>
                      <span className="text-xs whitespace-nowrap text-gray-400 dark:text-gray-500">
                        {question.createdAt.toLocaleDateString()}
                      </span>
                    </div>
                    <p className="line-clamp-1 min-w-0 overflow-hidden text-sm break-words text-ellipsis text-gray-500 dark:text-gray-400">
                      {question.answer}
                    </p>
                  </div>
                </div>
              </SheetTrigger>
            </React.Fragment>
          );
        })}
      </div>
      {question && (
        <SheetContent className="max-h-screen overflow-y-auto sm:max-w-[80vw]">
          <SheetHeader>
            <SheetTitle className="px-2 break-words dark:px-3">
              {question.question}
            </SheetTitle>
            <div data-color-mode={resolvedTheme === "dark" ? "dark" : "light"}>
              <MDEditor.Markdown
                source={question.answer}
                className="prose w-full max-w-none rounded-md px-2 py-3 dark:px-3"
              />
            </div>
            <CodeReferences
              filesReferences={(question.filesReferences ?? []) as any}
            />
          </SheetHeader>
        </SheetContent>
      )}
    </Sheet>
  );
};

export default QAPage;
