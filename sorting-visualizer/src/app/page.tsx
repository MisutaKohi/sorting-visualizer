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

  function handleShuffle() {
    stopSortingRef.current = true; // cancels sorting execution
    setBlockSizes(prevBlockSizes => shuffleArray(prevBlockSizes));
  }

  function shuffleArray(array: number[]): number[] {
    const shuffledArray = [...array]; // Create a copy of the array
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
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
    },
    "merge": async () => {
      const startIdx = 0;
      const endIdx = blockSizes.length - 1;
      await mergeSort(blockSizes, startIdx, endIdx);
    }, 
    "quick": async () => {
      await quickSort(blockSizes);
    },
    "heap": async () => {
      await heapSort(blockSizes);
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

  async function insertionSort(array : number[]): Promise<void> {
    for (let i = 1; i < blockSizes.length; i++) {
      let j = i;
      
      while (j >= 1) {
        if (stopSortingRef.current) return;

        if (array[j] < array[j - 1]) {
          let temp = array[j];
          array[j] = array[j - 1];
          array[j - 1] = temp;

          setBlockSizes([...array]);

          await delayExecution(50);
        } else {
          break;
        }
        j--;
      }
    }
  }

  async function mergeSort(array : number[], startIdx : number, endIdx : number): Promise<void> {
    if (startIdx === endIdx) return;

    const mid = Math.floor((startIdx + endIdx) / 2);

    await mergeSort(array, startIdx, mid);
    await mergeSort(array, mid + 1, endIdx);

    console.log(array);

    await merge(array, startIdx, mid, mid + 1, endIdx);

    await delayExecution(100);
    setBlockSizes([...array]);
  }

  async function quickSort(array : number[]): Promise<void> {
    //TO DO
  }

  async function heapSort(array : number[]): Promise<void> {
    // TO DO
  }

  /* Helper functions */

  async function delayExecution(ms : number) {
    return await new Promise((resolve) => setTimeout(resolve, ms));
  }

  async function merge(array : number[], start1 : number, end1 : number, start2 : number, end2 : number) : Promise<void> {
    const arrCopy = [...array];

    let idx = start1;
    let num;

    while (start1 <= end1 && start2 <= end2) {
      if (arrCopy[start1] < arrCopy[start2]) {
        num = arrCopy[start1];
        start1++;
      } else {
        num = arrCopy[start2];
        start2++;
      }

      array[idx] = num;
      idx++;
    }

    while (start1 <= end1) {
      num = arrCopy[start1];
      start1++;

      array[idx] = num;
      idx++;
    }

    while (start2 <= end2) {
      num = arrCopy[start2];
      start2++;

      array[idx] = num;
      idx++;
    }
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
          <option value="merge">Merge Sort</option>
          <option value="quick">Quick Sort</option>
          <option value="heap">Heap Sort</option>
        </select>`
      </footer>
    </div>
  );
}
