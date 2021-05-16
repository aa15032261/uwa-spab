"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EfiStatus = void 0;
const node_mavlink_1 = require("@ifrunistuttgart/node-mavlink");
/*
EFI status output
*/
// health EFI health status uint8_t
// ecu_index ECU index float
// rpm RPM float
// fuel_consumed Fuel consumed float
// fuel_flow Fuel flow rate float
// engine_load Engine load float
// throttle_position Throttle position float
// spark_dwell_time Spark dwell time float
// barometric_pressure Barometric pressure float
// intake_manifold_pressure Intake manifold pressure( float
// intake_manifold_temperature Intake manifold temperature float
// cylinder_head_temperature Cylinder head temperature float
// ignition_timing Ignition timing (Crank angle degrees) float
// injection_time Injection time float
// exhaust_gas_temperature Exhaust gas temperature float
// throttle_out Output throttle float
// pt_compensation Pressure/temperature compensation float
class EfiStatus extends node_mavlink_1.MAVLinkMessage {
    constructor() {
        super(...arguments);
        this._message_id = 225;
        this._message_name = 'EFI_STATUS';
        this._crc_extra = 142;
        this._message_fields = [
            ['ecu_index', 'float', false],
            ['rpm', 'float', false],
            ['fuel_consumed', 'float', false],
            ['fuel_flow', 'float', false],
            ['engine_load', 'float', false],
            ['throttle_position', 'float', false],
            ['spark_dwell_time', 'float', false],
            ['barometric_pressure', 'float', false],
            ['intake_manifold_pressure', 'float', false],
            ['intake_manifold_temperature', 'float', false],
            ['cylinder_head_temperature', 'float', false],
            ['ignition_timing', 'float', false],
            ['injection_time', 'float', false],
            ['health', 'uint8_t', false],
            ['exhaust_gas_temperature', 'float', true],
            ['throttle_out', 'float', true],
            ['pt_compensation', 'float', true],
        ];
    }
}
exports.EfiStatus = EfiStatus;
