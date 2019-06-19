# Changelog

All notable changes to [@bpmn-io/align-to-origin](https://github.com/bpmn-io/align-to-origin) are documented here. We use [semantic versioning](http://semver.org/) for releases.

## Unreleased

___Note:__ Yet to be released changes appear here._

## 0.6.0

* `FEAT`: make grid aware

## 0.5.0

* `CHORE`: update `y` offset to more sane default

## 0.4.2

* `FIX`: move canvas after `commandStack.changed` ([`95834a8439fc3f053995740d8dc8ce7302b3be39`](https://github.com/bpmn-io/align-to-origin/commit/95834a8439fc3f053995740d8dc8ce7302b3be39))

## 0.4.1

* `FIX`: correct documentation

## 0.4.0

* `FEAT`: always compensate for element movement by scrolling canvas, drop `scrollCanvas` option
* `FEAT`: implement canvas scrolling in an undoable manner

## 0.3.0

* `FEAT`: add ability to specify `{ x, y }` offset
* `FEAT`: adjust `x` and `y` independent from each other
* `FEAT`: apply sane default for `offset` and `tolerance`
* `CHORE`: rename `padding` to `offset`
* `CHORE`: rename `thresold` to `tolerance`

## 0.2.0

* `FEAT`: make `alignOnSave=true` the default behavior

## 0.1.0

_Initial version._