import { useEffect, useState } from "react";
import type { Position, ParcelData } from "../types";

interface ParcelPopupProps {
  visible: boolean;
  position: Position | null;
  id: number | null;
  onClose: () => void;
}

const API_URL = "https://gis-dev.listlabs.net/api/dkp/parcels"

const ParcelPopup = ({ visible, position, id, onClose }: ParcelPopupProps) => {
  const [parcelData, setParcelData] = useState<ParcelData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchParcelData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(API_URL + `/${id}/`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.statusText}`);
        }
        const data = await response.json();
        setParcelData({
          parcel_number: data.properties.parcel_number,
          area: data.properties.area,
        });
      } catch (err) {
        console.error('Error fetching parcel data:', err);
        setParcelData(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchParcelData();
  }, [id]);

  if (!visible || !position || !id) return null;

  return (
    <div
      className="absolute bg-white rounded-lg shadow-lg p-4 w-64 z-50"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
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
        {isLoading ? (
          <div className="flex justify-center items-center py-4">
            <div className="w-8 h-8 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
          </div>
        ) : parcelData ? (
          <>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-gray-600">Parcel Number:</span>
              <span className="text-sm text-gray-900 ml-2">{parcelData.parcel_number}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-gray-600">Area:</span>
              <span className="text-sm text-gray-900 ml-2">{parcelData.area}</span>
            </div>
          </>
        ) : (
          <div className="text-sm text-red-600">Failed to load parcel data</div>
        )}
      </div>
    </div>
  );
};

export default ParcelPopup;
