import type { CadastralProperties } from "../types";

interface ParcelPopupProps {
  visible: boolean;
  position: { x: number; y: number } | null;
  properties: CadastralProperties | null;
  onClose: () => void;
}

const ParcelPopup = ({ visible, position, properties, onClose }: ParcelPopupProps) => {
  if (!visible || !position || !properties) return null;

  console.log("properties are,", properties)

  return (
    <div
      className="absolute bg-white rounded-lg shadow-lg p-4 min-w-64 max-w-96 z-50"
      style={{
        left: `${position.x + 10}px`,
        top: `${position.y + 10}px`,
      }}
    >
      <div className="flex justify-between items-center mb-3 border-b pb-2">
        <h3 className="font-bold text-lg">Parcel Information</h3>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 text-xl font-bold w-6 h-6 flex items-center justify-center"
          aria-label="Close"
        >
          ×
        </button>
      </div>

      <div className="space-y-2">
        {Object.entries(properties).map(([key, value]) => {
          if (key === 'geometry' || key === 'layer') return null;

          return (
            <div key={key} className="flex flex-col">
              <span className="text-sm font-semibold text-gray-600 capitalize">
                {key.replace(/_/g, ' ')}:
              </span>
              <span className="text-sm text-gray-900 ml-2">
                {value !== null && value !== undefined ? String(value) : 'N/A'}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ParcelPopup;
