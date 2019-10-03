var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor) descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
        }
    }

    return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);
        if (staticProps) defineProperties(Constructor, staticProps);
        return Constructor;
    };
}();

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

SVGElement.prototype.getTransformToElement = SVGElement.prototype.getTransformToElement || function (toElement) {
    return toElement.getScreenCTM().inverse().multiply(this.getScreenCTM());
};

//
// CONNECTOR
// ===========================================================================
var Connector = function () {

    function Connector() {
        _classCallCheck(this, Connector);
        this.id = "connector_" + ++nextUid;
        this.dragType = "connector";
        this.isSelected = false;
        this.element = connectorElement.cloneNode(true);
        this.path = this.element.querySelector(".connector-path");
        this.pathOutline = this.element.querySelector(".connector-path-outline");
        this.inputHandle = this.element.querySelector(".input-handle");
        this.outputHandle = this.element.querySelector(".output-handle");
    }

    _createClass(Connector, [
        {
        key: "init", value: function init(port) {
            connectorLayer.appendChild(this.element);
            this.isInput = port.isInput;
            if (port.isInput) {
                this.inputPort = port;
                this.dragElement = this.outputHandle;
                this.staticElement = this.inputHandle;
            } else {
                this.outputPort = port;
                this.dragElement = this.inputHandle;
                this.staticElement = this.outputHandle;
            }
            this.staticPort = port;
            this.dragElement.setAttribute("data-drag", this.id + ":connector");
            console.log("port", port.id, this.id + ":connector");


// To HTML ================

                var output = document.getElementById("from");
                output.innerHTML = port.id;

                var output = document.getElementById("connector");
                output.innerHTML = this.id;

// ========================

            this.staticElement.setAttribute("data-drag", port.id + ":port");
            // console.log(this.id + ":port");
            TweenLite.set([this.inputHandle, this.outputHandle], {
                x: port.global.x,
                y: port.global.y
            });
            // console.log("input", this.inputHandle, "output", this.outputHandle);
        }
        },
        {
            key: "updatePath", value: function updatePath() {
                var x1 = this.inputHandle._gsTransform.x;
                var y1 = this.inputHandle._gsTransform.y;
                var x4 = this.outputHandle._gsTransform.x;
                var y4 = this.outputHandle._gsTransform.y;
                var dx = Math.abs(x1 - x4) * bezierWeight;
                var p1x = x1;
                var p1y = y1;
                var p2x = x1 - dx;
                var p2y = y1;
                var p4x = x4;
                var p4y = y4;
                var p3x = x4 + dx;
                var p3y = y4;
                var data = "M" + p1x + " " + p1y + " C " + p2x + " " + p2y + " " + p3x + " " + p3y + " " + p4x + " " + p4y;
                this.path.setAttribute("d", data);
                this.pathOutline.setAttribute("d", data);
            }
        },
        {
            key: "updateHandle", value: function updateHandle(port) {
                if (port === this.inputPort) {
                    TweenLite.set(this.inputHandle, {
                        x: port.global.x,
                        y: port.global.y
                    });
                } else if (port === this.outputPort) {
                    TweenLite.set(this.outputHandle, {
                        x: port.global.x,
                        y: port.global.y
                    });
                }
                this.updatePath();
            }
        },
        {
            key: "placeHandle", value: function placeHandle() {

                var skipShape = this.staticPort.parentNode.element;
                var hitPort = void 0;
                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;
                try {
                    for (var _iterator = shapes[Symbol.iterator](), _step;
                         !(_iteratorNormalCompletion = (_step = _iterator.next()).done);
                         _iteratorNormalCompletion = true) {
                        var shape = _step.value;
                        if (shape.element === skipShape) {
                            continue;
                        }
                        if (Draggable.hitTest(this.dragElement, shape.element)) {
                            var _ports = this.isInput ? shape.outputs : shape.inputs;
                            var _iteratorNormalCompletion2 = true;
                            var _didIteratorError2 = false;
                            var _iteratorError2 = undefined;
                            try {
                                for (var _iterator2 = _ports[Symbol.iterator](), _step2;
                                     !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done);
                                     _iteratorNormalCompletion2 = true) {
                                    var port = _step2.value;
                                    if (Draggable.hitTest(this.dragElement, port.portElement)) {
                                        hitPort = port;
                                        break;
                                    }
                                }
                            } catch (err) {
                                _didIteratorError2 = true;
                                _iteratorError2 = err;
                            } finally {
                                try {
                                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
                                        _iterator2.return();
                                    }
                                } finally {
                                    if (_didIteratorError2) {
                                        throw _iteratorError2;
                                    }
                                }
                            }

                            if (hitPort) {
                                break;
                            }
                        }
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion && _iterator.return) {
                            _iterator.return();
                        }
                    } finally {
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }

                if (hitPort) {
                    if (this.isInput) {
                        this.outputPort = hitPort;
                    } else {
                        this.inputPort = hitPort;
                    }
                    this.dragElement.setAttribute("data-drag", hitPort.id + ":port");
                    console.log("data-drag", hitPort.id + ":port");


// To HTML ===============

                    var output = document.getElementById("to");
                    output.innerHTML = hitPort.id;

// =======================

                    hitPort.addConnector(this);
                    this.updateHandle(hitPort);

                } else {
                    this.remove();
                }
            }
        },
        {
            key: "remove", value: function remove() {

                if (this.inputPort) {
                    this.inputPort.removeConnector(this);
                }

                if (this.outputPort) {
                    this.outputPort.removeConnector(this);
                }

                this.isSelected = false;

                this.path.removeAttribute("d");
                this.pathOutline.removeAttribute("d");
                this.dragElement.removeAttribute("data-drag");
                this.staticElement.removeAttribute("data-drag");

                this.staticPort = null;
                this.inputPort = null;
                this.outputPort = null;
                this.dragElement = null;
                this.staticElement = null;

                connectorLayer.removeChild(this.element);
                connectorPool.push(this);
            }
        },
        {
            key: "onDrag", value: function onDrag() {
                this.updatePath();
            }
        }, {
            key: "onDragEnd", value: function onDragEnd() {
                this.placeHandle();
            }
        }]);
    return Connector;
}();


