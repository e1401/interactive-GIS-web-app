interface LayerToggleProps {
  visible: boolean;
  onToggle: (visible: boolean) => void;
}

const LayerToggle = ({ visible, onToggle }: LayerToggleProps) => {
  const handleToggle = () => {
    onToggle(!visible);
  };

  return (
    <button
      onClick={handleToggle}
      className="absolute top-4 right-4 z-10 bg-white px-4 py-2 rounded-lg shadow-md hover:bg-gray-100 transition-colors"
    >
      <span className="text-sm font-medium">
        {visible ? 'Hide' : 'Show'} Land Cover
      </span>
    </button>
  );
};

export default LayerToggle;
