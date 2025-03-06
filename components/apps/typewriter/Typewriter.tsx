"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { cn } from '@/lib/utils';
import { generateRandomText } from './words';


// Changed to have proper spacing between words but not letters

export default function Typing() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [errors, setErrors] = useState<boolean[]>([]);
    const [wpm, setWpm] = useState(0);
    const [accuracy, setAccuracy] = useState(100);
    const [startTime, setStartTime] = useState<number | null>(null);
    const [isCompleted, setIsCompleted] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const [sampleText, setSampleText] = useState(generateRandomText());
    // Reset function
    const resetExercise = useCallback(() => {
        setCurrentIndex(0);
        setErrors([]);
        setWpm(0);
        setAccuracy(100);
        setStartTime(null);
        setIsCompleted(false);
        setIsPaused(false);
        setSampleText(generateRandomText());

        // Focus the container
        if (containerRef.current) {
            containerRef.current.focus();
        }
    }, []);

    // Calculate metrics
    const calculateMetrics = useCallback(() => {
        if (!startTime) return;

        const timeElapsed = (Date.now() - startTime) / 1000 / 60; // in minutes
        const charactersTyped = currentIndex;
        const wordsTyped = charactersTyped / 5; // Standard: 5 characters = 1 word
        const calculatedWpm = Math.round(wordsTyped / timeElapsed);

        // Calculate accuracy
        const errorCount = errors.filter(Boolean).length;
        const calculatedAccuracy = currentIndex > 0
            ? Math.round(((currentIndex - errorCount) / currentIndex) * 100)
            : 100;

        setWpm(calculatedWpm || 0); // Prevent NaN
        setAccuracy(calculatedAccuracy);
    }, [currentIndex, errors, startTime]);

    // Handle completion
    useEffect(() => {
        if (currentIndex === sampleText.length && !isCompleted) {
            setIsCompleted(true);
            calculateMetrics();
        }
    }, [currentIndex, isCompleted, calculateMetrics, sampleText]);

    // Handle key presses
    const handleKeyPress = useCallback((e: KeyboardEvent) => {
        if (e.key === 'Escape') {
            if (isCompleted) {
                resetExercise();
            }
            return;
        }
        if (isCompleted || isPaused) return;

        // Start timer on first keypress
        if (startTime === null && e.key.length === 1) {
            setStartTime(Date.now());
        }

        // Ignore if modifier keys are pressed alone
        if ((e.ctrlKey || e.altKey || e.metaKey) && e.key.length !== 1) return;

        // Prevent default for all valid key presses
        if (e.key === 'Backspace' || e.key.length === 1) {
            e.preventDefault();
        }

        // Handle backspace
        if (e.key === 'Backspace') {
            if (currentIndex > 0) {
                setCurrentIndex(prev => prev - 1);
                setErrors(prev => {
                    const newErrors = [...prev];
                    newErrors.pop();
                    return newErrors;
                });
            }
            return;
        }

        // Handle escape key for pausing/resetting


        // Only handle printable characters and don't exceed text length
        if (e.key.length === 1 && currentIndex < sampleText.length) {
            const isCorrect = e.key === sampleText[currentIndex];

            setErrors(prev => [...prev, !isCorrect]);
            setCurrentIndex(prev => prev + 1);

            // Calculate metrics in real-time
            calculateMetrics();
        }
    }, [currentIndex, startTime, isCompleted, isPaused, calculateMetrics, sampleText]);

    // Add event listeners
    useEffect(() => {
        // Attach the event listener to the window
        window.addEventListener('keydown', handleKeyPress);

        // WPM update interval
        const intervalId = setInterval(() => {
            if (startTime && !isCompleted && !isPaused && currentIndex > 0) {
                calculateMetrics();
            }
        }, 1000);

        return () => {
            window.removeEventListener('keydown', handleKeyPress);
            clearInterval(intervalId);
        };
    }, [handleKeyPress, startTime, isCompleted, isPaused, currentIndex, calculateMetrics]);

    // Process text into words and characters
    const renderText = () => {
        // Process each character including spaces
        return (
            <div className="flex flex-wrap leading-relaxed tracking-wide">
                {sampleText.split('').map((char, index) => {
                    const isCurrent = index === currentIndex;
                    const isTyped = index < currentIndex;
                    const hasError = errors[index];
                    const isSpace = char === ' ';

                    return (
                        <span
                            key={index}
                            className={cn(
                                'font-mono text-2xl relative',
                                !isTyped && !isCurrent && 'text-white/30',
                                isTyped && !hasError && 'text-green-400/70',
                                isTyped && hasError && 'text-red-400/70',
                                isSpace && 'text-white/40', // Style for space dots
                            )}
                        >
                            {/* Render space as visible dot */}
                            {isSpace ? '·' : char}

                            {/* Current character indicators */}
                            {isCurrent && !isPaused && !isCompleted && (
                                <span className="absolute right-full top-0 h-full w-[2px] bg-yellow-400/90 animate-pulse" />
                            )}
                            {isCurrent && (
                                <span className="absolute inset-0 bg-white/20 rounded -z-10" />
                            )}
                        </span>
                    );
                })}
            </div>
        );
    };

    return (
        <div
            ref={containerRef}
            className="flex flex-col outline-none px-3"
            tabIndex={0} // Make the container focusable
            onFocus={() => !isCompleted && setIsPaused(false)}
            onBlur={() => !isCompleted && setIsPaused(true)}
        >
            {/* Metrics Display */}
            <div className="font-mono py-3 px-3">
                <span className="text-sm text-white/50">WPM: </span>
                <span className="text-sm  text-yellow-400/90">{wpm}</span>
                <span className="text-sm text-white/50">{" · "}</span>
                <span className="text-sm text-white/50">Accuracy: </span>
                <span className="text-sm font-mono text-green-400/70">{accuracy}%</span>

                {isPaused && !isCompleted && (
                    <><span className="text-sm text-red-400/50">{" · "}</span>
                        <span className="text-white/70 text-sm">
                            PAUSED
                        </span>
                    </>
                )}
                {isCompleted && (
                    <><span className="text-sm text-blue-400/50">{" · "}</span>
                        <span className="text-teal-400/70 text-sm">
                            DONE{" · "}PRESS ESC TO RESET
                        </span>
                    </>
                )}
                {!startTime && !isCompleted && !isPaused && (
                    <><span className="text-sm text-teal-400/50">{" · "}</span>
                        <span className="text-blue-400/70 text-sm">
                            READY
                        </span>
                    </>
                )}
            </div>

            <div
                className={cn(
                    "w-full p-6 rounded-lg bg-black/20 overflow-hidden",
                    isPaused && "opacity-50"
                )}
                onClick={() => containerRef.current?.focus()}
            >
                {renderText()}
            </div>

        </div>
    );
}