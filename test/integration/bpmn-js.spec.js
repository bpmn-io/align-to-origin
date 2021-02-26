import BpmnModeler from 'bpmn-js/lib/Modeler';

import AlignToOriginModule from '../..';


var NoGridSnapping = {
  'gridSnapping': [ 'value', null ]
};


describe('alignToOrigin - bpmn-js integration', function() {

  it('should extend BpmnModeler with grid snapping', async function() {

    // given
    var diagramXML = require('./process.bpmn');

    var modeler = new BpmnModeler({
      container: 'body',
      additionalModules: [
        AlignToOriginModule,
        NoGridSnapping
      ]
    });

    var elementRegistry = modeler.get('elementRegistry');

    await modeler.importXML(diagramXML);

    var element = elementRegistry.get('StartEvent');

    // when
    await modeler.saveXML();

    // then
    // expect element got aligned
    expect(element.x).to.eql(156);
    expect(element.y).to.eql(81);
  });


  it('should extend BpmnModeler with grid snapping', async function() {

    // given
    var diagramXML = require('./process.bpmn');

    var modeler = new BpmnModeler({
      container: 'body',
      additionalModules: [
        AlignToOriginModule
      ]
    });

    var elementRegistry = modeler.get('elementRegistry');

    await modeler.importXML(diagramXML);

    var element = elementRegistry.get('StartEvent');

    // when
    await modeler.saveXML();

    // then
    // expect element got aligned
    expect(element.x).to.eql(156);
    expect(element.y).to.eql(84);
  });


  it('should disable alignOnSave', async function() {

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

    await modeler.importXML(diagramXML);

    var element = elementRegistry.get('StartEvent');

    // when
    await modeler.saveXML();

    // then
    // expect element got not aligned
    expect(element.x).not.to.eql(156);
    expect(element.y).not.to.eql(156);
  });

});