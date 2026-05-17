"use client"

import React, { useState, useEffect } from "react";
import { Lock } from "lucide-react";

interface PasscodeLockProps {
  onUnlock: (passcode: string) => Promise<boolean>;
  titleText?: string;
  errorText?: string;
}

export default function PasscodeLock({
  onUnlock,
  titleText = "Enter Passcode",
  errorText = "Incorrect passcode"
}: PasscodeLockProps) {
  const [code, setCode] = useState<string>("");
  const [error, setError] = useState<boolean>(false);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);

  const handleKeyPress = (num: string) => {
    if (isVerifying) return;
    setError(false);
    if (code.length < 4) {
      setCode((prev) => prev + num);
    }
  };

  const handleBackspace = () => {
    if (isVerifying) return;
    setError(false);
    setCode((prev) => prev.slice(0, -1));
  };

  const handleClear = () => {
    if (isVerifying) return;
    setError(false);
    setCode("");
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isVerifying) return;
      if (e.key >= "0" && e.key <= "9") {
        handleKeyPress(e.key);
      } else if (e.key === "Backspace") {
        handleBackspace();
      } else if (e.key === "Escape") {
        handleClear();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [code, isVerifying]);

  useEffect(() => {
    if (code.length === 4) {
      const verify = async () => {
        setIsVerifying(true);
        const success = await onUnlock(code);
        if (!success) {
          setError(true);
          setCode("");
          setIsVerifying(false);
        }
      };
      const timer = setTimeout(verify, 250);
      return () => clearTimeout(timer);
    }
  }, [code, onUnlock]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-cyber-bg/95 backdrop-blur-xl transition-all duration-500">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(124,58,237,0.12),transparent_60%)] pointer-events-none" />
      
      <div className={`flex flex-col items-center justify-center max-w-sm w-full px-6 py-10 rounded-3xl glass-premium text-center border transition-all duration-300 ${
        error 
          ? 'animate-shake border-cyber-rose/40 shadow-lg shadow-cyber-rose/5' 
          : 'border-cyber-border shadow-2xl shadow-cyber-purple/5'
      }`}>
        
        <div className={`p-4 rounded-full bg-cyber-purple/10 border border-cyber-purple/20 mb-6 relative ${
          isVerifying ? 'animate-pulse' : ''
        }`}>
          <Lock className="w-8 h-8 text-cyber-purple" />
          <div className="absolute inset-0 rounded-full border border-cyber-purple/30 animate-ping opacity-25 pointer-events-none" />
        </div>

        <h2 className="text-2xl font-bold tracking-tight text-white mb-2">{titleText}</h2>
        <p className={`text-sm h-5 transition-opacity duration-200 ${
          error ? 'text-cyber-rose font-semibold opacity-100' : 'text-gray-400 opacity-80'
        }`}>
          {error ? errorText : "Provide your client-side security key"}
        </p>

        <div className="flex justify-center gap-6 my-8">
          {[0, 1, 2, 3].map((index) => {
            const isActive = index < code.length;
            return (
              <div
                key={index}
                className={`w-4 h-4 rounded-full border transition-all duration-300 ${
                  isActive
                    ? "bg-cyber-purple border-cyber-purple scale-110 shadow-[0_0_12px_#7c3aed]"
                    : error 
                      ? "border-cyber-rose bg-cyber-rose/10 scale-95 animate-pulse"
                      : "border-gray-600 bg-transparent"
                }`}
              />
            );
          })}
        </div>

        <div className="grid grid-cols-3 gap-4 w-full max-w-[280px] justify-items-center">
          {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((num) => (
            <button
              key={num}
              onClick={() => handleKeyPress(num)}
              type="button"
              className="w-16 h-16 flex items-center justify-center text-xl font-medium text-white rounded-full bg-white/5 border border-white/5 hover:bg-cyber-purple/20 hover:border-cyber-purple/30 hover:scale-105 active:scale-95 duration-200 transition-all shadow-sm"
            >
              {num}
            </button>
          ))}
          <button
            onClick={handleClear}
            type="button"
            className="w-16 h-16 flex items-center justify-center text-sm font-semibold text-gray-400 rounded-full hover:bg-white/5 hover:scale-105 active:scale-95 duration-200 transition-all"
          >
            Clear
          </button>
          <button
            onClick={() => handleKeyPress("0")}
            type="button"
            className="w-16 h-16 flex items-center justify-center text-xl font-medium text-white rounded-full bg-white/5 border border-white/5 hover:bg-cyber-purple/20 hover:border-cyber-purple/30 hover:scale-105 active:scale-95 duration-200 transition-all shadow-sm"
          >
            0
          </button>
          <button
            onClick={handleBackspace}
            type="button"
            className="w-16 h-16 flex items-center justify-center text-sm font-semibold text-gray-400 rounded-full hover:bg-white/5 hover:scale-105 active:scale-95 duration-200 transition-all"
          >
            Delete
          </button>
        </div>

      </div>
    </div>
  );
}
