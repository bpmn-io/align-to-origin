import {
  assign,
  isNumber
} from 'min-dash';

var DEFAULT_OPTIONS = {
  offset: {
    x: 150,
    y: 75
  },
  tolerance: 50,
  alignOnSave: true
};

var HIGHER_PRIORITY = 1250;


/**
 * Moves diagram contents to the origin + offset,
 * optionally upon diagram save.
 *
 * @param {Object} config
 * @param {didi.Injector} injector
 * @param {EventBus} eventBus
 * @param {CommandStack} commandStack
 * @param {Canvas} canvas
 * @param {Modeling} modeling
 */
export default function AlignToOrigin(config, injector, eventBus, commandStack, canvas, modeling) {

  /**
   * Return actual config with defaults applied.
   */
  function applyDefaults(config) {

    var c = assign({}, DEFAULT_OPTIONS, config || {});

    if (isNumber(c.offset)) {
      c.offset = {
        x: c.offset,
        y: c.offset
      };
    }

    return c;
  }

  config = applyDefaults(config);

  /**
   * Compute adjustment given the specified diagram origin.
   *
   * @param {Point} origin
   *
   * @return {Point} adjustment
   */
  function computeAdjustment(origin, config) {

    var offset = config.offset,
        tolerance = config.tolerance;

    var adjustment = {};

    [ 'x', 'y' ].forEach(function(axis) {

      var delta = -origin[axis] + offset[axis];

      var gridSnapping = injector.get('gridSnapping', false);

      if (gridSnapping) {
        delta = quantize(delta, gridSnapping.getGridSpacing());
      }

      adjustment[axis] = Math.abs(delta) < tolerance ? 0 : delta;
    });

    return adjustment;
  }


  /**
   * Align the diagram content to the origin.
   *
   * @param {Object} options
   */
  function align() {

    var bounds = canvas.viewbox().inner;

    var elements = canvas.getRootElement().children;

    if (!elements.length) {
      return;
    }

    var delta = computeAdjustment(bounds, config);

    if (delta.x === 0 && delta.y === 0) {
      return;
    }

    commandStack.execute('elements.alignToOrigin', {
      elements: elements,
      delta: delta
    });
  }


  /**
   * Setup align on save functionality
   */
  function bindOnSave() {

    // nested editors expose _parent to access the
    // save responsible entity
    var parent = injector.get('_parent', false);

    var localEvents = eventBus;

    var parentEvents = parent && parent._eventBus;

    (parentEvents || localEvents).on('saveXML.start', HIGHER_PRIORITY, align);

    if (parentEvents) {

      // unregister for saveXML.start
      localEvents.on('diagram.destroy', function() {
        parentEvents.off('saveXML.start', align);
      });
    }
  }


  /**
   * Create a function that compensates the element movement
   * by moving applying the delta in the given direction.
   */
  function movementCompensator(direction) {

    /**
     * Handler to executed
     */
    return function(context) {

      // adjust canvas after the commandstack got changed
      eventBus.once('commandStack.changed', function() {

        var delta = context.delta;
        var scale = canvas.viewbox().scale;

        canvas.scroll({
          dx: direction * delta.x * scale,
          dy: direction * delta.y * scale
        });
      });
    };
  }

  // command registration

  /**
   * A command handler that compensates the element movement
   * by applying the inverse move operation on the canvas.
   */
  commandStack.register('elements.alignToOrigin', {

    preExecute: function(context) {
      var delta = context.delta,
          elements = context.elements;

      modeling.moveElements(elements, delta);
    },

    execute: movementCompensator(-1),
    revert: movementCompensator(1)
  });

  // setup

  if (config.alignOnSave) {
    bindOnSave();
  }

  // API

  this.align = align;
  this.computeAdjustment = computeAdjustment;

  // internal debugging purposes
  this._config = config;
}

AlignToOrigin.$inject = [
  'config.alignToOrigin',
  'injector',
  'eventBus',
  'commandStack',
  'canvas',
  'modeling'
];


// helpers /////////////////////////

function quantize(value, quantum, fn) {
  if (!fn) {
    fn = 'round';
  }

  return Math[ fn ](value / quantum) * quantum;
}