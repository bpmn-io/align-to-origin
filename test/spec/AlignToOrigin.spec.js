/* global require */

import BpmnModeler from 'bpmn-js/lib/Modeler';

import { insertCSS } from 'bpmn-js/test/helper';

import TestVisualizationModule from './test-visualization';
import DiagramOriginModule from 'diagram-js-origin';

import AlignToOriginModule from '../..';
import AutoSaveModule from './auto-save';

insertCSS(
  'test.css',
  require('./test.css').default
);

insertCSS(
  'diagram.css',
  require('bpmn-js/dist/assets/diagram-js.css').default
);

insertCSS(
  'bpmn-font.css',
  require('bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css').default
);


describe('alignToOrigin', function() {

  it.skip('should work (visual test)', async function() {

    // given
    var diagramXML = require('./AlignToOrigin.default.bpmn').default;

    var modeler = new BpmnModeler({
      container: 'body',
      additionalModules: [
        TestVisualizationModule,
        DiagramOriginModule,
        AlignToOriginModule
      ]
    });

    setInterval(function() {
      modeler.get('alignToOrigin').align();
    }, 3000);

    await modeler.importXML(diagramXML);
  });


  it('should disable alignOnSave', async function() {

    // given
    var diagramXML = require('./AlignToOrigin.default.bpmn').default;

    var modeler = new BpmnModeler({
      container: 'body',
      additionalModules: [ AlignToOriginModule ],
      alignToOrigin: {
        alignOnSave: false
      }
    });

    var elementRegistry = modeler.get('elementRegistry');

    await modeler.importXML(diagramXML);

    var element = elementRegistry.get('StartEvent');

    // when
    await modeler.saveXML();

    // then
    // expect element got not aligned
    expect(element.x).not.to.eql(156);
    expect(element.y).not.to.eql(156);

  });


  it('should compute adjustment', function() {

    // given
    var modeler = new BpmnModeler({
      container: 'body',
      additionalModules: [ AlignToOriginModule ]
    });

    var alignToOrigin = modeler.get('alignToOrigin');

    var config = {
      offset: { x: 100, y: 100 },
      tolerance: 50
    };

    // then
    expect(alignToOrigin.computeAdjustment({ x: 40, y: 60 }, config)).to.eql({ x: 60, y: 0 });
    expect(alignToOrigin.computeAdjustment({ x: 60, y: 40 }, config)).to.eql({ x: 0, y: 60 });
    expect(alignToOrigin.computeAdjustment({ x: 140, y: 160 }, config)).to.eql({ x: 0, y: -60 });
    expect(alignToOrigin.computeAdjustment({ x: 160, y: 140 }, config)).to.eql({ x: -60, y: 0 });
    expect(alignToOrigin.computeAdjustment({ x: 90, y: 90 }, config)).to.eql({ x: 0, y: 0 });
    expect(alignToOrigin.computeAdjustment({ x: -30, y: 200 }, config)).to.eql({ x: 130, y: -100 });
  });


  it('should scroll canvas', async function() {

    // given
    var diagramXML = require('./AlignToOrigin.default.bpmn').default;

    var modeler = new BpmnModeler({
      container: 'body',
      additionalModules: [ AlignToOriginModule ],
      canvas: {
        deferUpdate: false
      }
    });


    var alignToOrigin = modeler.get('alignToOrigin');
    var elementRegistry = modeler.get('elementRegistry');
    var modeling = modeler.get('modeling');
    var commandStack = modeler.get('commandStack');
    var canvas = modeler.get('canvas');

    function expectAligned() {
      var inner = canvas.viewbox().inner;

      expect({ x: inner.x, y: inner.y }).to.eql({ x: 151, y: 79 });
    }

    await modeler.importXML(diagramXML);

    // given
    var element = elementRegistry.get('StartEvent');

    alignToOrigin.align();

    // assume
    expectAligned();

    // when
    modeling.moveElements([ element ], { x: -200, y: -200 });
    alignToOrigin.align();

    // then
    expectAligned();

    // when zooming in...
    canvas.zoom(1.3);

    // and undoing...
    commandStack.undo();
    commandStack.undo();

    // then
    expectAligned();

  });


  it('should handle last element removal', async function() {

    // given
    var diagramXML = require('./AlignToOrigin.event.bpmn').default;

    var modeler = new BpmnModeler({
      container: 'body',
      additionalModules: [
        AlignToOriginModule
      ]
    });

    await modeler.importXML(diagramXML);

    var elementRegistry = modeler.get('elementRegistry');
    var modeling = modeler.get('modeling');
    var commandStack = modeler.get('commandStack');

    // when
    modeling.removeElements([
      elementRegistry.get('Event')
    ]);

    commandStack.undo();

    // then
    expect(elementRegistry.get('Event')).to.exist;
  });


  it('should allow alignment with auto-save', async function() {

    // given
    var diagramXML = require('./AlignToOrigin.event.bpmn').default;

    var modeler = new BpmnModeler({
      container: 'body',
      additionalModules: [
        AlignToOriginModule,
        AutoSaveModule
      ]
    });

    await modeler.importXML(diagramXML);

    var elementRegistry = modeler.get('elementRegistry');
    var modeling = modeler.get('modeling');

    // when
    modeling.moveElements([
      elementRegistry.get('Event')
    ], { x: 400, y: 0 });

    modeling.moveElements([
      elementRegistry.get('Event')
    ], { x: -230, y: -500 });

    // then
    // we expect auto safe to trigger once,
    // without endless looping
    await eventEmitted(modeler, 'saveXML.done');
  });

});


// helpers /////////////

function eventEmitted(emitter, event) {

  return new Promise(function(resolve, reject) {
    function listenerFn(event) {
      emitter.off(event, listenerFn);

      return resolve(event);
    }

    emitter.on(event, listenerFn);
  });
}