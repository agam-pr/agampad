"use client"

import { useState } from "react";
import NotePreview from "./components/NotePreview";
import { Note, Notes } from "./lib/types";

export default function Home() {
  const [notes, setNotes] = useState<Notes>([{ title: "Test 1", content: "Content 1" }, { title: "Test 2", content: "Content 2" }]);
  const [activeNote, setActiveNote] = useState<number>();

  const updateActiveNote = (note: Note) => {
    if (activeNote === undefined) return;
    if (activeNote >= notes.length) {
      setActiveNote(undefined);
    };

    const { title, content } = note;
    const updatedNotes = [...notes];
    updatedNotes[activeNote] = { title, content };
    setNotes(updatedNotes);
  }
  return (
    <div className="h-screen w-screen p-10 bg-teal-800">
      <div className="bg-teal-950 rounded-2xl w-full h-full overflow-hidden flex flex-row">
        <div className="w-1/4 h-full bg-white bg-opacity-25 flex flex-col px-4 py-5 justify-start items-center">
          <div className="font-semibold text-3xl text-teal-950">
            Agam Pad 📝
          </div>
          <div className="mt-8 rounded-xl overflow-hidden w-full">
            <div className="flex flex-col w-full h-full">
              {
                notes.map(({ title }, idx) => (
                  <div
                    key={title}
                    onClick={() => setActiveNote(idx)}
                    className={`cursor-pointer border-white ${activeNote === idx ? "bg-teal-600 text-2xl" : "bg-teal-800"
                      } hover:bg-teal-500 w-full p-3 transition-all duration-500`}
                  >{title}</div>
                ))
              }
            </div>
          </div>
        </div>
        <div className="w-3/4 h-full">
          {
            activeNote !== undefined && (
              <NotePreview
                key={activeNote}
                initTitle={notes[activeNote].title}
                initContent={notes[activeNote].content}
                saveChanges={updateActiveNote}
              />
            )
          }
        </div>
      </div>
    </div>
  );
}
