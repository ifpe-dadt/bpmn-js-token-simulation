'use strict';

var events = require('../../util/EventHelper'),
    PROCESS_INSTANCE_CREATED_EVENT = events.PROCESS_INSTANCE_CREATED_EVENT,
    PROCESS_INSTANCE_FINISHED_EVENT = events.PROCESS_INSTANCE_FINISHED_EVENT;

function ProcessInstanceSettings(animation, eventBus, processInstances) {
  this._animation = animation;
  this._eventBus = eventBus;
  this._processInstances = processInstances;

  this._eventBus.on(PROCESS_INSTANCE_CREATED_EVENT, function(context) {
    // TODO
  });

  this._eventBus.on(PROCESS_INSTANCE_FINISHED_EVENT, function(context) {
    // TODO
  });
}

/**
 * View a process instance while hiding all other process instances.
 */
ProcessInstanceSettings.prototype.viewProcessInstance = function(processInstanceId) {
  console.log('ProcessInstanceSettings#viewProcessInstance');
};

/**
 * View next process instance if exists.
 */
ProcessInstanceSettings.prototype.viewNext = function(parent) {
  console.log('ProcessInstanceSettings#viewNext');
};

ProcessInstanceSettings.$inject = [ 'animation', 'eventBus', 'processInstances' ];

module.exports = ProcessInstanceSettings;