import mqtt_reg
import time
from machine import I2C, Pin, PWM, WDT
import gc

import sys
sys.path.append('/')
import site_config
import board_config

print('DO6TS1A')

i2c = I2C(0, scl=Pin(board_config.temp_scl), sda=Pin(board_config.temp_sda), freq=100000)
pwms = list(map(lambda ch: PWM(Pin(ch), freq=board_config.pwm_frequency, duty=0), board_config.channels))
wifi_led = Pin(board_config.wifi_led_pin, Pin.OUT)

reg_prefix = site_config.name + '.'
reg_device = site_config.name

class ExtChannelRegister(mqtt_reg.ServerRegister):
    def __init__(self, index):

        self.timeOut = None

        super().__init__(
            name = reg_prefix + "ext." + str(index + 1),
            meta = {
                "device": reg_device,
                "type": "number"
            },
            value = 0
        )

    def set_value(self, value):

        print("Setting ext channel to", value)
        if not (isinstance(value, float) or isinstance(value, int)) or value < 0 or value > 1:
            value = 0

        self.value = value
        self.timeOut = time.ticks_ms() + board_config.ext_channel_timeout_ms

class IntChannelRegister(mqtt_reg.ServerReadOnlyRegister):
    def __init__(self, index):

        self.timeOut = None

        super().__init__(
            name = reg_prefix + "int." + str(index + 1),
            meta = {
                "device": reg_device,
                "type": "number"
            },
            value = 0
        )


reg_enabled = mqtt_reg.BooleanPersistentServerRegister(
    name = reg_prefix + 'enabled',
    meta = {
        "device": reg_device,
        "type": "boolean"
    },
    default = True
)

reg_temp_min = mqtt_reg.FloatPersistentServerRegister(
    name = reg_prefix + 'temp.min',
    meta = {
        "device": reg_device,
        "type": "number",
        "unit": "°C"
    },
    default = 5
)

reg_temp_max = mqtt_reg.FloatPersistentServerRegister(
    name = reg_prefix + 'temp.max',
    meta = {
        "device": reg_device,
        "type": "number",
        "unit": "°C"
    },
    default = 50
)

reg_temp_act = mqtt_reg.ServerReadOnlyRegister(
    name = reg_prefix + 'temp.act',
    meta = {
        "device": reg_device,
        "type": "number",
        "unit": "°C"
    },
    value = None
)

regs_channels_ext = list(map(lambda e: ExtChannelRegister(e[0]), enumerate(board_config.channels)))
regs_channels_int = list(map(lambda e: IntChannelRegister(e[0]), enumerate(board_config.channels)))

registry = mqtt_reg.Registry(
    wifi_ssid=site_config.wifi_ssid,
    wifi_password=site_config.wifi_password,
    mqtt_broker=site_config.mqtt_broker,
    online_cb= lambda online: wifi_led.value(1 if online else 0),
    debug=board_config.debug,
    server=[
        reg_enabled,
        reg_temp_min,
        reg_temp_max,
        reg_temp_act,
    ]
    + regs_channels_ext
    + regs_channels_int
)

registry.start(background=True)

wdt = WDT(timeout=board_config.watchdog_ms)

while True:

    # check external channel timeouts
    now = time.ticks_ms()
    for reg in regs_channels_ext:
        if reg.timeOut is not None and now > reg.timeOut:
            print("External channel timeout, setting to zero")
            try:
                reg.set_value_local(0)
            except Exception as e:
                print("Error setting external channel to zero:", e)
            reg.timeOut = None

    # read temperature
    try:
        avgSum = 0
        avgCnt = 0
        for i in range(0, 5):
            temp = i2c.readfrom(board_config.temp_address, 2)
            temp = round(int.from_bytes(temp, 'big', True) / 256, 1)
            avgSum += temp
            avgCnt += 1

        reg_temp_act.set_value_local(round(avgSum / avgCnt, 1))

    except Exception as e:
        print("Error reading temperature:", e)
        reg_temp_act.set_value_local(None)

    enabled = reg_enabled.get_value()
    temp_act = reg_temp_act.get_value()
    temp_min = reg_temp_min.get_value()
    temp_max = reg_temp_max.get_value()

    # set PWMs
    for [i, pwm] in enumerate(pwms):
        reg_int = regs_channels_int[i]
        reg_ext = regs_channels_ext[i]

        duty = 0
        if enabled and temp_act is not None and temp_min is not None:
            duty = min(max((temp_min - temp_act) * board_config.regulation_proportional, 0), 1)

            if temp_max is not None:
                max_duty = min(max((temp_max - temp_act) * board_config.regulation_proportional, 0), 1)
                duty = min(max(duty, reg_ext.get_value()), max_duty)

        duty = round(duty, 2)

        pwm.duty(int(duty * 1023))

        try:
            reg_int.set_value_local(duty)
        except Exception as e:
            print("Error setting internal channel:", e)


    #gc.collect()

    if board_config.debug:
        print("Temperature:", temp_act)
        print("PWM:", list(map(lambda r: r.get_value(), regs_channels_int)))
        print("Free RAM:", gc.mem_free())

    time.sleep_ms(board_config.loop_period_ms)
    wdt.feed()