//
// NODE PORT
// =========================================================================== 
var NodePort = function () {

    function NodePort(parentNode, element, isInput) {
        _classCallCheck(this, NodePort);

        this.id = "port_" + ++nextUid;
        this.dragType = "port";

        this.parentNode = parentNode;
        this.isInput = isInput;

        this.element = element;
        this.portElement = element.querySelector(".port");
        this.portScrim = element.querySelector(".port-scrim");

        this.portScrim.setAttribute("data-drag", this.id + ":port");
        console.log("data-drag", this.id + ":port");
        this.connectors = [];
        this.lastConnector;

        var bbox = this.portElement.getBBox();

        this.global = svg.createSVGPoint();
        this.center = svg.createSVGPoint();
        this.center.x = bbox.x + bbox.width / 2;
        this.center.y = bbox.y + bbox.height / 2;

        this.update();
    }

    _createClass(NodePort, [
        {
            key: "createConnector", value: function createConnector() {

                var connector = void 0;

                if (connectorPool.length) {
                    connector = connectorPool.pop();
                    connectorLookup[connector.id] = connector;
                } else {
                    connector = new Connector();
                }

                connector.init(this);
                this.lastConnector = connector;
                this.connectors.push(connector);
            }
        }, {
            key: "removeConnector", value: function removeConnector(connection) {

                var index = this.connectors.indexOf(connection);

                if (index > -1) {
                    this.connectors.splice(index, 1);
                }
            }
        }, {
            key: "addConnector", value: function addConnector(
                connection) {
                this.connectors.push(connection);
            }
        }, {
            key: "update", value: function update() {

                var transform = this.portElement.getTransformToElement(diagramElement);
                // console.log('diagramElement', diagramElement);
                this.global = this.center.matrixTransform(transform);
                var _iteratorNormalCompletion3 = true;
                var _didIteratorError3 = false;
                var _iteratorError3 = undefined;
                try {

                    for (var _iterator3 = this.connectors[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                        var connector = _step3.value;
                        connector.updateHandle(this);
                    }
                } catch (err) {
                    _didIteratorError3 = true;
                    _iteratorError3 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion3 && _iterator3.return) {
                            _iterator3.return();
                        }
                    } finally {
                        if (_didIteratorError3) {
                            throw _iteratorError3;
                        }
                    }
                }
            }
        }]);
    return NodePort;
}();


