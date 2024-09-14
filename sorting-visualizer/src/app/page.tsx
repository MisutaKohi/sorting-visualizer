"use client";

import Button from "./utilities/button";
import Block from "./utilities/block";
import React, { useState, useEffect, useRef } from 'react';

export default function Home() {
  
  /* Creates original array of blocks to sort */

  const [blockSizes, setBlockSizes] = useState<number[]>(() => {
    const sizes: number[] = [];
    for (let i = 1; i < 60; i++) {
      sizes.push(i);
    }
    return sizes;
  });

  /* Manages state of algorithm choice */

  const [algoChoice, setAlgoChoice] = useState<string>("");

  async function handleChange(event: React.ChangeEvent<HTMLSelectElement>) {
    setAlgoChoice(event.target.value);
  }

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

  let stopSortingRef = useRef(true); // used to interrupt sorting mid-process
  const [disableSortingBtn, setDisableSortingBtn] = useState(false);
  
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
      const startIdx = 0;
      const endIdx = blockSizes.length - 1;
      await quickSort(blockSizes, startIdx, endIdx);
    },
    "heap": async () => {
      await heapSort(blockSizes);
    }
  }

  async function handleSort() {
    stopSortingRef.current = false; 

    /* disable button to prevent concurrent sorting operations */
    setDisableSortingBtn(true);

    const selectedAlgorithm : string = algoChoice;

    await sortingAlgos[selectedAlgorithm]();
    
    await delayExecution(1500);
    setDisableSortingBtn(false); 
    stopSortingRef.current = true;
  }

  async function bubbleSort(array : number[]): Promise<void> {
    for (let i = 0; i < array.length - 1; i++) {
      let isSorted : Boolean = true;

      for (let j = 0; j < array.length - i - 1; j++) {
        if (stopSortingRef.current) return; // user has interrupted sorting

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
        if (stopSortingRef.current) return; // user has interrupted sorting

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
    if (stopSortingRef.current) return; // user has interrupted sorting
    if (startIdx === endIdx) return;

    const mid = Math.floor((startIdx + endIdx) / 2);

    await mergeSort(array, startIdx, mid);
    await mergeSort(array, mid + 1, endIdx);

    await merge(array, startIdx, mid, mid + 1, endIdx);

    await delayExecution(100);
    setBlockSizes([...array]);
  }

  async function quickSort(array : number[], startIdx : number, endIdx : number): Promise<void> {
    if (stopSortingRef.current) return; // user has interrupted sorting
    if (startIdx >= endIdx) return;

    const pivotElement = array[endIdx];
    
    let ptr1 = startIdx;
    let ptr2 = endIdx - 1;

    while (ptr1 <= ptr2) {
      if (array[ptr1] < pivotElement) {
        ptr1++;

      } else if (array[ptr2] > pivotElement) {
          ptr2--;

      } else {
          if (ptr1 <= ptr2) {
            await swap(array, ptr1, ptr2);

            await delayExecution(75);
            setBlockSizes([...array]);

            ptr1++;
            ptr2--;
          }
      }
    }

    const pivotIdx = ptr1;

    await swap(array, pivotIdx, endIdx);

    await delayExecution(75);
    setBlockSizes([...array]);

    await quickSort(array, startIdx, pivotIdx - 1);
    await quickSort(array, pivotIdx + 1, endIdx);
  }

  async function heapSort(array : number[]): Promise<void> {
    const topOfHeapIdx = 0;

    let unsortedStartIdx = 0; 
    let sortedIdx = array.length - 1; 

    while (sortedIdx > 0) {
      await heapify(array, unsortedStartIdx, sortedIdx);
      await swap(array, topOfHeapIdx, sortedIdx);

      await delayExecution(75);
      setBlockSizes([...array]);

      sortedIdx--;
    }
  }

  /* Helper functions */

  async function delayExecution(ms : number) {
    return await new Promise((resolve) => setTimeout(resolve, ms));
  }

  async function swap(array : any[], idx1 : number, idx2 : number) : Promise<void> {
    let temp = array[idx1];
    array[idx1] = array[idx2];
    array[idx2] = temp;
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

  async function heapify(array : number[], startIdx : number, endIdx : number) {
    let currIdx = Math.floor(endIdx / 2) - 1; // smallest non-leaf node

    while (currIdx >= startIdx) {
      const leftChild = 2 * currIdx + 1;
      const rightChild = 2 * currIdx + 2;

      if (leftChild <= endIdx && array[leftChild] > array[currIdx]) {
        await swap(array, currIdx, leftChild);

        await delayExecution(75);
        setBlockSizes([...array]);
      }

      if (rightChild <= endIdx && array[rightChild] > array[currIdx]) {
        await swap(array, currIdx, rightChild);

        await delayExecution(75);
        setBlockSizes([...array]);
      }

      currIdx--;
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
        <select id="algo-type" name="options" onChange={ handleChange }>
          <option value="" selected>Select an Algorithm</option> 
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
