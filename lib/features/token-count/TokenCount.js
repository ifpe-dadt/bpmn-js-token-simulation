'use strict';

var domify = require('min-dom/lib/domify');

var elementHelper = require('../../util/ElementHelper'),
    is = elementHelper.is,
    isAncestor = elementHelper.isAncestor;

var events = require('../../util/EventHelper'),
    TOGGLE_MODE_EVENT = events.TOGGLE_MODE_EVENT,
    GENERATE_TOKEN_EVENT = events.GENERATE_TOKEN_EVENT,
    CONSUME_TOKEN_EVENT = events.CONSUME_TOKEN_EVENT,
    RESET_SIMULATION_EVENT = events.RESET_SIMULATION_EVENT,
    TERMINATE_EVENT = events.TERMINATE_EVENT;

var OFFSET_BOTTOM = 10,
    OFFSET_LEFT = -15;

var LOW_PRIORITY = 500;

function TokenCount(eventBus, overlays, elementRegistry, canvas, processInstances) {
  var self = this;

  this._overlays = overlays;
  this._elementRegistry = elementRegistry;
  this._canvas = canvas;
  this._processInstances = processInstances;

  this.overlayIds = {};

  eventBus.on(TOGGLE_MODE_EVENT, function(context) {
    var simulationModeActive = context.simulationModeActive;

    if (!simulationModeActive) {
      self.removeTokenCounts();
    }
  });

  eventBus.on(RESET_SIMULATION_EVENT, function() {
    self.removeTokenCounts();
  });

  eventBus.on(TERMINATE_EVENT, function(context) {
    var element = context.element,
        parent = element.parent;

    self.removeTokenCounts(parent);
  });

  eventBus.on([ GENERATE_TOKEN_EVENT, CONSUME_TOKEN_EVENT ], LOW_PRIORITY, function(context) {
    var element = context.element,
        parent = context.parent;

    self.removeTokenCounts(parent);
    self.addTokenCounts(parent);
  });
}

TokenCount.prototype.addTokenCounts = function(parent) {
  var self = this;

  if (!parent) {
    parent = this._canvas.getRootElement();
  }

  var viewedProcessInstance = parent.viewedProcessInstance;

  // choose default
  if (!viewedProcessInstance) {
    var processInstancesWithParent = this._processInstances.getProcessInstances(parent);

    // no instance
    if (!processInstancesWithParent.length) {
      return;
    }

    viewedProcessInstance = processInstancesWithParent[0].processInstanceId;
  }

  this._elementRegistry.forEach(function(element) {
    if (isAncestor(parent, element)) {
      self.addTokenCount(element, viewedProcessInstance);
    }
  });
};

TokenCount.prototype.addTokenCount = function(element, viewedProcessInstance) {
  var tokenCount = element.tokenCount && element.tokenCount[viewedProcessInstance];

  if (!tokenCount) {
    return;
  }

  var html = this.createTokenCount(tokenCount);

  var position = { bottom: OFFSET_BOTTOM, left: OFFSET_LEFT };
  
  var overlayId = this._overlays.add(element, 'token-count', {
    position: position,
    html: html,
    show: {
      minZoom: 0.5
    }
  });

  this.overlayIds[element.id] = overlayId;
};

TokenCount.prototype.createTokenCount = function(tokenCount) {
  return domify('<div class="token-count waiting">' + tokenCount + '</div>');
};

TokenCount.prototype.removeTokenCounts = function(parent) {
  var self = this;

  if (!parent) {
    parent = this._canvas.getRootElement();
  }

  this._elementRegistry.forEach(function(element) {
    if (isAncestor(parent, element)) {
      self.removeTokenCount(element);
    }
  });
};

TokenCount.prototype.removeTokenCount = function(element) {
  var overlayId = this.overlayIds[element.id];
  
  if (!overlayId) {
    return;
  }

  this._overlays.remove(overlayId);

  delete this.overlayIds[element.id];
};

TokenCount.$inject = [ 'eventBus', 'overlays', 'elementRegistry', 'canvas', 'processInstances' ];

module.exports = TokenCount;