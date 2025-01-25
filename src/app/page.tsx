"use client"

import { useEffect, useState } from "react";
import NotePreview from "./components/NotePreview";
import { Note, Notes } from "./lib/types";
import Image from "next/image";

const NOTE_LABEL = "agampad-x-notes-data";

export default function Home() {
  const [notes, setNotes] = useState<Notes>([]);
  const [activeNote, setActiveNote] = useState<number>();

  useEffect(() => {
    const notesFromLocalStorage = localStorage.getItem(NOTE_LABEL);
    if (notesFromLocalStorage) {
      setNotes(JSON.parse(notesFromLocalStorage));
    }
  }, []);

  useEffect(() => {
    if (notes.length)
      localStorage.setItem(NOTE_LABEL, JSON.stringify(notes));
  }, [notes]);

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

  const addNewNote = () => {
    const newNoteTitle = prompt("Enter new note's title:");
    if (newNoteTitle) {
      const updatedNotes = [...notes];
      updatedNotes.push({ title: newNoteTitle, content: "" });
      setNotes(updatedNotes);
    } else {
      alert("Note title cannot be empty bhai ji! 🤬")
    }
  }

  const deleteNoteAt = (idx: number) => () => {
    const updatedNotes = notes.filter((_, index) => index !== idx);
    setNotes(updatedNotes);

    if (activeNote === idx) {
      setActiveNote(undefined);
    }
  }

  const copyNoteAt = (idx: number) => async () => {
    const { title, content } = notes[idx];
    await navigator.clipboard.writeText(`${title}\n\n${content}`);
    alert(`Note ${idx + 1} has been copied.`)
  }
  return (
    <div className="h-screen w-screen p-10 bg-teal-800">
      <div className="bg-teal-950 rounded-2xl w-full h-full overflow-hidden flex flex-col md:flex-row">
        <div className="w-full md:w-1/4 h-fit md:h-full bg-white bg-opacity-25 flex flex-col px-4 py-5 justify-start items-center">
          <div className="font-semibold text-3xl text-teal-950">
            Agam Pad 📝
          </div>
          <div className="bg-gray-800 border-2 mt-4 border-gray-400 py-2 px-3 hover:bg-gray-700 w-fit rounded-full cursor-pointer" onClick={addNewNote}>New Note ➕</div>
          <div className="mt-4 rounded-xl overflow-hidden w-full">
            <div className="flex flex-col w-full h-full">
              {
                notes.map(({ title }, idx) => (
                  <div
                    key={title}
                    onClick={() => setActiveNote(idx)}
                    className={`cursor-pointer border-white ${activeNote === idx ? "bg-teal-600 text-2xl" : "bg-teal-800"
                      } hover:bg-teal-500 w-full p-3 transition-all duration-300 flex flex-row justify-between`}
                  >
                    <span className="h-full flex items-center transition-all duration-300">{title}</span>
                    <div className="flex flex-row gap-2">
                      <span
                        className="bg-gray-200 border-2 border-gray-700 p-1 rounded-full text-sm hover:bg-gray-400 aspect-square h-full flex justify-center items-center"
                        onClick={copyNoteAt(idx)}
                      >
                        <Image
                          alt="copy-note"
                          src="/icons/copy.png"
                          width={20}
                          height={20}
                          className="h-4/5 w-4/5 object-cover"
                        />
                      </span>
                      <span
                        className="bg-red-200 border-2 border-red-700 p-1 rounded-full text-sm hover:bg-red-400 aspect-square h-full flex justify-center items-center"
                        onClick={deleteNoteAt(idx)}
                      >
                        ❌
                      </span>
                    </div>
                  </div>
                ))
              }
            </div>
          </div>
        </div>
        <div className="w-full md:w-3/4 h-full">
          {
            activeNote !== undefined && activeNote < notes.length && (
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
