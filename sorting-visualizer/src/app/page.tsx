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

  const sortingAlgos = {
    "bubble": () => {
      bubbleSort(blockSizes);
    }, 
    "insertion": () => {
      insertionSort(blockSizes);
    }
  }

  async function bubbleSort(array : number[]) {
    for (let i = 0; i < array.length - 1; i++) {
      for (let j = 0; j < array.length - i - 1; j++) {
        if (array[j + 1] < array[j]) {
          const temp = array[j];
          array[j] = array[j + 1];
          array[j + 1] = temp;

          setBlockSizes([...array]);

          await new Promise((resolve) => 
            setTimeout(resolve, 75)
          );
        }
      }
    }
    // console.log(blockSizes);
  }

  function delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  function insertionSort(array : number[]) {

  }

  function handleSort() {
    bubbleSort(blockSizes);
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
