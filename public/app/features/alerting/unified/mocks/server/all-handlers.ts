/**
 * Contains all handlers that are required for test rendering of components within Alerting
 */

import alertNotifierHandlers from 'app/features/alerting/unified/mocks/server/handlers/alertNotifiers';
import alertmanagerHandlers from 'app/features/alerting/unified/mocks/server/handlers/alertmanagers';
import datasourcesHandlers from 'app/features/alerting/unified/mocks/server/handlers/datasources';
import evalHandlers from 'app/features/alerting/unified/mocks/server/handlers/eval';
import folderHandlers from 'app/features/alerting/unified/mocks/server/handlers/folders';
import grafanaRulerHandlers from 'app/features/alerting/unified/mocks/server/handlers/grafanaRuler';
import mimirRulerHandlers from 'app/features/alerting/unified/mocks/server/handlers/mimirRuler';
import notificationsHandlers from 'app/features/alerting/unified/mocks/server/handlers/notifications';
import pluginsHandlers from 'app/features/alerting/unified/mocks/server/handlers/plugins';
import allPluginHandlers from 'app/features/alerting/unified/mocks/server/handlers/plugins/all-plugin-handlers';
import provisioningHandlers from 'app/features/alerting/unified/mocks/server/handlers/provisioning';
import searchHandlers from 'app/features/alerting/unified/mocks/server/handlers/search';
import silenceHandlers from 'app/features/alerting/unified/mocks/server/handlers/silences';
import timeIntervalK8sHandlers from 'app/features/alerting/unified/mocks/server/handlers/timeIntervals.k8s';

/**
 * Array of all mock handlers that are required across Alerting tests
 */
const allHandlers = [
  ...alertNotifierHandlers,
  ...grafanaRulerHandlers,
  ...mimirRulerHandlers,
  ...alertmanagerHandlers,
  ...datasourcesHandlers,
  ...evalHandlers,
  ...folderHandlers,
  ...pluginsHandlers,
  ...provisioningHandlers,
  ...silenceHandlers,
  ...searchHandlers,
  ...notificationsHandlers,

  ...allPluginHandlers,

  // Kubernetes-style handlers
  ...timeIntervalK8sHandlers,
];

export default allHandlers;
