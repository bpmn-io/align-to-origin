import CmmnModeler from 'cmmn-js/lib/Modeler';

import AlignToOriginModule from '../..';


describe('alignToOrigin - cmmn-js integration', function() {

  it('should extend CmmnModeler instance', function(done) {

    // given
    var diagramXML = require('./case.cmmn').default;

    var modeler = new CmmnModeler({
      container: 'body',
      additionalModules: [ AlignToOriginModule ]
    });

    var elementRegistry = modeler.get('elementRegistry');

    modeler.importXML(diagramXML, function(err) {

      if (err) {
        return done(err);
      }

      var element = elementRegistry.get('CasePlanModel');

      // when
      modeler.saveXML(function(err, xml) {

        // then
        // expect element got aligned
        expect(element.x).to.eql(156);
        expect(element.y).to.eql(99);

        done(err);
      });
    });

  });

});