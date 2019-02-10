import {
  assign,
  isNumber
} from 'min-dash';

var DEFAULT_OPTIONS = {
  offset: {
    x: 150,
    y: 150
  },
  tolerance: 50,
  alignOnSave: true,
  scrollCanvas: true
};

var HIGHER_PRIORITY = 1250;


/**
 * Moves diagram contents to the origin + offset,
 * optionally upon diagram save.
 *
 * @param {Object} config
 * @param {didi.Injector} injector
 * @param {Canvas} canvas
 * @param {Modeling} modeling
 */
export default function AlignToOrigin(config, injector, canvas, modeling) {

  this._config = config = assign({}, DEFAULT_OPTIONS, config || {});

  if (isNumber(config.offset)) {
    config.offset = {
      x: config.offset,
      y: config.offset
    };
  }

  this._canvas = canvas;
  this._modeling = modeling;

  if (config.alignOnSave) {
    this._setupOnSave(injector);
  }
}

AlignToOrigin.$inject = [
  'config.alignToOrigin',
  'injector',
  'canvas',
  'modeling'
];


/**
 * Setup align on save functionality.
 *
 * @param {didi.Injector} injector
 */
AlignToOrigin.prototype._setupOnSave = function(injector) {

  // nested editors expose _parent to access the
  // save responsible entity
  var parent = injector.get('_parent', false);

  var localEvents = injector.get('eventBus');

  var parentEvents = parent && parent._eventBus;

  var self = this;

  function triggerAlignment() {
    self.align();
  }

  (parentEvents || localEvents).on('saveXML.start', HIGHER_PRIORITY, triggerAlignment);

  if (parentEvents) {

    // unregister for saveXML.start
    localEvents.on('diagram.destroy', function() {
      parentEvents.off('saveXML.start', triggerAlignment);
    });
  }

};


/**
 * Return elements to move in order to adjust the viewbox.
 *
 * @return {Array<djs.BaseElement>}
 */
AlignToOrigin.prototype.getElementClosure = function() {
  return this._canvas.getRootElement().children;
};


/**
 * Return the diagram viewbox to consider.
 *
 * @return {Object} viewbox
 */
AlignToOrigin.prototype.getViewbox = function() {
  return this._canvas.viewbox();
};


/**
 * Align the diagram content to the origin.
 *
 * @param {Object} options
 * @param {Boolean} [options.scrollCanvas]
 */
AlignToOrigin.prototype.align = function(options) {

  options = options || {};

  var config = this._config;

  var canvas = this._canvas,
      modeling = this._modeling;

  var scrollCanvas = 'scrollCanvas' in options ? options.scrollCanvas : config.scrollCanvas;

  var viewbox = this.getViewbox();

  var bounds = viewbox.inner,
      scale = viewbox.scale;

  var elementClosure = this.getElementClosure();

  var delta = this.computeAdjustment(bounds, config);

  if (delta.x === 0 && delta.y === 0) {
    return;
  }

  modeling.moveElements(
    elementClosure,
    delta
  );

  if (scrollCanvas) {
    canvas.scroll({
      dx: -delta.x * scale,
      dy: -delta.y * scale
    });
  }

};


/**
 * Compute adjustment given the specified diagram origin.
 *
 * @param {Point} origin
 *
 * @return {Point} adjustment
 */
AlignToOrigin.prototype.computeAdjustment = function(origin, config) {

  var offset = config.offset,
      tolerance = config.tolerance;

  var adjustment = {};

  [ 'x', 'y' ].forEach(function(axis) {

    var delta = -origin[axis] + offset[axis];

    adjustment[axis] = Math.abs(delta) < tolerance ? 0 : delta;
  });

  return adjustment;
};