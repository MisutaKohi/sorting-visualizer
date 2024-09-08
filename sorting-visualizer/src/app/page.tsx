import Button from "./utilities/button";

export default function Home() {
  return (
    <div>
      <main>
        <h1 id="site-title">Sorting Visualizer</h1>
        <div className="foreground-box">
          <div className="black-accent">

          </div>
        </div>
      </main>
      <footer>
        <Button text="Randomize" />
        <Button text="Sort" />
        <select id="algo-type" name="options">
          <option value="" disabled selected>Select an Algorithm</option> 
          <option value="option1">Bubble Sort</option>
          <option value="option2">Insertion Sort</option>
        </select>`
      </footer>
    </div>
  );
}
