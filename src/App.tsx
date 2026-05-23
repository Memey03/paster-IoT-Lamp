/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { MqttProvider } from './mqttContext';
import { Dashboard } from './components/Dashboard';

export default function App() {
  return (
    <MqttProvider>
      <Dashboard />
    </MqttProvider>
  );
}
