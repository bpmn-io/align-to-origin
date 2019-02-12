# @bpmn-io/align-to-origin

[![Build Status](https://travis-ci.com/bpmn-io/align-to-origin.svg?branch=master)](https://travis-ci.com/bpmn-io/align-to-origin)

Aligns your diagrams to the coordinate origin `(0,0)`, manually triggered or on diagram save. 

Plugs into your favorite [BPMN](https://github.com/bpmn-io/bpmn-js), [DMN](https://github.com/bpmn-io/dmn-js) and [CMMN](https://github.com/bpmn-io/cmmn-js) editor. 

<img src="https://raw.githubusercontent.com/bpmn-io/align-to-origin/master/resources/screencapture.gif" width="600" alt="Automatic Origin Adjustment" />

_Alignment in action. [Diagram origin marker](https://github.com/bpmn-io/diagram-js-origin), alignment corridor, and element boxes shown for demonstration purposes only._


## Usage

```javascript
import BpmnModeler from 'bpmn-js/lib/Modeler';

import AlignToOrigin from '@bpmn-io/align-to-origin';


// extend the BPMN editor with the exporter module
var modeler = new BpmnModeler({
  alignToOrigin: {
    alignOnSave: true,
    offset: 150,
    tolerance: 50
  },
  additionalModules: [
    AlignToOrigin
  ]
});


// hooks into #saveXML to align the diagram elements
modeler.saveXML(function(err, xml) {
  ...
});

// may be used standalone, too
var alignToOrigin = modeler.get('alignToOrigin');

alignToOrigin.align();
```


## License

MIT
