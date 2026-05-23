import React, { createContext, useContext, useEffect, useState, useRef, ReactNode } from 'react';
import mqtt, { MqttClient } from 'mqtt';
import { ActivityLog, RelayState, SensorData, SystemStatus, VariationState } from './types';

interface MqttContextType {
  relayState: RelayState;
  sensorData: SensorData;
  systemStatus: SystemStatus;
  variationState: VariationState;
  activityLogs: ActivityLog[];
  toggleRelay: (relay: keyof RelayState, state: boolean) => void;
  setVariation: (variation: VariationState) => void;
  toggleAllRelays: (state: boolean) => void;
}

const MqttContext = createContext<MqttContextType | undefined>(undefined);

export function MqttProvider({ children }: { children: ReactNode }) {
  const [relayState, setRelayState] = useState<RelayState>({
    lampu1: false,
    lampu2: false,
    lampu3: false,
    lampu4: false,
  });

  const [sensorData, setSensorData] = useState<SensorData>({
    suhu: null,
    kelembaban: null,
  });

  const [systemStatus, setSystemStatus] = useState<SystemStatus>({
    mqttConnected: false,
    esp32Online: false,
  });

  const [variationState, setVariationState] = useState<VariationState>('STOP');
  
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  
  const clientRef = useRef<MqttClient | null>(null);
  
  // Track commands initiated by WEB to determine source of status change
  const pendingCommands = useRef<Record<string, number>>({});

  const addLog = (message: string, source: ActivityLog['source'] = 'SYSTEM') => {
    setActivityLogs((prev) => {
      const newLog: ActivityLog = {
        id: Math.random().toString(36).substring(2, 9),
        timestamp: new Date(),
        message,
        source,
      };
      return [newLog, ...prev].slice(0, 50); // Keep last 50
    });
  };

  useEffect(() => {
    const brokerUrl = import.meta.env.VITE_MQTT_BROKER || 'wss://broker.hivemq.com:8884/mqtt';
    
    // Connect to MQTT broker
    const client = mqtt.connect(brokerUrl);
    clientRef.current = client;

    client.on('connect', () => {
      setSystemStatus((prev) => ({ ...prev, mqttConnected: true }));
      addLog('Connected to MQTT Broker', 'SYSTEM');
      
      // Subscribe to all smarthome topics
      client.subscribe('smarthome/#');
    });

    client.on('disconnect', () => {
      setSystemStatus((prev) => ({ ...prev, mqttConnected: false }));
      addLog('Disconnected from MQTT Broker', 'SYSTEM');
    });

    client.on('error', (err) => {
      console.error('MQTT Error: ', err);
      client.end();
    });

    client.on('message', (topic, message) => {
      const payload = message.toString();

      // IMPORTANT: Fix status topic matching
      // Web listens to `/status` for real truth from ESP32
      switch (topic) {
        case 'smarthome/lampu1/status':
        case 'smarthome/lampu2/status':
        case 'smarthome/lampu3/status':
        case 'smarthome/lampu4/status': {
          const lampuMatch = topic.match(/smarthome\/(lampu[1-4])\/status/);
          if (lampuMatch && lampuMatch[1]) {
            const relay = lampuMatch[1] as keyof RelayState;
            const newState = payload === 'ON';
            
            setRelayState((prev) => {
              // Only log if state actually changed
              if (prev[relay] !== newState) {
                // Determine source
                const pendingCommandTime = pendingCommands.current[relay];
                let source: ActivityLog['source'] = 'TELEGRAM'; // Default to Telegram/ESP32
                
                if (pendingCommandTime && (Date.now() - pendingCommandTime < 3000)) {
                   source = 'WEB';
                   // Clear it
                   delete pendingCommands.current[relay];
                }
                
                addLog(`${relay.toUpperCase()} is now ${payload}`, source);
              }
              return { ...prev, [relay]: newState };
            });
          }
          break;
        }

        case 'smarthome/suhu':
          setSensorData((prev) => ({ ...prev, suhu: parseFloat(payload) }));
          break;

        case 'smarthome/kelembaban':
          setSensorData((prev) => ({ ...prev, kelembaban: parseFloat(payload) }));
          break;

        case 'smarthome/status':
          setSystemStatus((prev) => {
            const isOnline = payload === 'ONLINE';
            if (prev.esp32Online !== isOnline) {
              addLog(`ESP32 is ${payload}`, 'SYSTEM');
            }
            return { ...prev, esp32Online: isOnline };
          });
          break;

        case 'smarthome/variasi/status':
          setVariationState(payload as VariationState);
          // Determine source
          {
            const pendingVarTime = pendingCommands.current['variasi'];
            let source: ActivityLog['source'] = 'TELEGRAM';
            if (pendingVarTime && (Date.now() - pendingVarTime < 3000)) {
               source = 'WEB';
               delete pendingCommands.current['variasi'];
            }
            
            // Avoid logging repeated STOP messages if variations are not actively changing too much, 
            // but for simplicity we log every state change.
            addLog(`Variation active: ${payload}`, source);
          }
          break;
      }
    });

    return () => {
      client.end();
    };
  }, []);

  const toggleRelay = (relay: keyof RelayState, state: boolean) => {
    if (clientRef.current?.connected) {
      const stateStr = state ? 'ON' : 'OFF';
      // Mark that WEB initiated this command
      pendingCommands.current[relay] = Date.now();
      
      // Publish command
      clientRef.current.publish(`smarthome/${relay}`, stateStr);
    }
  };

  const setVariation = (variation: VariationState) => {
    if (clientRef.current?.connected) {
      pendingCommands.current['variasi'] = Date.now();
      clientRef.current.publish('smarthome/variasi', variation);
    }
  };

  const toggleAllRelays = (state: boolean) => {
    if (clientRef.current?.connected) {
      const stateStr = state ? 'ON' : 'OFF';
      // Mark all as pending
      const now = Date.now();
      pendingCommands.current['lampu1'] = now;
      pendingCommands.current['lampu2'] = now;
      pendingCommands.current['lampu3'] = now;
      pendingCommands.current['lampu4'] = now;
      
      clientRef.current.publish('smarthome/lampu1', stateStr);
      clientRef.current.publish('smarthome/lampu2', stateStr);
      clientRef.current.publish('smarthome/lampu3', stateStr);
      clientRef.current.publish('smarthome/lampu4', stateStr);
    }
  };

  return (
    <MqttContext.Provider
      value={{
        relayState,
        sensorData,
        systemStatus,
        variationState,
        activityLogs,
        toggleRelay,
        setVariation,
        toggleAllRelays,
      }}
    >
      {children}
    </MqttContext.Provider>
  );
}

export function useMqtt() {
  const context = useContext(MqttContext);
  if (context === undefined) {
    throw new Error('useMqtt must be used within a MqttProvider');
  }
  return context;
}
