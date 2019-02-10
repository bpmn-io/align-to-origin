import BpmnModeler from 'bpmn-js/lib/Modeler';
import DmnModeler from 'dmn-js/lib/Modeler';
import CmmnModeler from 'cmmn-js/lib/Modeler';

import AlignToOriginModule from '..';

var TEST_MODULES = [
  AlignToOriginModule
];


describe('alignToOrigin', function() {

  it('should extend BpmnModeler instance', function(done) {

    // given
    var diagramXML = require('./process.bpmn');

    var modeler = new BpmnModeler({
      container: 'body',
      additionalModules: TEST_MODULES
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


    setInterval(function() {
      modeler.saveXML(function() {});
    }, 3000);

  });


  it('should disable alignOnSave', function(done) {

    // given
    var diagramXML = require('./process.bpmn');

    var modeler = new BpmnModeler({
      container: 'body',
      additionalModules: TEST_MODULES,
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
      additionalModules: TEST_MODULES
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
        additionalModules: TEST_MODULES
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
      additionalModules: TEST_MODULES
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

});