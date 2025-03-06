'use client';
import { useState } from 'react';
import { Button } from "@/components/ui/button";

export default function Calculator() {
    const [display, setDisplay] = useState('0');
    const [equation, setEquation] = useState('');
    const [isNewNumber, setIsNewNumber] = useState(true);

    const handleNumber = (num: string) => {
        if (isNewNumber) {
            setDisplay(num);
            setIsNewNumber(false);
        } else {
            setDisplay(display + num);
        }
    };

    const handleOperator = (op: string) => {
        setEquation(display + ' ' + op + ' ');
        setIsNewNumber(true);
    };

    const handleEqual = () => {
        try {
            const result = eval(equation + display);
            setDisplay(String(result));
            setEquation('');
            setIsNewNumber(true);
        } catch (error) {
            setDisplay('Error');
            setEquation('');
            setIsNewNumber(true);
        }
    };

    const handleClear = () => {
        setDisplay('0');
        setEquation('');
        setIsNewNumber(true);
    };

    return (
        <div className="flex flex-col gap-2 p-4">
            <div className="bg-black/30 p-4 rounded-lg mb-4">
                <div className="text-gray-400 text-sm h-6">{equation}</div>
                <div className="text-white text-2xl font-bold text-right">{display}</div>
            </div>
            <div className="grid grid-cols-4 gap-2">
                <Button variant="secondary" onClick={handleClear} className="col-span-2">AC</Button>
                <Button variant="secondary" onClick={() => handleOperator('/')}>/</Button>
                <Button variant="secondary" onClick={() => handleOperator('*')}>×</Button>
                
                <Button onClick={() => handleNumber('7')}>7</Button>
                <Button onClick={() => handleNumber('8')}>8</Button>
                <Button onClick={() => handleNumber('9')}>9</Button>
                <Button variant="secondary" onClick={() => handleOperator('-')}>-</Button>
                
                <Button onClick={() => handleNumber('4')}>4</Button>
                <Button onClick={() => handleNumber('5')}>5</Button>
                <Button onClick={() => handleNumber('6')}>6</Button>
                <Button variant="secondary" onClick={() => handleOperator('+')}>+</Button>
                
                <Button onClick={() => handleNumber('1')}>1</Button>
                <Button onClick={() => handleNumber('2')}>2</Button>
                <Button onClick={() => handleNumber('3')}>3</Button>
                <Button variant="secondary" onClick={handleEqual}>=</Button>
                
                <Button onClick={() => handleNumber('0')} className="col-span-2">0</Button>
                <Button onClick={() => handleNumber('.')}>.</Button>
            </div>
        </div>
    );
}
