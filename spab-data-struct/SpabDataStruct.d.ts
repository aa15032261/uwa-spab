import * as $protobuf from "protobufjs";
/** Namespace SpabDataStruct. */
export namespace SpabDataStruct {

    /** Properties of a LogClient. */
    interface ILogClient {

        /** LogClient logId */
        logId?: (number|null);

        /** LogClient timestamp */
        timestamp?: (number|null);

        /** LogClient type */
        type?: (string|null);

        /** LogClient typeId */
        typeId?: (string|null);

        /** LogClient data */
        data?: (Uint8Array|null);
    }

    /** Represents a LogClient. */
    class LogClient implements ILogClient {

        /**
         * Constructs a new LogClient.
         * @param [properties] Properties to set
         */
        constructor(properties?: SpabDataStruct.ILogClient);

        /** LogClient logId. */
        public logId: number;

        /** LogClient timestamp. */
        public timestamp: number;

        /** LogClient type. */
        public type: string;

        /** LogClient typeId. */
        public typeId: string;

        /** LogClient data. */
        public data: Uint8Array;

        /**
         * Creates a new LogClient instance using the specified properties.
         * @param [properties] Properties to set
         * @returns LogClient instance
         */
        public static create(properties?: SpabDataStruct.ILogClient): SpabDataStruct.LogClient;

        /**
         * Encodes the specified LogClient message. Does not implicitly {@link SpabDataStruct.LogClient.verify|verify} messages.
         * @param message LogClient message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: SpabDataStruct.ILogClient, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified LogClient message, length delimited. Does not implicitly {@link SpabDataStruct.LogClient.verify|verify} messages.
         * @param message LogClient message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: SpabDataStruct.ILogClient, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a LogClient message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns LogClient
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): SpabDataStruct.LogClient;

        /**
         * Decodes a LogClient message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns LogClient
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): SpabDataStruct.LogClient;

        /**
         * Verifies a LogClient message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a LogClient message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns LogClient
         */
        public static fromObject(object: { [k: string]: any }): SpabDataStruct.LogClient;

        /**
         * Creates a plain object from a LogClient message. Also converts values to other types if specified.
         * @param message LogClient
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: SpabDataStruct.LogClient, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this LogClient to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a LogGui. */
    interface ILogGui {

        /** LogGui clientId */
        clientId?: (string|null);

        /** LogGui logStartTimestamp */
        logStartTimestamp?: (number|null);

        /** LogGui timestamp */
        timestamp?: (number|null);

        /** LogGui type */
        type?: (string|null);

        /** LogGui typeId */
        typeId?: (string|null);

        /** LogGui data */
        data?: (Uint8Array|null);
    }

    /** Represents a LogGui. */
    class LogGui implements ILogGui {

        /**
         * Constructs a new LogGui.
         * @param [properties] Properties to set
         */
        constructor(properties?: SpabDataStruct.ILogGui);

        /** LogGui clientId. */
        public clientId: string;

        /** LogGui logStartTimestamp. */
        public logStartTimestamp: number;

        /** LogGui timestamp. */
        public timestamp: number;

        /** LogGui type. */
        public type: string;

        /** LogGui typeId. */
        public typeId: string;

        /** LogGui data. */
        public data: Uint8Array;

        /**
         * Creates a new LogGui instance using the specified properties.
         * @param [properties] Properties to set
         * @returns LogGui instance
         */
        public static create(properties?: SpabDataStruct.ILogGui): SpabDataStruct.LogGui;

        /**
         * Encodes the specified LogGui message. Does not implicitly {@link SpabDataStruct.LogGui.verify|verify} messages.
         * @param message LogGui message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: SpabDataStruct.ILogGui, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified LogGui message, length delimited. Does not implicitly {@link SpabDataStruct.LogGui.verify|verify} messages.
         * @param message LogGui message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: SpabDataStruct.ILogGui, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a LogGui message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns LogGui
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): SpabDataStruct.LogGui;

        /**
         * Decodes a LogGui message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns LogGui
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): SpabDataStruct.LogGui;

        /**
         * Verifies a LogGui message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a LogGui message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns LogGui
         */
        public static fromObject(object: { [k: string]: any }): SpabDataStruct.LogGui;

        /**
         * Creates a plain object from a LogGui message. Also converts values to other types if specified.
         * @param message LogGui
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: SpabDataStruct.LogGui, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this LogGui to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }
}
