"use client"

import { useState } from "react";

type Note = {
  title: string;
  content: string;
}

type Notes = Array<Note>;

export default function Home() {
  const [notes, setNotes] = useState<Notes>([{ title: "Test 1", content: "Content 1" }, { title: "Test 2", content: "Content 2" }]);
  const [activeNote, setActiveNote] = useState<number>();
  return (
    <div className="h-screen w-screen p-10 bg-teal-800">
      <div className="bg-teal-950 rounded-2xl w-full h-full overflow-hidden flex flex-row">
        <div className="w-1/4 h-full bg-white bg-opacity-25 flex flex-col gap-5 px-2 py-5 justify-start items-center">
          <div className="font-semibold text-slate-200 text-2xl">
            Agam Pad
          </div>
          {
            notes.map(({ title }, idx) => (
              <div
                key={title}
                onClick={() => setActiveNote(idx)}
                className="cursor-pointer"
              >{title}</div>
            ))
          }
        </div>
        <div className="w-3/4 h-full">
          {
            activeNote !== undefined && (
              <>
                <div>{notes[activeNote].title}</div>
                <div>{notes[activeNote].content}</div>
              </>
            )
          }
        </div>
      </div>
    </div>
  );
}
