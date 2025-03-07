'use client';
import { useState, useEffect } from 'react';
import { AppProps } from '../AppList';

export default function Calculator({ context }: AppProps) {
    const [display, setDisplay] = useState('0');
    const [firstOperand, setFirstOperand] = useState<number | null>(null);
    const [operator, setOperator] = useState<string | null>(null);
    const [waitingForSecondOperand, setWaitingForSecondOperand] = useState(false);
    const [mode, setMode] = useState('standard'); // standard or scientific

    // Process incoming context if provided
    useEffect(() => {
        if (context?.data?.calculatorMode) {
            setMode(context.data.calculatorMode);
        }
    }, [context]);

    const inputDigit = (digit: string) => {
        if (waitingForSecondOperand) {
            setDisplay(digit);
            setWaitingForSecondOperand(false);
        } else {
            setDisplay(display === '0' ? digit : display + digit);
        }
    };

    const inputDecimal = () => {
        if (waitingForSecondOperand) {
            setDisplay('0.');
            setWaitingForSecondOperand(false);
            return;
        }

        if (!display.includes('.')) {
            setDisplay(display + '.');
        }
    };

    const clearDisplay = () => {
        setDisplay('0');
        setFirstOperand(null);
        setOperator(null);
        setWaitingForSecondOperand(false);
    };

    const handleOperator = (nextOperator: string) => {
        const inputValue = parseFloat(display);

        if (firstOperand === null) {
            setFirstOperand(inputValue);
        } else if (operator) {
            const result = performCalculation();
            setDisplay(String(result));
            setFirstOperand(result);
        }

        setWaitingForSecondOperand(true);
        setOperator(nextOperator);
    };

    const performCalculation = () => {
        if (firstOperand === null || operator === null) return parseFloat(display);

        const secondOperand = parseFloat(display);
        let result = 0;

        switch (operator) {
            case '+':
                result = firstOperand + secondOperand;
                break;
            case '-':
                result = firstOperand - secondOperand;
                break;
            case '*':
                result = firstOperand * secondOperand;
                break;
            case '/':
                result = firstOperand / secondOperand;
                break;
            default:
                return secondOperand;
        }

        return result;
    };

    const calculateResult = () => {
        if (firstOperand === null || operator === null) return;

        const result = performCalculation();
        setDisplay(String(result));
        setFirstOperand(null);
        setOperator(null);
        setWaitingForSecondOperand(false);
    };

    // Scientific calculator functions
    const calculateSqrt = () => {
        const inputValue = parseFloat(display);
        const result = Math.sqrt(inputValue);
        setDisplay(String(result));
        setFirstOperand(null);
        setOperator(null);
        setWaitingForSecondOperand(false);
    };

    const calculateSquare = () => {
        const inputValue = parseFloat(display);
        const result = inputValue * inputValue;
        setDisplay(String(result));
        setFirstOperand(null);
        setOperator(null);
        setWaitingForSecondOperand(false);
    };

    return (
        <div className="flex flex-col h-full w-full p-4 bg-black/40">
            {context && (
                <div className="text-xs text-white/50 mb-2">
                    Mode set from {context.source}: {mode}
                </div>
            )}
            <div className="bg-gray-900 text-white p-3 text-right text-2xl mb-4 rounded">
                {display}
            </div>
            
            <div className="grid grid-cols-4 gap-2 flex-1">
                <button className="bg-gray-700 text-white p-3 rounded" onClick={clearDisplay}>
                    AC
                </button>
                <button className="bg-gray-700 text-white p-3 rounded" onClick={() => setDisplay(display.startsWith('-') ? display.substring(1) : '-' + display)}>
                    +/-
                </button>
                <button className="bg-gray-700 text-white p-3 rounded" onClick={() => handleOperator('%')}>
                    %
                </button>
                <button className="bg-orange-500 text-white p-3 rounded" onClick={() => handleOperator('/')}>
                    ÷
                </button>

                <button className="bg-gray-800 text-white p-3 rounded" onClick={() => inputDigit('7')}>
                    7
                </button>
                <button className="bg-gray-800 text-white p-3 rounded" onClick={() => inputDigit('8')}>
                    8
                </button>
                <button className="bg-gray-800 text-white p-3 rounded" onClick={() => inputDigit('9')}>
                    9
                </button>
                <button className="bg-orange-500 text-white p-3 rounded" onClick={() => handleOperator('*')}>
                    ×
                </button>

                <button className="bg-gray-800 text-white p-3 rounded" onClick={() => inputDigit('4')}>
                    4
                </button>
                <button className="bg-gray-800 text-white p-3 rounded" onClick={() => inputDigit('5')}>
                    5
                </button>
                <button className="bg-gray-800 text-white p-3 rounded" onClick={() => inputDigit('6')}>
                    6
                </button>
                <button className="bg-orange-500 text-white p-3 rounded" onClick={() => handleOperator('-')}>
                    -
                </button>

                <button className="bg-gray-800 text-white p-3 rounded" onClick={() => inputDigit('1')}>
                    1
                </button>
                <button className="bg-gray-800 text-white p-3 rounded" onClick={() => inputDigit('2')}>
                    2
                </button>
                <button className="bg-gray-800 text-white p-3 rounded" onClick={() => inputDigit('3')}>
                    3
                </button>
                <button className="bg-orange-500 text-white p-3 rounded" onClick={() => handleOperator('+')}>
                    +
                </button>

                <button className="bg-gray-800 text-white p-3 rounded col-span-2" onClick={() => inputDigit('0')}>
                    0
                </button>
                <button className="bg-gray-800 text-white p-3 rounded" onClick={inputDecimal}>
                    .
                </button>
                <button className="bg-orange-500 text-white p-3 rounded" onClick={calculateResult}>
                    =
                </button>
                
                {mode === 'scientific' && (
                    <>
                        <button className="bg-gray-700 text-white p-3 rounded" onClick={calculateSqrt}>
                            √
                        </button>
                        <button className="bg-gray-700 text-white p-3 rounded" onClick={calculateSquare}>
                            x²
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
