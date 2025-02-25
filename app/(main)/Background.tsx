"use client"
import { useEffect, useState, useCallback, ReactNode } from 'react';
import Image from 'next/image';

export default function Background() {

  
  return (
    <div className="absolute top-0 left-0 h-screen w-screen bg-black overflow-hidden">
        <Image src="/background.jpg" alt="background" fill />
    </div>
  );
}