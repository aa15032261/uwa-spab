import * as $protobuf from "protobufjs";
/** Namespace SpabDataStruct. */
export namespace SpabDataStruct {

    /** Properties of a CameraData. */
    interface ICameraData {

        /** CameraData name */
        name?: (string|null);

        /** CameraData buf */
        buf?: (Uint8Array|null);
    }

    /** Represents a CameraData. */
    class CameraData implements ICameraData {

        /**
         * Constructs a new CameraData.
         * @param [properties] Properties to set
         */
        constructor(properties?: SpabDataStruct.ICameraData);

        /** CameraData name. */
        public name: string;

        /** CameraData buf. */
        public buf: Uint8Array;

        /**
         * Creates a new CameraData instance using the specified properties.
         * @param [properties] Properties to set
         * @returns CameraData instance
         */
        public static create(properties?: SpabDataStruct.ICameraData): SpabDataStruct.CameraData;

        /**
         * Encodes the specified CameraData message. Does not implicitly {@link SpabDataStruct.CameraData.verify|verify} messages.
         * @param message CameraData message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: SpabDataStruct.ICameraData, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified CameraData message, length delimited. Does not implicitly {@link SpabDataStruct.CameraData.verify|verify} messages.
         * @param message CameraData message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: SpabDataStruct.ICameraData, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a CameraData message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns CameraData
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): SpabDataStruct.CameraData;

        /**
         * Decodes a CameraData message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns CameraData
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): SpabDataStruct.CameraData;

        /**
         * Verifies a CameraData message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a CameraData message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns CameraData
         */
        public static fromObject(object: { [k: string]: any }): SpabDataStruct.CameraData;

        /**
         * Creates a plain object from a CameraData message. Also converts values to other types if specified.
         * @param message CameraData
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: SpabDataStruct.CameraData, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this CameraData to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a SensorData. */
    interface ISensorData {

        /** SensorData voltage */
        voltage?: (number|null);
    }

    /** Represents a SensorData. */
    class SensorData implements ISensorData {

        /**
         * Constructs a new SensorData.
         * @param [properties] Properties to set
         */
        constructor(properties?: SpabDataStruct.ISensorData);

        /** SensorData voltage. */
        public voltage: number;

        /**
         * Creates a new SensorData instance using the specified properties.
         * @param [properties] Properties to set
         * @returns SensorData instance
         */
        public static create(properties?: SpabDataStruct.ISensorData): SpabDataStruct.SensorData;

        /**
         * Encodes the specified SensorData message. Does not implicitly {@link SpabDataStruct.SensorData.verify|verify} messages.
         * @param message SensorData message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: SpabDataStruct.ISensorData, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified SensorData message, length delimited. Does not implicitly {@link SpabDataStruct.SensorData.verify|verify} messages.
         * @param message SensorData message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: SpabDataStruct.ISensorData, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a SensorData message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns SensorData
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): SpabDataStruct.SensorData;

        /**
         * Decodes a SensorData message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns SensorData
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): SpabDataStruct.SensorData;

        /**
         * Verifies a SensorData message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a SensorData message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns SensorData
         */
        public static fromObject(object: { [k: string]: any }): SpabDataStruct.SensorData;

        /**
         * Creates a plain object from a SensorData message. Also converts values to other types if specified.
         * @param message SensorData
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: SpabDataStruct.SensorData, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this SensorData to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }
}
