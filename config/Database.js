/**
 * Realm database bootstrap
 */

import { Config } from './config';
import Realm from 'realm';

const JobSchema = {
  name: 'Job',
  primaryKey: 'id',
  properties: {
    id:  'string', // UUID.
    name: 'string', // Job name to be matched with worker function.
    payload: 'string', // Job payload stored as JSON.
    data: 'string', // Store arbitrary data like "failed attempts" as JSON.
    priority: 'int', // -5 to 5 to indicate low to high priority.
    active: { type: 'bool', default: false}, // Whether or not job is currently being processed.
    timeout: 'int', // Job timeout in ms. 0 means no timeout.
    created: 'date', // Job creation timestamp.
    failed: 'date?' // Job failure timestamp (null until failure).
  }
};

const realmInstances = {};

export const getRealmInstance = async (options = {}) => {

  // Connect to realm if database singleton instance has not already been created.
  if (!realmInstances[options.realmPath]) {

    realmInstances[options.realmPath] = await Realm.open({
      path: options.realmPath || Config.REALM_PATH,
      schemaVersion: Config.REALM_SCHEMA_VERSION,
      schema: [JobSchema]

      // Look up shouldCompactOnLaunch to auto-vacuum https://github.com/realm/realm-js/pull/1209/files

    });

  }

  return realmInstances[options.realmPath];

}