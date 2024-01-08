import DmnModeler from 'dmn-js/lib/Modeler';

import AlignToOriginModule from '../..';


describe('alignToOrigin - DRD integration', function() {

  it('should extend Drd instance', function(done) {

    // given
    var diagramXML = require('./decision.dmn').default;

    var modeler = new DmnModeler({
      container: 'body',
      drd: {
        additionalModules: [ AlignToOriginModule ]
      }
    });

    modeler.importXML(diagramXML, function(err) {

      if (err) {
        return done(err);
      }

      var elementRegistry = modeler.getActiveViewer().get('elementRegistry');

      var element = elementRegistry.get('Decision');

      // when
      modeler.saveXML(function(err, xml) {

        // then
        // expect element got aligned
        expect(element.x).to.be.closeTo(200, 2);
        expect(element.y).to.be.closeTo(80, 2);

        done(err);
      });
    });

  });

});