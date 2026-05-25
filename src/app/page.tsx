"use client"

import { useEffect, useState } from "react";
import NotePreview from "./components/NotePreview";
import PasscodeLock from "./components/PasscodeLock";
import { Note, Notes } from "./lib/types";
import {
  Shield,
  KeyRound,
  Lock,
  Plus,
  Trash2,
  Copy,
  LogOut,
  Info,
  Notebook
} from "lucide-react";
import { encryptData, decryptData, EncryptedData } from "./lib/crypto";

const NOTE_LABEL = "agampad-x-notes-data";
const PASSCODE_VERIFY_KEY = "agampad-passcode-verify";

export default function Home() {
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);
  const [hasPasscodeSet, setHasPasscodeSet] = useState<boolean>(false);
  const [passcode, setPasscode] = useState<string>("");

  const [notes, setNotes] = useState<Notes>([]);
  const [activeNote, setActiveNote] = useState<number>();

  const [setupPasscode, setSetupPasscode] = useState<string>("");
  const [confirmPasscode, setConfirmPasscode] = useState<string>("");
  const [setupError, setSetupError] = useState<string>("");

  const [isCreatingNote, setIsCreatingNote] = useState<boolean>(false);
  const [newNoteTitle, setNewNoteTitle] = useState<string>("");

  useEffect(() => {
    const checkVerifyKey = localStorage.getItem(PASSCODE_VERIFY_KEY);
    if (checkVerifyKey) {
      setHasPasscodeSet(true);
    }
  }, []);

  useEffect(() => {
    if (isUnlocked && passcode) {
      const persistNotes = async () => {
        try {
          const encrypted = await encryptData(JSON.stringify(notes), passcode);
          localStorage.setItem(NOTE_LABEL, JSON.stringify(encrypted));
        } catch (e) {
          console.error("Encryption failed while persisting notes", e);
        }
      };
      persistNotes();
    }
  }, [notes, isUnlocked, passcode]);

  const handleUnlock = async (enteredPasscode: string): Promise<boolean> => {
    try {
      const verifyStr = localStorage.getItem(PASSCODE_VERIFY_KEY);
      if (!verifyStr) return false;

      const verifyData: EncryptedData = JSON.parse(verifyStr);
      const decryptedVerify = await decryptData(verifyData, enteredPasscode);

      if (decryptedVerify === "verification_ok") {
        setPasscode(enteredPasscode);

        const encryptedNotesStr = localStorage.getItem(NOTE_LABEL);
        if (encryptedNotesStr) {
          const encryptedNotes: EncryptedData = JSON.parse(encryptedNotesStr);
          const decryptedNotesStr = await decryptData(encryptedNotes, enteredPasscode);
          setNotes(JSON.parse(decryptedNotesStr));
        } else {
          setNotes([]);
        }

        setIsUnlocked(true);
        return true;
      }
    } catch (e) {
      console.error("Authentication/Decryption failed", e);
    }
    return false;
  };

  const handleInitializeVault = async (e: React.FormEvent) => {
    e.preventDefault();
    setSetupError("");

    if (setupPasscode.length !== 4 || !/^\d{4}$/.test(setupPasscode)) {
      setSetupError("Passcode must be a 4-digit number.");
      return;
    }

    if (setupPasscode !== confirmPasscode) {
      setSetupError("Passcodes do not match.");
      return;
    }

    try {
      const verifyEncrypted = await encryptData("verification_ok", setupPasscode);
      localStorage.setItem(PASSCODE_VERIFY_KEY, JSON.stringify(verifyEncrypted));

      const notesEncrypted = await encryptData(JSON.stringify([]), setupPasscode);
      localStorage.setItem(NOTE_LABEL, JSON.stringify(notesEncrypted));

      setPasscode(setupPasscode);
      setNotes([]);
      setIsUnlocked(true);
      setHasPasscodeSet(true);
    } catch (e) {
      console.error("Failed to initialize encrypted vault", e);
      setSetupError("Failed to initialize security key.");
    }
  };

  const handleLockSession = () => {
    setPasscode("");
    setNotes([]);
    setActiveNote(undefined);
    setIsUnlocked(false);
  };

  const updateActiveNote = (note: Note) => {
    if (activeNote === undefined) return;
    if (activeNote >= notes.length) {
      setActiveNote(undefined);
      return;
    }

    const updatedNotes = [...notes];
    updatedNotes[activeNote] = note;
    setNotes(updatedNotes);
  };

  const handleCreateNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteTitle.trim()) {
      alert("Note title cannot be empty.");
      return;
    }

    if (notes.some((note) => note.title.toLowerCase() === newNoteTitle.trim().toLowerCase())) {
      alert("A note with this title already exists.");
      return;
    }

    const updatedNotes = [...notes];
    updatedNotes.push({ title: newNoteTitle.trim(), content: "" });
    setNotes(updatedNotes);
    setActiveNote(updatedNotes.length - 1);

    setNewNoteTitle("");
    setIsCreatingNote(false);
  };

  const deleteNoteAt = (idx: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Are you sure you want to delete "${notes[idx].title}"?`)) {
      const updatedNotes = notes.filter((_, index) => index !== idx);
      setNotes(updatedNotes);

      if (activeNote === idx) {
        setActiveNote(undefined);
      } else if (activeNote !== undefined && activeNote > idx) {
        setActiveNote(activeNote - 1);
      }
    }
  };

  const copyNoteAt = async (idx: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const { title, content } = notes[idx];
    try {
      await navigator.clipboard.writeText(`${title}\n\n${content}`);
      alert(`"${title}" content copied to clipboard! 📋`);
    } catch (err) {
      console.error("Failed to copy note", err);
    }
  };

  if (hasPasscodeSet && !isUnlocked) {
    return (
      <PasscodeLock
        onUnlock={handleUnlock}
        titleText="Decrypt Agam Pad"
        errorText="Passcode verification failed"
      />
    );
  }

  if (!hasPasscodeSet && !isUnlocked) {
    return (
      <div className="min-h-screen bg-cyber-bg relative flex flex-col justify-center items-center px-4 py-12 text-white overflow-y-auto">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(124,58,237,0.15),transparent_50%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(13,148,136,0.1),transparent_50%)] pointer-events-none" />

        <div className="w-full max-w-5xl flex flex-col lg:flex-row gap-12 items-center justify-between z-10">

          <div className="flex-1 space-y-8 max-w-lg">
            <div className="space-y-4">
              <span className="px-3 py-1 text-xs font-semibold tracking-wider text-cyber-teal bg-cyber-teal/10 rounded-full border border-cyber-teal/20 uppercase">
                Privacy First
              </span>
              <h1 className="text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-gray-200 to-cyber-purple-light bg-clip-text text-transparent">
                Agam Pad
              </h1>
              <p className="text-lg text-gray-400">
                A localized, zero-knowledge notebook styled to premium standards. Your thoughts stay locked on your hardware.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex gap-4 p-4 rounded-2xl glass-card">
                <div className="p-3 bg-cyber-purple/10 border border-cyber-purple/20 rounded-xl h-fit">
                  <Shield className="w-6 h-6 text-cyber-purple" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-white">Local-First Architecture</h3>
                  <p className="text-sm text-gray-400">All data is kept strictly inside browser LocalStorage. No server interactions, no database leaks, total ownership.</p>
                </div>
              </div>

              <div className="flex gap-4 p-4 rounded-2xl glass-card">
                <div className="p-3 bg-cyber-teal/10 border border-cyber-teal/20 rounded-xl h-fit">
                  <KeyRound className="w-6 h-6 text-cyber-teal" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-white">AES Encryption</h3>
                  <p className="text-sm text-gray-400">Notes are parsed and stored as client-encrypted blocks. Your custom 4-digit security PIN acts as the decryption key.</p>
                </div>
              </div>

              <div className="flex gap-4 p-4 rounded-2xl glass-card">
                <div className="p-3 bg-white/5 border border-white/10 rounded-xl h-fit">
                  <Notebook className="w-6 h-6 text-white/80" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-white">Unified Markdown Editor</h3>
                  <p className="text-sm text-gray-400">Robust formatting tools, live styles, syntax highlights, and markdown structures in a responsive layout.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full max-w-md p-8 rounded-3xl glass-premium border border-cyber-border shadow-2xl relative">
            <div className="absolute top-0 right-0 p-6 opacity-10">
              <Lock className="w-32 h-32 text-cyber-purple" />
            </div>

            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white">Initialize Your Vault</h2>
              <p className="text-sm text-gray-400 mt-1">Create a 4-digit PIN to establish client-side encryption keys.</p>
            </div>

            <form onSubmit={handleInitializeVault} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Create Passcode</label>
                <input
                  type="password"
                  maxLength={4}
                  pattern="\d*"
                  value={setupPasscode}
                  onChange={(e) => setSetupPasscode(e.target.value.replace(/\D/g, ""))}
                  placeholder="••••"
                  className="w-full text-center tracking-[1em] text-2xl font-bold py-3 rounded-xl bg-white/5 border border-cyber-border outline-none focus:border-cyber-purple focus:shadow-[0_0_15px_rgba(124,58,237,0.2)] text-white transition-all duration-300 placeholder:text-gray-600"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Confirm Passcode</label>
                <input
                  type="password"
                  maxLength={4}
                  pattern="\d*"
                  value={confirmPasscode}
                  onChange={(e) => setConfirmPasscode(e.target.value.replace(/\D/g, ""))}
                  placeholder="••••"
                  className="w-full text-center tracking-[1em] text-2xl font-bold py-3 rounded-xl bg-white/5 border border-cyber-border outline-none focus:border-cyber-purple focus:shadow-[0_0_15px_rgba(124,58,237,0.2)] text-white transition-all duration-300 placeholder:text-gray-600"
                  required
                />
              </div>

              {setupError && (
                <div className="flex items-center gap-2 p-3 text-xs font-semibold text-cyber-rose bg-cyber-rose/10 rounded-xl border border-cyber-rose/20">
                  <Info className="w-4 h-4 shrink-0" />
                  <span>{setupError}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-4 bg-cyber-purple hover:bg-cyber-purple/80 text-white font-bold rounded-xl shadow-lg shadow-cyber-purple/20 hover:shadow-cyber-purple/40 hover:scale-[1.01] active:scale-[0.99] duration-200 transition-all cursor-pointer border border-cyber-purple/30"
              >
                Create Security Vault
              </button>
            </form>
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen p-4 md:p-8 bg-cyber-bg relative flex overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyber-purple/10 rounded-full blur-[120px] pointer-events-none animate-pulse-slow" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyber-teal/5  rounded-full blur-[120px] pointer-events-none animate-pulse-slow" />

      <div className="glass-premium rounded-3xl w-full h-full overflow-hidden flex flex-col md:flex-row border border-cyber-border z-10">

        <div className="w-full md:w-80 h-1/3 md:h-full border-b md:border-b-0 md:border-r border-cyber-border flex flex-col bg-cyber-dark/30 backdrop-blur-md">

          <div className="p-6 border-b border-cyber-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-2xl tracking-tight bg-gradient-to-r from-white via-gray-100 to-cyber-purple-light bg-clip-text text-transparent flex items-center gap-2">
                Agam Pad 📝
              </span>
            </div>
            <button
              onClick={handleLockSession}
              title="Lock Vault"
              className="p-2 rounded-xl bg-white/5 border border-cyber-border hover:bg-cyber-rose/25 hover:border-cyber-rose/40 text-gray-400 hover:text-white transition-all duration-200 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          <div className="p-4">
            {!isCreatingNote ? (
              <button
                onClick={() => setIsCreatingNote(true)}
                className="w-full py-3 bg-white/5 border border-cyber-border hover:border-cyber-purple/40 hover:bg-cyber-purple/15 text-white hover:text-cyber-purple-light font-bold rounded-xl flex items-center justify-center gap-2 transition-all duration-200 hover:scale-[1.02] active:scale-95 cursor-pointer shadow-sm"
              >
                <Plus className="w-5 h-5" />
                <span>New Note</span>
              </button>
            ) : (
              <form onSubmit={handleCreateNote} className="flex flex-col gap-2">
                <input
                  type="text"
                  value={newNoteTitle}
                  onChange={(e) => setNewNoteTitle(e.target.value)}
                  placeholder="Note title..."
                  className="w-full px-3 py-2 rounded-lg bg-white/5 border border-cyber-border outline-none text-white text-sm focus:border-cyber-purple transition-all"
                  autoFocus
                  required
                />
                <div className="flex gap-2 justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-cyber-purple hover:bg-cyber-purple/80 text-white rounded-lg text-xs font-semibold cursor-pointer border border-cyber-purple/20"
                  >
                    Create
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsCreatingNote(false);
                      setNewNoteTitle("");
                    }}
                    className="px-4 py-2 bg-white/10 hover:bg-white/15 text-gray-300 rounded-lg text-xs cursor-pointer border border-cyber-border"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>

          <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-2">
            {notes.length === 0 ? (
              <div className="text-center py-8 text-sm text-gray-500 italic">No notes found. Create one!</div>
            ) : (
              notes.map(({ title }, idx) => {
                const isActive = activeNote === idx;
                return (
                  <div
                    key={title}
                    onClick={() => setActiveNote(idx)}
                    className={`group cursor-pointer rounded-xl p-3 border transition-all duration-300 flex items-center justify-between ${isActive
                        ? "bg-cyber-purple/10 border-cyber-purple/40 shadow-sm text-white"
                        : "bg-white/2 border-white/5 hover:bg-white/5 hover:border-white/10 text-gray-400 hover:text-white"
                      }`}
                  >
                    <span className="font-semibold text-sm truncate flex-1 pr-2">{title}</span>
                    <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <button
                        onClick={(e) => copyNoteAt(idx, e)}
                        title="Copy note text"
                        className="p-1 rounded bg-white/5 border border-white/5 hover:bg-cyber-purple/20 hover:border-cyber-purple/30 text-gray-400 hover:text-white transition-all duration-200"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => deleteNoteAt(idx, e)}
                        title="Delete note"
                        className="p-1 rounded bg-white/5 border border-white/5 hover:bg-cyber-rose/20 hover:border-cyber-rose/30 text-gray-400 hover:text-cyber-rose transition-all duration-200"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

        </div>

        <div className="flex-1 h-2/3 md:h-full bg-cyber-dark/10 relative overflow-hidden">
          {activeNote !== undefined && activeNote < notes.length ? (
            <NotePreview
              key={activeNote}
              initTitle={notes[activeNote].title}
              initContent={notes[activeNote].content}
              saveChanges={updateActiveNote}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-center p-6 text-gray-400">
              <div className="p-4 rounded-full bg-white/3 border border-white/5 mb-4 opacity-50">
                <Notebook className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-lg font-bold text-white/80">No Active Note</h3>
              <p className="text-sm text-gray-500 mt-1 max-w-xs">
                Select a note from the sidebar or click "New Note" to initiate a private secure writing session.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
