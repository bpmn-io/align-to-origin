import { expect } from 'chai';

import DmnModeler from 'dmn-js/lib/Modeler';

import AlignToOriginModule from '../..';

import diagramXML from './decision.dmn';


describe('alignToOrigin - DRD integration', function() {

  it('should extend Drd instance', async function() {

    // given
    var modeler = new DmnModeler({
      container: 'body',
      drd: {
        additionalModules: [ AlignToOriginModule ]
      }
    });

    await modeler.importXML(diagramXML);

    var elementRegistry = modeler.getActiveViewer().get('elementRegistry');

    var element = elementRegistry.get('Decision');

    // when
    await modeler.saveXML();

    // then
    // expect element got aligned
    expect(element.x).to.be.closeTo(150, 2);
    expect(element.y).to.be.closeTo(80, 2);
  });

});