//
// NODE SHAPE
// =========================================================================== 
var NodeShape = function () {

    function NodeShape(element, x, y) {
        var _this = this;
        _classCallCheck(this, NodeShape);

        this.id = "shape_" + ++nextUid;
        this.dragType = "shape";

        element.setAttribute("data-drag", this.id + ":shape");
        console.log("data-drag", this.id + ":shape");


// to HTML

         // var output = document.getElementById("shapes");
         // output.innerHTML = this.id;

//

        this.element = element;
        this.dragElement = element;

        TweenLite.set(element, {x: x, y: y});

        var inputElements = Array.from(element.querySelectorAll(".input-field"));
        // console.log('inputElements', inputElements);
        var outputElements = Array.from(element.querySelectorAll(".output-field"));

        this.inputs = inputElements.map(function (element) {
            var port = new NodePort(_this, element, true);
            portLookup[port.id] = port;
            ports.push(port);
            return port;
        });

        this.outputs = outputElements.map(function (element) {
            var port = new NodePort(_this, element, false);
            portLookup[port.id] = port;
            ports.push(port);
            return port;
        });
    }

    _createClass(NodeShape, [{
        key: "onDrag", value: function onDrag() {
            var _iteratorNormalCompletion4 = true;
            var _didIteratorError4 = false;
            var _iteratorError4 = undefined;
            try {

                for (var _iterator4 = this.inputs[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                    var input = _step4.value;
                    input.update();
                }
            } catch (err) {
                _didIteratorError4 = true;
                _iteratorError4 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion4 && _iterator4.return) {
                        _iterator4.return();
                    }
                } finally {
                    if (_didIteratorError4) {
                        throw _iteratorError4;
                    }
                }
            }
            var _iteratorNormalCompletion5 = true;
            var _didIteratorError5 = false;
            var _iteratorError5 = undefined;
            try {

                for (var _iterator5 = this.outputs[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                    var output = _step5.value;
                    output.update();
                }
            } catch (err) {
                _didIteratorError5 = true;
                _iteratorError5 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion5 && _iterator5.return) {
                        _iterator5.return();
                    }
                } finally {
                    if (_didIteratorError5) {
                        throw _iteratorError5;
                    }
                }
            }
        }
    }]);
    return NodeShape;
}();


//
// DIAGRAM
// ===========================================================================
var Diagram = function () {

    function Diagram() {
        _classCallCheck(this, Diagram);

        this.dragElement = this.element = diagramElement;

        shapeElements.forEach(function (element, i) {
            var shape = new NodeShape(element, 50 + i * 250, 50);
            shapeLookup[shape.id] = shape;
            shapes.push(shape);
        });

        this.target = null;
        this.dragType = null;

        this.dragTarget = this.dragTarget.bind(this);
        this.prepareTarget = this.prepareTarget.bind(this);
        this.stopDragging = this.stopDragging.bind(this);

        this.draggable = new Draggable(dragProxy, {
            allowContextMenu: true,
            trigger: svg,
            onDrag: this.dragTarget,
            onDragEnd: this.stopDragging,
            onPress: this.prepareTarget
        });

    }

    _createClass(Diagram, [
        {
            key: "stopDragging", value: function stopDragging() {
                this.target.onDragEnd && this.target.onDragEnd();
            }
        }, {
            key: "prepareTarget", value: function prepareTarget(event) {
                var element = event.target;
                var drag = void 0;

                while (!(drag = element.getAttribute("data-drag")) && element !== svg) {
                    element = element.parentNode;
                }

                drag = drag || "diagram:diagram";
                var split = drag.split(":");
                var id = split[0];
                var dragType = split[1];

                switch (dragType) {
                    case "diagram":
                        this.target = this;
                        break;

                    case "shape":
                        this.target = shapeLookup[id];
                        break;

                    case "port":
                        var port = portLookup[id];
                        port.createConnector();
                        this.target = port.lastConnector;
                        this.dragType = this.target.dragType;
                        break;

                    case "connector":
                        this.target = connectorLookup[id];
                        break;
                }

            }
        }, {
            key: "dragTarget", value: function dragTarget() {

                TweenLite.set(this.target.dragElement, {
                    x: "+=" + this.draggable.deltaX,
                    y: "+=" + this.draggable.deltaY
                });


                this.target.onDrag && this.target.onDrag();
            }
        }]);
    return Diagram;
}();


//
// APP
// ===========================================================================
var nextUid = 0;

var bezierWeight = 0.675;

var svg = document.querySelector("#svg");
var diagramElement = document.querySelector("#diagram");

var shapeLookup = {};
var portLookup = {};
var connectorLookup = {};

var ports = [];
var shapes = [];
var connectorPool = [];

var dragProxy = document.querySelector("#drag-proxy");
var shapeElements = Array.from(document.querySelectorAll(".node-container"));

var frag = document.createDocumentFragment();
frag.appendChild(document.querySelector(".connector"));
var connectorElement = frag.querySelector(".connector");
var connectorLayer = document.querySelector("#connections-layer");

var diagram = new Diagram();