interface ButtonProps {
  text: string; 
}

export default function Button({ text } : ButtonProps) {

  return (
    <button className="custom-btn">
      { text }
    </button>
  );
}