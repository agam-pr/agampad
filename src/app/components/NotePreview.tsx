"use client"

import { ChangeEvent, useRef, useState } from "react";
import { Note } from "../lib/types";

const NotePreview = ({
    initTitle,
    initContent,
    saveChanges
}: {
    initTitle: string,
    initContent: string,
    saveChanges: (note: Note) => void,
}) => {
    const [title, setTitle] = useState(initTitle);
    const [content, setContent] = useState(initContent);

    const saveButtonRef = useRef<HTMLDivElement>(null);

    const handleEditTitle = (evt: ChangeEvent<HTMLInputElement>) => {
        const inputValue = evt.target.value;
        setTitle(inputValue);
    }

    const handleEditContent = (evt: ChangeEvent<HTMLTextAreaElement>) => {
        const inputValue = evt.target.value;
        setContent(inputValue);
    }

    const updateNote = () => {
        saveChanges({
            title, content
        });
        alert("Your changes have been saved! 😆");
        saveButtonRef.current?.blur();
    }
    return (
        <div className="w-full h-full flex flex-col gap-5 p-5 items-end">
            <div className="flex flex-col gap-2 w-full">
                <input className="w-full outline-none peer bg-transparent text-5xl font-semibold" value={title} onChange={handleEditTitle} />
                <div className="h-[2px] bg-white w-0 transition-all duration-300 peer-focus:w-full" />
            </div>
            <textarea
                className="w-full h-full outline-none bg-white bg-opacity-10 p-3 rounded-md resize-none"
                value={content}
                onChange={handleEditContent}
            />
            <div
                ref={saveButtonRef}
                className="flex justify-center items-center w-fit cursor-pointer bg-teal-400 text-black hover:bg-teal-200 rounded-full border-4 border-teal-400 hover:border-white px-4 py-3 font-semibold"
                onClick={updateNote}
            >
                Save Changes
            </div>
        </div>
    )
}

export default NotePreview;