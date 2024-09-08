interface BlockProps {
  style?: React.CSSProperties;
}

export default function Block({ style }: BlockProps) {

  return (
    <div className="block" style={ style }></div>
  );
}