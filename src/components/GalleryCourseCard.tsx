import { type Chapter, type Course, type Unit } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";
import { Trash2 } from "lucide-react";

type Props = {
  course: Course & {
    units: (Unit & {
      chapters: Chapter[];
    })[];
  };
  onDelete?: (id: string) => void;
};

const GalleryCourseCard = ({ course, onDelete }: Props) => {
  return (
    <div className="border-border relative flex flex-col overflow-hidden rounded-2xl border bg-white shadow-sm transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900">
      {onDelete && (
        <Button
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            onDelete(course.id);
          }}
          className="absolute top-2 right-2 z-10 rounded-full bg-red-100 p-5 text-red-600 hover:cursor-pointer hover:bg-red-200 dark:bg-red-900 dark:text-red-400 dark:hover:bg-red-800"
          title="Delete Course"
        >
          <Trash2 size={16} />
        </Button>
      )}

      <Link
        href={`/course/${course.id}/0/0`}
        className="group relative block w-full"
      >
        <Image
          src={course.image || ""}
          className="aspect-video w-full object-cover transition-transform duration-200 group-hover:scale-[1.02]"
          width={600}
          height={340}
          alt="Course Image"
        />
        <span className="absolute right-2 bottom-2 left-2 rounded-md bg-black/60 px-3 py-1 text-sm font-medium text-white backdrop-blur dark:bg-black/80">
          {course.name}
        </span>
      </Link>

      <div className="flex flex-col gap-2 px-4 py-3">
        <h4 className="text-xs font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-400">
          Units
        </h4>
        <div className="flex flex-col gap-1">
          {course.units.map((unit, unitIndex) => (
            <Link
              key={unit.id}
              href={`/course/${course.id}/${unitIndex}/0`}
              className="text-sm font-medium text-blue-600 underline underline-offset-2 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            >
              {unit.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GalleryCourseCard;
