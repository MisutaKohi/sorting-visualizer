"use client";

import Button from "./utilities/button";
import Block from "./utilities/block";
import React, { useState, useEffect, useRef } from 'react';

export default function Home() {
  const [blockSizes, setBlockSizes] = useState<number[]>(() => {
    const sizes: number[] = [];
    for (let i = 1; i < 60; i++) {
      sizes.push(i);
    }
    return sizes;
  });

  /* Handles Randomization of Array */

  function shuffleArray(array: number[]): number[] {
    const shuffledArray = [...array]; // Create a copy of the array
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
  }

  function handleShuffle() {
    stopSortingRef.current = true; // cancels sorting execution
    setBlockSizes(prevBlockSizes => shuffleArray(prevBlockSizes));
  }

  /* Handles Sorting of Array */

  let stopSortingRef = useRef(true);
  const [disableSortingBtn, setDisableSortingBtn] = useState(false);

  function handleSort() {
    stopSortingRef.current = false; 

    /* disable button to prevent concurrent sorting operations */
    setDisableSortingBtn(true);

    bubbleSort(blockSizes).finally(() => {
      setDisableSortingBtn(false); // ensures function call despite errors
    });
  }

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
        if (stopSortingRef.current) return;

        if (array[j + 1] < array[j]) {
          const temp = array[j];
          array[j] = array[j + 1];
          array[j + 1] = temp;

          setBlockSizes([...array]);

          await delayExecution(75);
        }
      }
    }
  }

  function insertionSort(array : number[]) {

  }

  /* Helper functions */

  async function delayExecution(ms : number) {
    return await new Promise((resolve) => setTimeout(resolve, ms));
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
        <Button 
          className="custom-btn" 
          text="Randomize" 
          onClick={ handleShuffle }/>
        <Button 
          className={`custom-btn ${(stopSortingRef.current) ? "" : " disabled-btn"}`} 
          text="Sort" 
          disabled={ disableSortingBtn} 
          onClick={ handleSort }/>
        <select id="algo-type" name="options">
          <option value="" disabled selected>Select an Algorithm</option> 
          <option value="option1">Bubble Sort</option>
          <option value="option2">Insertion Sort</option>
        </select>`
      </footer>
    </div>
  );
}
