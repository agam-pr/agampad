"use client"

import { ChangeEvent, useState, useEffect } from "react";
import { Note } from "../lib/types";
import { Save } from "lucide-react";
import dynamic from "next/dynamic";

const MDEditor = dynamic(
  () => import("@uiw/react-md-editor").then((mod) => mod.default),
  { ssr: false }
);

import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";

interface NotePreviewProps {
  initTitle: string;
  initContent: string;
  saveChanges: (note: Note) => void;
}

const NotePreview = ({
  initTitle,
  initContent,
  saveChanges
}: NotePreviewProps) => {
  const [title, setTitle] = useState(initTitle);
  const [content, setContent] = useState(initContent || "");

  useEffect(() => {
    setTitle(initTitle);
    setContent(initContent || "");
  }, [initTitle, initContent]);

  const handleEditTitle = (evt: ChangeEvent<HTMLInputElement>) => {
    setTitle(evt.target.value);
  };

  const updateNote = () => {
    saveChanges({
      title,
      content
    });
  };

  return (
    <div className="w-full h-full flex flex-col gap-6 p-6 md:p-8 text-white min-h-0">
      
      <div className="flex flex-col gap-2 w-full">
        <input
          type="text"
          className="w-full outline-none bg-transparent text-4xl md:text-5xl font-extrabold tracking-tight text-white placeholder-white/20 border-b border-white/10 pb-4 focus:border-cyber-purple transition-all duration-300"
          value={title}
          onChange={handleEditTitle}
          placeholder="Untitled Note"
        />
      </div>

      <div 
        className="flex-1 w-full overflow-hidden rounded-2xl border border-cyber-border bg-cyber-dark/40 shadow-inner flex flex-col min-h-0 focus-within:border-cyber-purple/50 focus-within:shadow-[0_0_20px_rgba(124,58,237,0.1)] transition-all duration-300" 
        data-color-mode="dark"
      >
        <MDEditor
          value={content}
          onChange={(val) => setContent(val || "")}
          height="100%"
          preview="edit"
          hideToolbar={false}
          className="flex-1 border-0 bg-transparent text-white"
        />
      </div>

      <div className="flex justify-end items-center">
        <button
          onClick={updateNote}
          type="button"
          className="flex items-center gap-2 cursor-pointer bg-cyber-purple hover:bg-cyber-purple/80 text-white font-semibold rounded-xl px-6 py-3 border border-cyber-purple/30 shadow-[0_4px_12px_rgba(124,58,237,0.25)] hover:shadow-[0_4px_20px_rgba(124,58,237,0.45)] hover:scale-[1.02] active:scale-95 duration-200 transition-all"
        >
          <Save className="w-4 h-4" />
          <span>Save Changes</span>
        </button>
      </div>

    </div>
  );
};

export default NotePreview;