export interface Garage {
  id?: string;
  key?: string;
  owner_name: string;
  garage_name: string;
  phone_number: string;
  address: string;
  latitude: number;
  longitude: number;
  services?: string[];
  working_hours?: string;
  gst_number?: string;
  daily_visits?: number;
  total_visits?: number;
  created_at?: string;
}

export interface UserLocation {
  latitude: number;
  longitude: number;
}
