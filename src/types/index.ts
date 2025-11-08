export interface Position {
  x: number;
  y: number;
}

export interface ParcelData {
  parcel_number: string;
  area: string;
}

export interface CadastralProperties extends ParcelData {
  layer: 'cadastral_parcels';
}
