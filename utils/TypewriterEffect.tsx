import React, { useState, useEffect } from 'react';

interface TypewriterEffectProps {
  texts: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  delayBetweenTexts?: number;
}

const TypewriterEffect: React.FC<TypewriterEffectProps> = ({
  texts,
  typingSpeed = 80,
  deletingSpeed = 50,
  delayBetweenTexts = 1500,
}) => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    let timeout: number;

    if (isPaused) {
      timeout = window.setTimeout(() => {
        setIsPaused(false);
        setIsDeleting(true);
      }, delayBetweenTexts);
      return () => clearTimeout(timeout);
    }

    if (isDeleting) {
      if (currentText === '') {
        setIsDeleting(false);
        setCurrentTextIndex((prevIndex) => (prevIndex + 1) % texts.length);
      } else {
        timeout = window.setTimeout(() => {
          setCurrentText((prevText) => prevText.slice(0, -1));
        }, deletingSpeed);
      }
    } else {
      const fullText = texts[currentTextIndex];
      if (currentText === fullText) {
        setIsPaused(true);
      } else {
        timeout = window.setTimeout(() => {
          setCurrentText((prevText) => fullText.slice(0, prevText.length + 1));
        }, typingSpeed);
      }
    }

    return () => clearTimeout(timeout);
  }, [
    currentText,
    currentTextIndex,
    isDeleting,
    isPaused,
    texts,
    typingSpeed,
    deletingSpeed,
    delayBetweenTexts,
  ]);

  return (
    <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 h-full flex items-center">
      <span>{currentText}</span>
      <span className="animate-blink ml-1">|</span>
    </h2>
  );
};

export default TypewriterEffect;