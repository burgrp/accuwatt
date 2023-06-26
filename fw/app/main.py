import mqtt_reg
import time
from machine import I2C, Pin, PWM, Timer

import sys
sys.path.append('/')
import site_config

print('DO6TS1A')

i2c = I2C(0, scl=Pin(site_config.temp_scl), sda=Pin(site_config.temp_sda), freq=100000)
pwm = list(map(lambda ch: PWM(Pin(ch), freq=50000, duty=0), site_config.channels))
wifi_led = Pin(site_config.wifi_led_pin, Pin.OUT)

last_error = None
last_temperature = None

reg_prefix = site_config.name + '.'
reg_device = site_config.name

def extChannelsTimeout(_):
    print("External channels timeout, setting all to zero")
    global regs_channels_ext
    for reg in regs_channels_ext:
        try:
            reg.set_value_local(0)
        except Exception as e:
            print("Error setting ext register to zero:", e)

ext_channels_timer = None

def resetExtChannelsTimer():

    global ext_channels_timer

    if ext_channels_timer is not None:
        ext_channels_timer.deinit()

    ext_channels_timer = Timer(0, mode=Timer.ONE_SHOT, period=site_config.ext_channel_timeout_ms, callback=extChannelsTimeout)

class ExtChannelRegister(mqtt_reg.ServerRegister):
    def __init__(self, index):
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
            raise ValueError("Value must be a number between 0 and 1")

        self.value = value
        resetExtChannelsTimer()

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

regs_channels_ext = list(map(lambda e: ExtChannelRegister(e[0]), enumerate(site_config.channels)))

registry = mqtt_reg.Registry(
    wifi_ssid=site_config.wifi_ssid,
    wifi_password=site_config.wifi_password,
    mqtt_broker=site_config.mqtt_broker,
    online_cb= lambda online: wifi_led.value(1 if online else 0),
    debug=site_config.debug,
    server=[
        reg_enabled,
        reg_temp_min,
        reg_temp_max,
    ] + regs_channels_ext
)

registry.start(background=True)

while True:
    try:
        print("loop")

        try:
            temp = i2c.readfrom(site_config.temp_address, 2)
            last_temperature = (temp[0] << 8 | temp[1]) >> 5
        except Exception as e:
            last_temperature = None
            raise e

        last_error = None
    except Exception as e:
        last_error = e
        print("Error in the loop:", e)

    print("Temperature:", last_temperature)

    time.sleep_ms(site_config.loop_period_ms)
