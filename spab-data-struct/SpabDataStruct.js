/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
"use strict";

var $protobuf = require("protobufjs/minimal");

// Common aliases
var $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

$root.SpabDataStruct = (function() {

    /**
     * Namespace SpabDataStruct.
     * @exports SpabDataStruct
     * @namespace
     */
    var SpabDataStruct = {};

    SpabDataStruct.Log = (function() {

        /**
         * Properties of a Log.
         * @memberof SpabDataStruct
         * @interface ILog
         * @property {number|null} [id] Log id
         * @property {number|null} [timestamp] Log timestamp
         * @property {string|null} [type] Log type
         * @property {Uint8Array|null} [data] Log data
         */

        /**
         * Constructs a new Log.
         * @memberof SpabDataStruct
         * @classdesc Represents a Log.
         * @implements ILog
         * @constructor
         * @param {SpabDataStruct.ILog=} [properties] Properties to set
         */
        function Log(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Log id.
         * @member {number} id
         * @memberof SpabDataStruct.Log
         * @instance
         */
        Log.prototype.id = 0;

        /**
         * Log timestamp.
         * @member {number} timestamp
         * @memberof SpabDataStruct.Log
         * @instance
         */
        Log.prototype.timestamp = 0;

        /**
         * Log type.
         * @member {string} type
         * @memberof SpabDataStruct.Log
         * @instance
         */
        Log.prototype.type = "";

        /**
         * Log data.
         * @member {Uint8Array} data
         * @memberof SpabDataStruct.Log
         * @instance
         */
        Log.prototype.data = $util.newBuffer([]);

        /**
         * Creates a new Log instance using the specified properties.
         * @function create
         * @memberof SpabDataStruct.Log
         * @static
         * @param {SpabDataStruct.ILog=} [properties] Properties to set
         * @returns {SpabDataStruct.Log} Log instance
         */
        Log.create = function create(properties) {
            return new Log(properties);
        };

        /**
         * Encodes the specified Log message. Does not implicitly {@link SpabDataStruct.Log.verify|verify} messages.
         * @function encode
         * @memberof SpabDataStruct.Log
         * @static
         * @param {SpabDataStruct.ILog} message Log message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Log.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.id != null && Object.hasOwnProperty.call(message, "id"))
                writer.uint32(/* id 1, wireType 1 =*/9).double(message.id);
            if (message.timestamp != null && Object.hasOwnProperty.call(message, "timestamp"))
                writer.uint32(/* id 2, wireType 1 =*/17).double(message.timestamp);
            if (message.type != null && Object.hasOwnProperty.call(message, "type"))
                writer.uint32(/* id 4, wireType 2 =*/34).string(message.type);
            if (message.data != null && Object.hasOwnProperty.call(message, "data"))
                writer.uint32(/* id 5, wireType 2 =*/42).bytes(message.data);
            return writer;
        };

        /**
         * Encodes the specified Log message, length delimited. Does not implicitly {@link SpabDataStruct.Log.verify|verify} messages.
         * @function encodeDelimited
         * @memberof SpabDataStruct.Log
         * @static
         * @param {SpabDataStruct.ILog} message Log message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Log.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a Log message from the specified reader or buffer.
         * @function decode
         * @memberof SpabDataStruct.Log
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {SpabDataStruct.Log} Log
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Log.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.SpabDataStruct.Log();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.id = reader.double();
                    break;
                case 2:
                    message.timestamp = reader.double();
                    break;
                case 4:
                    message.type = reader.string();
                    break;
                case 5:
                    message.data = reader.bytes();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a Log message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof SpabDataStruct.Log
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {SpabDataStruct.Log} Log
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Log.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Log message.
         * @function verify
         * @memberof SpabDataStruct.Log
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Log.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.id != null && message.hasOwnProperty("id"))
                if (typeof message.id !== "number")
                    return "id: number expected";
            if (message.timestamp != null && message.hasOwnProperty("timestamp"))
                if (typeof message.timestamp !== "number")
                    return "timestamp: number expected";
            if (message.type != null && message.hasOwnProperty("type"))
                if (!$util.isString(message.type))
                    return "type: string expected";
            if (message.data != null && message.hasOwnProperty("data"))
                if (!(message.data && typeof message.data.length === "number" || $util.isString(message.data)))
                    return "data: buffer expected";
            return null;
        };

        /**
         * Creates a Log message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof SpabDataStruct.Log
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {SpabDataStruct.Log} Log
         */
        Log.fromObject = function fromObject(object) {
            if (object instanceof $root.SpabDataStruct.Log)
                return object;
            var message = new $root.SpabDataStruct.Log();
            if (object.id != null)
                message.id = Number(object.id);
            if (object.timestamp != null)
                message.timestamp = Number(object.timestamp);
            if (object.type != null)
                message.type = String(object.type);
            if (object.data != null)
                if (typeof object.data === "string")
                    $util.base64.decode(object.data, message.data = $util.newBuffer($util.base64.length(object.data)), 0);
                else if (object.data.length)
                    message.data = object.data;
            return message;
        };

        /**
         * Creates a plain object from a Log message. Also converts values to other types if specified.
         * @function toObject
         * @memberof SpabDataStruct.Log
         * @static
         * @param {SpabDataStruct.Log} message Log
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Log.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.id = 0;
                object.timestamp = 0;
                object.type = "";
                if (options.bytes === String)
                    object.data = "";
                else {
                    object.data = [];
                    if (options.bytes !== Array)
                        object.data = $util.newBuffer(object.data);
                }
            }
            if (message.id != null && message.hasOwnProperty("id"))
                object.id = options.json && !isFinite(message.id) ? String(message.id) : message.id;
            if (message.timestamp != null && message.hasOwnProperty("timestamp"))
                object.timestamp = options.json && !isFinite(message.timestamp) ? String(message.timestamp) : message.timestamp;
            if (message.type != null && message.hasOwnProperty("type"))
                object.type = message.type;
            if (message.data != null && message.hasOwnProperty("data"))
                object.data = options.bytes === String ? $util.base64.encode(message.data, 0, message.data.length) : options.bytes === Array ? Array.prototype.slice.call(message.data) : message.data;
            return object;
        };

        /**
         * Converts this Log to JSON.
         * @function toJSON
         * @memberof SpabDataStruct.Log
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Log.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return Log;
    })();

    SpabDataStruct.CameraData = (function() {

        /**
         * Properties of a CameraData.
         * @memberof SpabDataStruct
         * @interface ICameraData
         * @property {string|null} [name] CameraData name
         * @property {Uint8Array|null} [buf] CameraData buf
         */

        /**
         * Constructs a new CameraData.
         * @memberof SpabDataStruct
         * @classdesc Represents a CameraData.
         * @implements ICameraData
         * @constructor
         * @param {SpabDataStruct.ICameraData=} [properties] Properties to set
         */
        function CameraData(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * CameraData name.
         * @member {string} name
         * @memberof SpabDataStruct.CameraData
         * @instance
         */
        CameraData.prototype.name = "";

        /**
         * CameraData buf.
         * @member {Uint8Array} buf
         * @memberof SpabDataStruct.CameraData
         * @instance
         */
        CameraData.prototype.buf = $util.newBuffer([]);

        /**
         * Creates a new CameraData instance using the specified properties.
         * @function create
         * @memberof SpabDataStruct.CameraData
         * @static
         * @param {SpabDataStruct.ICameraData=} [properties] Properties to set
         * @returns {SpabDataStruct.CameraData} CameraData instance
         */
        CameraData.create = function create(properties) {
            return new CameraData(properties);
        };

        /**
         * Encodes the specified CameraData message. Does not implicitly {@link SpabDataStruct.CameraData.verify|verify} messages.
         * @function encode
         * @memberof SpabDataStruct.CameraData
         * @static
         * @param {SpabDataStruct.ICameraData} message CameraData message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        CameraData.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.name != null && Object.hasOwnProperty.call(message, "name"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.name);
            if (message.buf != null && Object.hasOwnProperty.call(message, "buf"))
                writer.uint32(/* id 2, wireType 2 =*/18).bytes(message.buf);
            return writer;
        };

        /**
         * Encodes the specified CameraData message, length delimited. Does not implicitly {@link SpabDataStruct.CameraData.verify|verify} messages.
         * @function encodeDelimited
         * @memberof SpabDataStruct.CameraData
         * @static
         * @param {SpabDataStruct.ICameraData} message CameraData message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        CameraData.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a CameraData message from the specified reader or buffer.
         * @function decode
         * @memberof SpabDataStruct.CameraData
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {SpabDataStruct.CameraData} CameraData
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        CameraData.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.SpabDataStruct.CameraData();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.name = reader.string();
                    break;
                case 2:
                    message.buf = reader.bytes();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a CameraData message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof SpabDataStruct.CameraData
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {SpabDataStruct.CameraData} CameraData
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        CameraData.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a CameraData message.
         * @function verify
         * @memberof SpabDataStruct.CameraData
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        CameraData.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.name != null && message.hasOwnProperty("name"))
                if (!$util.isString(message.name))
                    return "name: string expected";
            if (message.buf != null && message.hasOwnProperty("buf"))
                if (!(message.buf && typeof message.buf.length === "number" || $util.isString(message.buf)))
                    return "buf: buffer expected";
            return null;
        };

        /**
         * Creates a CameraData message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof SpabDataStruct.CameraData
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {SpabDataStruct.CameraData} CameraData
         */
        CameraData.fromObject = function fromObject(object) {
            if (object instanceof $root.SpabDataStruct.CameraData)
                return object;
            var message = new $root.SpabDataStruct.CameraData();
            if (object.name != null)
                message.name = String(object.name);
            if (object.buf != null)
                if (typeof object.buf === "string")
                    $util.base64.decode(object.buf, message.buf = $util.newBuffer($util.base64.length(object.buf)), 0);
                else if (object.buf.length)
                    message.buf = object.buf;
            return message;
        };

        /**
         * Creates a plain object from a CameraData message. Also converts values to other types if specified.
         * @function toObject
         * @memberof SpabDataStruct.CameraData
         * @static
         * @param {SpabDataStruct.CameraData} message CameraData
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        CameraData.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.name = "";
                if (options.bytes === String)
                    object.buf = "";
                else {
                    object.buf = [];
                    if (options.bytes !== Array)
                        object.buf = $util.newBuffer(object.buf);
                }
            }
            if (message.name != null && message.hasOwnProperty("name"))
                object.name = message.name;
            if (message.buf != null && message.hasOwnProperty("buf"))
                object.buf = options.bytes === String ? $util.base64.encode(message.buf, 0, message.buf.length) : options.bytes === Array ? Array.prototype.slice.call(message.buf) : message.buf;
            return object;
        };

        /**
         * Converts this CameraData to JSON.
         * @function toJSON
         * @memberof SpabDataStruct.CameraData
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        CameraData.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return CameraData;
    })();

    SpabDataStruct.SensorData = (function() {

        /**
         * Properties of a SensorData.
         * @memberof SpabDataStruct
         * @interface ISensorData
         * @property {number|null} [voltage] SensorData voltage
         */

        /**
         * Constructs a new SensorData.
         * @memberof SpabDataStruct
         * @classdesc Represents a SensorData.
         * @implements ISensorData
         * @constructor
         * @param {SpabDataStruct.ISensorData=} [properties] Properties to set
         */
        function SensorData(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * SensorData voltage.
         * @member {number} voltage
         * @memberof SpabDataStruct.SensorData
         * @instance
         */
        SensorData.prototype.voltage = 0;

        /**
         * Creates a new SensorData instance using the specified properties.
         * @function create
         * @memberof SpabDataStruct.SensorData
         * @static
         * @param {SpabDataStruct.ISensorData=} [properties] Properties to set
         * @returns {SpabDataStruct.SensorData} SensorData instance
         */
        SensorData.create = function create(properties) {
            return new SensorData(properties);
        };

        /**
         * Encodes the specified SensorData message. Does not implicitly {@link SpabDataStruct.SensorData.verify|verify} messages.
         * @function encode
         * @memberof SpabDataStruct.SensorData
         * @static
         * @param {SpabDataStruct.ISensorData} message SensorData message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SensorData.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.voltage != null && Object.hasOwnProperty.call(message, "voltage"))
                writer.uint32(/* id 1, wireType 1 =*/9).double(message.voltage);
            return writer;
        };

        /**
         * Encodes the specified SensorData message, length delimited. Does not implicitly {@link SpabDataStruct.SensorData.verify|verify} messages.
         * @function encodeDelimited
         * @memberof SpabDataStruct.SensorData
         * @static
         * @param {SpabDataStruct.ISensorData} message SensorData message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SensorData.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a SensorData message from the specified reader or buffer.
         * @function decode
         * @memberof SpabDataStruct.SensorData
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {SpabDataStruct.SensorData} SensorData
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SensorData.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.SpabDataStruct.SensorData();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.voltage = reader.double();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a SensorData message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof SpabDataStruct.SensorData
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {SpabDataStruct.SensorData} SensorData
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SensorData.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a SensorData message.
         * @function verify
         * @memberof SpabDataStruct.SensorData
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        SensorData.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.voltage != null && message.hasOwnProperty("voltage"))
                if (typeof message.voltage !== "number")
                    return "voltage: number expected";
            return null;
        };

        /**
         * Creates a SensorData message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof SpabDataStruct.SensorData
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {SpabDataStruct.SensorData} SensorData
         */
        SensorData.fromObject = function fromObject(object) {
            if (object instanceof $root.SpabDataStruct.SensorData)
                return object;
            var message = new $root.SpabDataStruct.SensorData();
            if (object.voltage != null)
                message.voltage = Number(object.voltage);
            return message;
        };

        /**
         * Creates a plain object from a SensorData message. Also converts values to other types if specified.
         * @function toObject
         * @memberof SpabDataStruct.SensorData
         * @static
         * @param {SpabDataStruct.SensorData} message SensorData
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        SensorData.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults)
                object.voltage = 0;
            if (message.voltage != null && message.hasOwnProperty("voltage"))
                object.voltage = options.json && !isFinite(message.voltage) ? String(message.voltage) : message.voltage;
            return object;
        };

        /**
         * Converts this SensorData to JSON.
         * @function toJSON
         * @memberof SpabDataStruct.SensorData
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        SensorData.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return SensorData;
    })();

    return SpabDataStruct;
})();

module.exports = $root;
