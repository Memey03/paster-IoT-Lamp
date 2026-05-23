export interface RelayState {
  lampu1: boolean;
  lampu2: boolean;
  lampu3: boolean;
  lampu4: boolean;
}

export type VariationState = 'VARIASI1' | 'VARIASI2' | 'STOP';

export interface SensorData {
  suhu: number | null;
  kelembaban: number | null;
}

export interface SystemStatus {
  mqttConnected: boolean;
  esp32Online: boolean;
}

export interface ActivityLog {
  id: string;
  timestamp: Date;
  message: string;
  source: 'WEB' | 'TELEGRAM' | 'SYSTEM';
}
