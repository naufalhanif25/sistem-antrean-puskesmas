"use client";

import { useState } from "react";

interface PopupProps {
    title: string,
    description: string,
    noButtonTitle?: string,
    yesButtonTitle?: string,
    noButtonCallback?: React.MouseEventHandler<HTMLButtonElement>,
    yesButtonCallback?: React.MouseEventHandler<HTMLButtonElement>,
    show?: boolean,
    isDark?: boolean;
}

export default function Popup({
    title,
    description,
    noButtonTitle = "Tidak",
    yesButtonTitle = "Iya",
    noButtonCallback,
    yesButtonCallback,
    show = false,
    isDark = false
}: PopupProps) {
    const [isNoPressed, setIsNoPressed] = useState<boolean>(false);
    const [isYesPressed, setIsYesPressed] = useState<boolean>(false);
    
    if (!show) return;

    return (
        <div className="fixed w-screen h-screen flex items-center justify-center p-16 bg-black/50 z-999">
            <div className="bg-white rounded-xl min-w-120 max-w-140 gap-7 w-fit h-fit p-8 flex flex-col items-center justify-center">
                <div className="w-full h-fit flex flex-col items-center justify-center gap-5">
                    <h1
                        className="text-xl font-bold"
                        style={{
                            color: isDark ? "#FFFFFF" : "#111827",
                        }}
                    >
                        {title}
                    </h1>
                    <p
                        className="text-sm"
                        style={{
                            color: isDark ? "#FFFFFF" : "#111827",
                        }}
                    >
                        {description}
                    </p>
                </div>
                <div className="w-full h-fit flex gap-4 items-center justify-center">
                    <button
                        type="button"
                        onMouseDown={() =>
                            setIsNoPressed(true)
                        }
                        onMouseUp={() =>
                            setIsNoPressed(false)
                        }
                        onMouseLeave={() =>
                            setIsNoPressed(false)
                        }
                        onClick={noButtonCallback}
                        className="py-2 px-4 w-fit min-w-30 text-sm rounded-lg font-medium transition-all duration-150"
                        style={{
                            backgroundColor: isNoPressed
                                ? isDark
                                    ? "#1A1A1A"
                                    : "#F3F4F6"
                                : "transparent",
                            border: isDark
                                ? "1px solid #2A2A2A"
                                : "1px solid #D1D5DB",
                            color: isDark
                                ? "#9CA3AF"
                                : "#6B7280",
                        }}
                    >
                        {noButtonTitle}
                    </button>
                    <button
                        type="submit"
                        onClick={yesButtonCallback}
                        onMouseDown={() =>
                            setIsYesPressed(true)
                        }
                        onMouseUp={() =>
                            setIsYesPressed(false)
                        }
                        onMouseLeave={() =>
                            setIsYesPressed(false)
                        }
                        className="py-2 px-4 w-fit min-w-30 text-sm rounded-lg font-medium transition-all duration-150"
                        style={{
                            backgroundColor: isYesPressed
                                  ? isDark
                                      ? "#262A2E"
                                      : "#B91C1C"
                                  : isDark
                                    ? "#313337"
                                    : "#DC2626",
                            border: isDark
                                ? "1px solid #1F1F1F"
                                : "1px solid #DC2626",
                            color: isDark
                                ? "#6B7280"
                                : "#FFFFFF"
                        }}
                    >
                        {yesButtonTitle}
                    </button>
                </div>
            </div>
        </div>
    );
}