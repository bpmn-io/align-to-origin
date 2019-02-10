import {
  append as svgAppend,
  attr as svgAttr,
  create as svgCreate
} from 'tiny-svg';


/**
 * A diagram-js extension to visualize align-to-origin marker
 * and tolerance area.
 *
 * @param {Object} alignToOrigin
 * @param {Canvas} canvas
 */
export default function TestVisualization(alignToOrigin, canvas) {

  var config = alignToOrigin._config;

  var parent = canvas.getLayer('test-overlays', -1);

  var g = createEl('g', {
    'pointer-events': 'none'
  });

  var h = 2;

  svgAppend(parent, g);

  // the tolerance area
  svgAppend(g, createEl('path', {
    'class': cls('border'),
    'd': path([
      'M', config.offset.x - config.tolerance, config.offset.y - config.tolerance,
      'H', 6000,
      'v', config.tolerance * 2,
      'H', config.offset.x + config.tolerance,
      'V', 3000,
      'h', -config.tolerance * 2,
      'V', config.offset.y - config.tolerance,
      'Z'
    ]),
    'fill': 'cadetblue',
    'fill-opacity': '.05',
    'stroke': 'cadetblue',
    'stroke-opacity': '.3',
    'stroke-width': '1px',
    'stroke-linejoin': 'round',
    'stroke-linecap': 'round'
  }));


  // the norm / origin
  svgAppend(g, createEl('path', {
    'class': cls('border'),
    'd': path([
      'M', config.offset.x - h / 2, config.offset.y - h / 2,
      'H', 6000,
      'M', config.offset.x - h / 2, config.offset.y - h / 2,
      'V', 3000
    ]),
    'fill': 'none',
    'stroke': 'cadetblue',
    'stroke-width': h + 'px',
    'stroke-dasharray': '2, 5',
    'stroke-linejoin': 'round',
    'stroke-linecap': 'round'
  }));
}

TestVisualization.$inject = [
  'alignToOrigin',
  'canvas'
];


// helpers ///////////////////////////////////

function path(parts) {
  return parts.join(' ');
}

function cls(name) {
  return 'test-' + name;
}

function createEl(type, attrs) {

  var el = svgCreate(type);

  svgAttr(el, attrs);

  return el;
}