interface ButtonProps {
  text: string; 
  disabled?: boolean;
  className?: string;
  onClick: () => void;
}

export default function Button({ text, disabled, className, onClick } : ButtonProps) {

  return (
    <button className={ className } onClick={ onClick } disabled={ disabled }>
      { text }
    </button>
  );
}