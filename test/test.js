import BpmnModeler from 'bpmn-js/lib/Modeler';
import DmnModeler from 'dmn-js/lib/Modeler';
import CmmnModeler from 'cmmn-js/lib/Modeler';

import { insertCSS } from 'bpmn-js/test/helper';

import TestVisualizationModule from './test-visualization';
import DiagramOriginModule from 'diagram-js-origin';

import AlignToOriginModule from '..';


insertCSS(
  'test.css',
  'html, body { height: 100%; padding: 0; }' +
  '.djs-hit { stroke: lightgreen !important; stroke-opacity: .3 !important; }'
);


describe('alignToOrigin', function() {

  it.skip('should work (visual test)', function(done) {

    // given
    var diagramXML = require('./process.bpmn');

    var modeler = new BpmnModeler({
      container: 'body',
      additionalModules: [
        TestVisualizationModule,
        DiagramOriginModule,
        AlignToOriginModule
      ],
      keyboard: {
        bindTo: document.body
      }
    });

    setInterval(function() {
      modeler.get('alignToOrigin').align();
    }, 3000);

    modeler.importXML(diagramXML, done);

  });


  it('should extend BpmnModeler instance', function(done) {

    // given
    var diagramXML = require('./process.bpmn');

    var modeler = new BpmnModeler({
      container: 'body',
      additionalModules: [ AlignToOriginModule ]
    });

    var elementRegistry = modeler.get('elementRegistry');

    modeler.importXML(diagramXML, function() {

      var element = elementRegistry.get('StartEvent');

      // when
      modeler.saveXML(function(err, xml) {

        // then
        // expect element got aligned
        expect(element.x).to.eql(156);
        expect(element.y).to.eql(156);

        done(err);
      });

    });

  });


  it('should disable alignOnSave', function(done) {

    // given
    var diagramXML = require('./process.bpmn');

    var modeler = new BpmnModeler({
      container: 'body',
      additionalModules: [ AlignToOriginModule ],
      alignToOrigin: {
        alignOnSave: false
      }
    });

    var elementRegistry = modeler.get('elementRegistry');

    modeler.importXML(diagramXML, function() {

      var element = elementRegistry.get('StartEvent');

      // when
      modeler.saveXML(function(err, xml) {

        // then
        // expect element got not aligned
        expect(element.x).not.to.eql(156);
        expect(element.y).not.to.eql(156);

        done(err);
      });
    });

  });


  it('should extend CmmnModeler instance', function(done) {

    // given
    var diagramXML = require('./case.cmmn');

    var modeler = new CmmnModeler({
      container: 'body',
      additionalModules: [ AlignToOriginModule ]
    });

    var elementRegistry = modeler.get('elementRegistry');

    modeler.importXML(diagramXML, function() {

      var element = elementRegistry.get('CasePlanModel');

      // when
      modeler.saveXML(function(err, xml) {

        // then
        // expect element got aligned
        expect(element.x).to.eql(156);
        expect(element.y).to.eql(174);

        done(err);
      });
    });

  });


  it('should extend Drd instance', function(done) {

    // given
    var diagramXML = require('./decision.dmn');

    var modeler = new DmnModeler({
      container: 'body',
      drd: {
        additionalModules: [ AlignToOriginModule ]
      }
    });

    modeler.importXML(diagramXML, function() {

      var elementRegistry = modeler.getActiveViewer().get('elementRegistry');

      var element = elementRegistry.get('Decision');

      // when
      modeler.saveXML(function(err, xml) {

        // then
        // expect element got aligned
        expect(element.x).to.eql(200);
        expect(element.y).to.eql(156);

        done(err);
      });
    });

  });


  it('should compute correct adjustment', function() {

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


  it('should scroll canvas', function(done) {

    // given
    var diagramXML = require('./process.bpmn');

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

      expect({ x: inner.x, y: inner.y }).to.eql({ x: 150, y: 150 });
    }

    modeler.importXML(diagramXML, function() {

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

      done();
    });

  });

});