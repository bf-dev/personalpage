import { motion } from 'framer-motion';
import React from 'react';

interface AnimatedItemProps {
    children: React.ReactNode;
    index: number;
}

export const AnimatedItem: React.FC<AnimatedItemProps> = ({ children, index }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                duration: 0.3,
                delay: index * 0.1,
                ease: "easeOut"
            }}
        >
            {children}
        </motion.div>
    );
}; 