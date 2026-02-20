import React from 'react';
import { motion, Variants } from 'framer-motion';

interface TextRevealProps {
  text: string;
  className?: string;
  delay?: number;
  width?: "fit-content" | "100%";
}

export const TextReveal: React.FC<TextRevealProps> = ({ 
  text, 
  className = "", 
  delay = 0,
  width = "fit-content" 
}) => {
  // Split text into words for a staggered effect that feels natural
  const words = text.split(" ");

  const container: Variants = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.05, delayChildren: delay * 0.1 }
    })
  };

  const child: Variants = {
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
        duration: 0.8
      }
    },
    hidden: {
      opacity: 0,
      y: 20,
      filter: 'blur(10px)',
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
        duration: 0.8
      }
    }
  };

  return (
    <motion.div
      style={{ overflow: "hidden", display: "flex", flexWrap: "wrap", width }}
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-10%" }} // Trigger a bit earlier
      className={className}
    >
      {words.map((word, index) => (
        <motion.span 
          variants={child} 
          style={{ marginRight: "0.25em", display: "inline-block" }} // Ensure inline-block for transform
          key={index}
        >
          {word}
        </motion.span>
      ))}
    </motion.div>
  );
};