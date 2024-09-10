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
  let algoChoiceRef = useRef<HTMLSelectElement | null>(null);

  const sortingAlgos : { [key: string]: () => Promise<void> } = {
    "": async () => {
      // no choice made
    },
    "bubble": async () => {
      await bubbleSort(blockSizes);
    }, 
    "insertion": async () => {
      await insertionSort(blockSizes);
    }
  }

  async function handleSort() {
    stopSortingRef.current = false; 

    /* disable button to prevent concurrent sorting operations */
    setDisableSortingBtn(true);

    const selectedAlgorithm : string = algoChoiceRef.current?.value || "";

    await sortingAlgos[selectedAlgorithm]();
    
    await delayExecution(1500);
    setDisableSortingBtn(false); 
    stopSortingRef.current = true;
  }

  

  async function bubbleSort(array : number[]): Promise<void> {
    for (let i = 0; i < array.length - 1; i++) {
      let isSorted : Boolean = true;

      for (let j = 0; j < array.length - i - 1; j++) {
        if (stopSortingRef.current) return;

        if (array[j + 1] < array[j]) {
          isSorted = false;

          const temp = array[j];
          array[j] = array[j + 1];
          array[j + 1] = temp;

          setBlockSizes([...array]);

          await delayExecution(50);
        }
      }

      if (isSorted) return; 
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
        <select id="algo-type" name="options" ref={ algoChoiceRef }>
          <option value="" disabled selected>Select an Algorithm</option> 
          <option value="bubble">Bubble Sort</option>
          <option value="insertion">Insertion Sort</option>
        </select>`
      </footer>
    </div>
  );
}
