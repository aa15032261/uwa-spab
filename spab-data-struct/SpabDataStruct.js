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

    SpabDataStruct.LogClient = (function() {

        /**
         * Properties of a LogClient.
         * @memberof SpabDataStruct
         * @interface ILogClient
         * @property {number|null} [logId] LogClient logId
         * @property {number|null} [timestamp] LogClient timestamp
         * @property {string|null} [type] LogClient type
         * @property {string|null} [typeId] LogClient typeId
         * @property {Uint8Array|null} [data] LogClient data
         */

        /**
         * Constructs a new LogClient.
         * @memberof SpabDataStruct
         * @classdesc Represents a LogClient.
         * @implements ILogClient
         * @constructor
         * @param {SpabDataStruct.ILogClient=} [properties] Properties to set
         */
        function LogClient(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * LogClient logId.
         * @member {number} logId
         * @memberof SpabDataStruct.LogClient
         * @instance
         */
        LogClient.prototype.logId = 0;

        /**
         * LogClient timestamp.
         * @member {number} timestamp
         * @memberof SpabDataStruct.LogClient
         * @instance
         */
        LogClient.prototype.timestamp = 0;

        /**
         * LogClient type.
         * @member {string} type
         * @memberof SpabDataStruct.LogClient
         * @instance
         */
        LogClient.prototype.type = "";

        /**
         * LogClient typeId.
         * @member {string} typeId
         * @memberof SpabDataStruct.LogClient
         * @instance
         */
        LogClient.prototype.typeId = "";

        /**
         * LogClient data.
         * @member {Uint8Array} data
         * @memberof SpabDataStruct.LogClient
         * @instance
         */
        LogClient.prototype.data = $util.newBuffer([]);

        /**
         * Creates a new LogClient instance using the specified properties.
         * @function create
         * @memberof SpabDataStruct.LogClient
         * @static
         * @param {SpabDataStruct.ILogClient=} [properties] Properties to set
         * @returns {SpabDataStruct.LogClient} LogClient instance
         */
        LogClient.create = function create(properties) {
            return new LogClient(properties);
        };

        /**
         * Encodes the specified LogClient message. Does not implicitly {@link SpabDataStruct.LogClient.verify|verify} messages.
         * @function encode
         * @memberof SpabDataStruct.LogClient
         * @static
         * @param {SpabDataStruct.ILogClient} message LogClient message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        LogClient.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.logId != null && Object.hasOwnProperty.call(message, "logId"))
                writer.uint32(/* id 1, wireType 1 =*/9).double(message.logId);
            if (message.timestamp != null && Object.hasOwnProperty.call(message, "timestamp"))
                writer.uint32(/* id 2, wireType 1 =*/17).double(message.timestamp);
            if (message.type != null && Object.hasOwnProperty.call(message, "type"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.type);
            if (message.typeId != null && Object.hasOwnProperty.call(message, "typeId"))
                writer.uint32(/* id 4, wireType 2 =*/34).string(message.typeId);
            if (message.data != null && Object.hasOwnProperty.call(message, "data"))
                writer.uint32(/* id 5, wireType 2 =*/42).bytes(message.data);
            return writer;
        };

        /**
         * Encodes the specified LogClient message, length delimited. Does not implicitly {@link SpabDataStruct.LogClient.verify|verify} messages.
         * @function encodeDelimited
         * @memberof SpabDataStruct.LogClient
         * @static
         * @param {SpabDataStruct.ILogClient} message LogClient message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        LogClient.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a LogClient message from the specified reader or buffer.
         * @function decode
         * @memberof SpabDataStruct.LogClient
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {SpabDataStruct.LogClient} LogClient
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        LogClient.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.SpabDataStruct.LogClient();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.logId = reader.double();
                    break;
                case 2:
                    message.timestamp = reader.double();
                    break;
                case 3:
                    message.type = reader.string();
                    break;
                case 4:
                    message.typeId = reader.string();
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
         * Decodes a LogClient message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof SpabDataStruct.LogClient
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {SpabDataStruct.LogClient} LogClient
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        LogClient.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a LogClient message.
         * @function verify
         * @memberof SpabDataStruct.LogClient
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        LogClient.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.logId != null && message.hasOwnProperty("logId"))
                if (typeof message.logId !== "number")
                    return "logId: number expected";
            if (message.timestamp != null && message.hasOwnProperty("timestamp"))
                if (typeof message.timestamp !== "number")
                    return "timestamp: number expected";
            if (message.type != null && message.hasOwnProperty("type"))
                if (!$util.isString(message.type))
                    return "type: string expected";
            if (message.typeId != null && message.hasOwnProperty("typeId"))
                if (!$util.isString(message.typeId))
                    return "typeId: string expected";
            if (message.data != null && message.hasOwnProperty("data"))
                if (!(message.data && typeof message.data.length === "number" || $util.isString(message.data)))
                    return "data: buffer expected";
            return null;
        };

        /**
         * Creates a LogClient message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof SpabDataStruct.LogClient
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {SpabDataStruct.LogClient} LogClient
         */
        LogClient.fromObject = function fromObject(object) {
            if (object instanceof $root.SpabDataStruct.LogClient)
                return object;
            var message = new $root.SpabDataStruct.LogClient();
            if (object.logId != null)
                message.logId = Number(object.logId);
            if (object.timestamp != null)
                message.timestamp = Number(object.timestamp);
            if (object.type != null)
                message.type = String(object.type);
            if (object.typeId != null)
                message.typeId = String(object.typeId);
            if (object.data != null)
                if (typeof object.data === "string")
                    $util.base64.decode(object.data, message.data = $util.newBuffer($util.base64.length(object.data)), 0);
                else if (object.data.length)
                    message.data = object.data;
            return message;
        };

        /**
         * Creates a plain object from a LogClient message. Also converts values to other types if specified.
         * @function toObject
         * @memberof SpabDataStruct.LogClient
         * @static
         * @param {SpabDataStruct.LogClient} message LogClient
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        LogClient.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.logId = 0;
                object.timestamp = 0;
                object.type = "";
                object.typeId = "";
                if (options.bytes === String)
                    object.data = "";
                else {
                    object.data = [];
                    if (options.bytes !== Array)
                        object.data = $util.newBuffer(object.data);
                }
            }
            if (message.logId != null && message.hasOwnProperty("logId"))
                object.logId = options.json && !isFinite(message.logId) ? String(message.logId) : message.logId;
            if (message.timestamp != null && message.hasOwnProperty("timestamp"))
                object.timestamp = options.json && !isFinite(message.timestamp) ? String(message.timestamp) : message.timestamp;
            if (message.type != null && message.hasOwnProperty("type"))
                object.type = message.type;
            if (message.typeId != null && message.hasOwnProperty("typeId"))
                object.typeId = message.typeId;
            if (message.data != null && message.hasOwnProperty("data"))
                object.data = options.bytes === String ? $util.base64.encode(message.data, 0, message.data.length) : options.bytes === Array ? Array.prototype.slice.call(message.data) : message.data;
            return object;
        };

        /**
         * Converts this LogClient to JSON.
         * @function toJSON
         * @memberof SpabDataStruct.LogClient
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        LogClient.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return LogClient;
    })();

    SpabDataStruct.LogGui = (function() {

        /**
         * Properties of a LogGui.
         * @memberof SpabDataStruct
         * @interface ILogGui
         * @property {string|null} [clientId] LogGui clientId
         * @property {number|null} [logStartTimestamp] LogGui logStartTimestamp
         * @property {number|null} [timestamp] LogGui timestamp
         * @property {string|null} [type] LogGui type
         * @property {string|null} [typeId] LogGui typeId
         * @property {Uint8Array|null} [data] LogGui data
         */

        /**
         * Constructs a new LogGui.
         * @memberof SpabDataStruct
         * @classdesc Represents a LogGui.
         * @implements ILogGui
         * @constructor
         * @param {SpabDataStruct.ILogGui=} [properties] Properties to set
         */
        function LogGui(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * LogGui clientId.
         * @member {string} clientId
         * @memberof SpabDataStruct.LogGui
         * @instance
         */
        LogGui.prototype.clientId = "";

        /**
         * LogGui logStartTimestamp.
         * @member {number} logStartTimestamp
         * @memberof SpabDataStruct.LogGui
         * @instance
         */
        LogGui.prototype.logStartTimestamp = 0;

        /**
         * LogGui timestamp.
         * @member {number} timestamp
         * @memberof SpabDataStruct.LogGui
         * @instance
         */
        LogGui.prototype.timestamp = 0;

        /**
         * LogGui type.
         * @member {string} type
         * @memberof SpabDataStruct.LogGui
         * @instance
         */
        LogGui.prototype.type = "";

        /**
         * LogGui typeId.
         * @member {string} typeId
         * @memberof SpabDataStruct.LogGui
         * @instance
         */
        LogGui.prototype.typeId = "";

        /**
         * LogGui data.
         * @member {Uint8Array} data
         * @memberof SpabDataStruct.LogGui
         * @instance
         */
        LogGui.prototype.data = $util.newBuffer([]);

        /**
         * Creates a new LogGui instance using the specified properties.
         * @function create
         * @memberof SpabDataStruct.LogGui
         * @static
         * @param {SpabDataStruct.ILogGui=} [properties] Properties to set
         * @returns {SpabDataStruct.LogGui} LogGui instance
         */
        LogGui.create = function create(properties) {
            return new LogGui(properties);
        };

        /**
         * Encodes the specified LogGui message. Does not implicitly {@link SpabDataStruct.LogGui.verify|verify} messages.
         * @function encode
         * @memberof SpabDataStruct.LogGui
         * @static
         * @param {SpabDataStruct.ILogGui} message LogGui message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        LogGui.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.clientId != null && Object.hasOwnProperty.call(message, "clientId"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.clientId);
            if (message.logStartTimestamp != null && Object.hasOwnProperty.call(message, "logStartTimestamp"))
                writer.uint32(/* id 2, wireType 1 =*/17).double(message.logStartTimestamp);
            if (message.timestamp != null && Object.hasOwnProperty.call(message, "timestamp"))
                writer.uint32(/* id 3, wireType 1 =*/25).double(message.timestamp);
            if (message.type != null && Object.hasOwnProperty.call(message, "type"))
                writer.uint32(/* id 4, wireType 2 =*/34).string(message.type);
            if (message.typeId != null && Object.hasOwnProperty.call(message, "typeId"))
                writer.uint32(/* id 5, wireType 2 =*/42).string(message.typeId);
            if (message.data != null && Object.hasOwnProperty.call(message, "data"))
                writer.uint32(/* id 6, wireType 2 =*/50).bytes(message.data);
            return writer;
        };

        /**
         * Encodes the specified LogGui message, length delimited. Does not implicitly {@link SpabDataStruct.LogGui.verify|verify} messages.
         * @function encodeDelimited
         * @memberof SpabDataStruct.LogGui
         * @static
         * @param {SpabDataStruct.ILogGui} message LogGui message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        LogGui.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a LogGui message from the specified reader or buffer.
         * @function decode
         * @memberof SpabDataStruct.LogGui
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {SpabDataStruct.LogGui} LogGui
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        LogGui.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.SpabDataStruct.LogGui();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.clientId = reader.string();
                    break;
                case 2:
                    message.logStartTimestamp = reader.double();
                    break;
                case 3:
                    message.timestamp = reader.double();
                    break;
                case 4:
                    message.type = reader.string();
                    break;
                case 5:
                    message.typeId = reader.string();
                    break;
                case 6:
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
         * Decodes a LogGui message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof SpabDataStruct.LogGui
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {SpabDataStruct.LogGui} LogGui
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        LogGui.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a LogGui message.
         * @function verify
         * @memberof SpabDataStruct.LogGui
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        LogGui.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.clientId != null && message.hasOwnProperty("clientId"))
                if (!$util.isString(message.clientId))
                    return "clientId: string expected";
            if (message.logStartTimestamp != null && message.hasOwnProperty("logStartTimestamp"))
                if (typeof message.logStartTimestamp !== "number")
                    return "logStartTimestamp: number expected";
            if (message.timestamp != null && message.hasOwnProperty("timestamp"))
                if (typeof message.timestamp !== "number")
                    return "timestamp: number expected";
            if (message.type != null && message.hasOwnProperty("type"))
                if (!$util.isString(message.type))
                    return "type: string expected";
            if (message.typeId != null && message.hasOwnProperty("typeId"))
                if (!$util.isString(message.typeId))
                    return "typeId: string expected";
            if (message.data != null && message.hasOwnProperty("data"))
                if (!(message.data && typeof message.data.length === "number" || $util.isString(message.data)))
                    return "data: buffer expected";
            return null;
        };

        /**
         * Creates a LogGui message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof SpabDataStruct.LogGui
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {SpabDataStruct.LogGui} LogGui
         */
        LogGui.fromObject = function fromObject(object) {
            if (object instanceof $root.SpabDataStruct.LogGui)
                return object;
            var message = new $root.SpabDataStruct.LogGui();
            if (object.clientId != null)
                message.clientId = String(object.clientId);
            if (object.logStartTimestamp != null)
                message.logStartTimestamp = Number(object.logStartTimestamp);
            if (object.timestamp != null)
                message.timestamp = Number(object.timestamp);
            if (object.type != null)
                message.type = String(object.type);
            if (object.typeId != null)
                message.typeId = String(object.typeId);
            if (object.data != null)
                if (typeof object.data === "string")
                    $util.base64.decode(object.data, message.data = $util.newBuffer($util.base64.length(object.data)), 0);
                else if (object.data.length)
                    message.data = object.data;
            return message;
        };

        /**
         * Creates a plain object from a LogGui message. Also converts values to other types if specified.
         * @function toObject
         * @memberof SpabDataStruct.LogGui
         * @static
         * @param {SpabDataStruct.LogGui} message LogGui
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        LogGui.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.clientId = "";
                object.logStartTimestamp = 0;
                object.timestamp = 0;
                object.type = "";
                object.typeId = "";
                if (options.bytes === String)
                    object.data = "";
                else {
                    object.data = [];
                    if (options.bytes !== Array)
                        object.data = $util.newBuffer(object.data);
                }
            }
            if (message.clientId != null && message.hasOwnProperty("clientId"))
                object.clientId = message.clientId;
            if (message.logStartTimestamp != null && message.hasOwnProperty("logStartTimestamp"))
                object.logStartTimestamp = options.json && !isFinite(message.logStartTimestamp) ? String(message.logStartTimestamp) : message.logStartTimestamp;
            if (message.timestamp != null && message.hasOwnProperty("timestamp"))
                object.timestamp = options.json && !isFinite(message.timestamp) ? String(message.timestamp) : message.timestamp;
            if (message.type != null && message.hasOwnProperty("type"))
                object.type = message.type;
            if (message.typeId != null && message.hasOwnProperty("typeId"))
                object.typeId = message.typeId;
            if (message.data != null && message.hasOwnProperty("data"))
                object.data = options.bytes === String ? $util.base64.encode(message.data, 0, message.data.length) : options.bytes === Array ? Array.prototype.slice.call(message.data) : message.data;
            return object;
        };

        /**
         * Converts this LogGui to JSON.
         * @function toJSON
         * @memberof SpabDataStruct.LogGui
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        LogGui.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return LogGui;
    })();

    return SpabDataStruct;
})();

module.exports = $root;
