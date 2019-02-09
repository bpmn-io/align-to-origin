import BpmnModeler from 'bpmn-js/lib/Modeler';
import DmnModeler from 'dmn-js/lib/Modeler';
import CmmnModeler from 'cmmn-js/lib/Modeler';

import AlignToOrigin from '..';


describe('alignToOrigin', function() {

  it('should extend BpmnModeler instance', function(done) {

    // given
    var diagramXML = require('./process.bpmn');

    var modeler = new BpmnModeler({
      container: 'body',
      additionalModules: [
        AlignToOrigin
      ],
      alignToOrigin: {
        alignOnSave: true
      }
    });

    var elementRegistry = modeler.get('elementRegistry');

    modeler.importXML(diagramXML, function() {

      var element = elementRegistry.get('StartEvent');

      // when
      modeler.saveXML(function(err, xml) {

        // then
        // expect element got aligned
        expect(element.x).to.eql(106);
        expect(element.y).to.eql(106);

        done(err);
      });
    });

  });


  it('should extend CmmnModeler instance', function(done) {

    // given
    var diagramXML = require('./case.cmmn');

    var modeler = new CmmnModeler({
      container: 'body',
      additionalModules: [
        AlignToOrigin
      ],
      alignToOrigin: {
        alignOnSave: true
      }
    });

    var elementRegistry = modeler.get('elementRegistry');

    modeler.importXML(diagramXML, function() {

      var element = elementRegistry.get('CasePlanModel');

      // when
      modeler.saveXML(function(err, xml) {

        // then
        // expect element got aligned
        expect(element.x).to.eql(106);
        expect(element.y).to.eql(124);

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
        additionalModules: [
          AlignToOrigin
        ],
        alignToOrigin: {
          alignOnSave: true
        }
      }
    });

    modeler.importXML(diagramXML, function() {

      var elementRegistry = modeler.getActiveViewer().get('elementRegistry');

      var element = elementRegistry.get('Decision');

      // when
      modeler.saveXML(function(err, xml) {

        // then
        // expect element got aligned
        expect(element.x).to.eql(106);
        expect(element.y).to.eql(106);

        done(err);
      });
    });

  });

});