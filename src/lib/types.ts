export interface Farmer {
  id: number;
  name: string;
  komoditas: string;
  luas: number;
  status: string;
}

export interface FieldCase {
  id: number;
  date: string;
  reporter: string;
  farmer: string;
  crop: string;
  symptom: string;
  status: string;
}

export interface SensorData {
  n: number;
  p: number;
  k: number;
  humidity: number;
  temp: number;
  ph: string;
  fertility: string;
}
