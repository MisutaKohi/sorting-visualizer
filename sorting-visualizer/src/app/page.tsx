"use client";

import Button from "./utilities/button";
import Block from "./utilities/block";
import React, { useState, useEffect } from 'react';

export default function Home() {
  const [blockSizes, setBlockSizes] = useState<number[]>(() => {
    const sizes: number[] = [];
    for (let i = 1; i < 60; i++) {
      sizes.push(i);
    }
    return sizes;
  });

  function shuffleArray(array: number[]): number[] {
    const shuffledArray = [...array]; // Create a copy of the array
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
  }

  function handleShuffle() {
    setBlockSizes(prevBlockSizes => shuffleArray(prevBlockSizes));
  }

  // useEffect(() => {
  //   console.log('Updated blockSizes:', blockSizes);
  // }, [blockSizes]);

  function handleSort() {
    // TO DO
  }

  return (
    <div>
      <main>
        <h1 id="site-title">Sorting Visualizer</h1>
        <div className="foreground-box">
          <div className="sorting-box">
              { blockSizes.map((item, index) => (
                <li key={index}> <Block style={{ height: `${item * 6}px` }}/> </li>
              )) }
          </div>
        </div>
      </main>
      <footer>
        <Button text="Randomize" onClick={ handleShuffle }/>
        <Button text="Sort" onClick={ handleSort }/>
        <select id="algo-type" name="options">
          <option value="" disabled selected>Select an Algorithm</option> 
          <option value="option1">Bubble Sort</option>
          <option value="option2">Insertion Sort</option>
        </select>`
      </footer>
    </div>
  );
}
