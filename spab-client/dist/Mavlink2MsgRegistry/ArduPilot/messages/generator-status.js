"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeneratorStatus = void 0;
const node_mavlink_1 = require("@ifrunistuttgart/node-mavlink");
/*
Telemetry of power generation system. Alternator or mechanical generator.
*/
// status Status flags. uint64_t
// generator_speed Speed of electrical generator or alternator. UINT16_MAX: field not provided. uint16_t
// battery_current Current into/out of battery. Positive for out. Negative for in. NaN: field not provided. float
// load_current Current going to the UAV. If battery current not available this is the DC current from the generator. Positive for out. Negative for in. NaN: field not provided float
// power_generated The power being generated. NaN: field not provided float
// bus_voltage Voltage of the bus seen at the generator, or battery bus if battery bus is controlled by generator and at a different voltage to main bus. float
// rectifier_temperature The temperature of the rectifier or power converter. INT16_MAX: field not provided. int16_t
// bat_current_setpoint The target battery current. Positive for out. Negative for in. NaN: field not provided float
// generator_temperature The temperature of the mechanical motor, fuel cell core or generator. INT16_MAX: field not provided. int16_t
// runtime Seconds this generator has run since it was rebooted. UINT32_MAX: field not provided. uint32_t
// time_until_maintenance Seconds until this generator requires maintenance.  A negative value indicates maintenance is past-due. INT32_MAX: field not provided. int32_t
class GeneratorStatus extends node_mavlink_1.MAVLinkMessage {
    constructor() {
        super(...arguments);
        this._message_id = 373;
        this._message_name = 'GENERATOR_STATUS';
        this._crc_extra = 117;
        this._message_fields = [
            ['status', 'uint64_t', false],
            ['battery_current', 'float', false],
            ['load_current', 'float', false],
            ['power_generated', 'float', false],
            ['bus_voltage', 'float', false],
            ['bat_current_setpoint', 'float', false],
            ['runtime', 'uint32_t', false],
            ['time_until_maintenance', 'int32_t', false],
            ['generator_speed', 'uint16_t', false],
            ['rectifier_temperature', 'int16_t', false],
            ['generator_temperature', 'int16_t', false],
        ];
    }
}
exports.GeneratorStatus = GeneratorStatus;
