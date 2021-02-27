var LOW_PRIORITY = 250;

/**
 * Saves the diagram, on change.
 *
 * @constructor
 *
 * @param {didi.Injector} injector
 * @param {Object} config save config
 *
 * @example
 *
 * ```javascript
 * // once used, components may safely hook into `saveXML.done`
 * // to get notified on every save
 *
 * const modeler = new BpmnModeler({
 *   additionalModules: [
 *     AutoSaveModule
 *   ]
 * });
 *
 * modeler.on('saveXML.done', function(event) {
 *   const {
 *     error,
 *     xml
 *   } = event;
 *
 *   // ...
 * });
 * ```
 */
function AutoSave(injector, config) {

  config = config || { format: true };

  var parent = injector.get('_parent', false);

  var modeler = parent || injector.get('bpmnjs', false) || injector.get('cmmnjs');

  if (!modeler) {
    throw new Error('no modeler context');
  }

  var eventBus = parent && parent._eventBus || injector.get('eventBus');

  function subscribeChanged() {
    eventBus.once('commandStack.changed', LOW_PRIORITY, function() {
      modeler.saveXML(config)
        .catch(function(error) {
          console.error('[auto-save] failed', error);
        })
        .finally(subscribeChanged);
    });
  }

  subscribeChanged();
}

AutoSave.$inject = [ 'injector', 'config.autoSave' ];


export default {
  __init__: [
    'autoSave'
  ],
  autoSave: [ 'type', AutoSave ]
};