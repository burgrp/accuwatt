import mqtt_call
import time
from machine import I2C, Pin, PWM

import sys
sys.path.append('/')
import site_config

print('DO6TS1A')

i2c = I2C(0, scl=Pin(site_config.temp_scl), sda=Pin(site_config.temp_sda), freq=100000)
pwm = list(map(lambda ch: PWM(Pin(ch), freq=50000, duty=0), site_config.channels))

last_error = None
last_temperature = None

class Handler:

    # def __init__(self):

    def export_get_status(self):
        return {
            "rssi": server.mqtt_client._sta_if.status('rssi'),
            "ip": server.mqtt_client._sta_if.ifconfig()[0],
            "channels": site_config.channels,
            "error": last_error
        }


server = mqtt_call.Server(
    handler=Handler(),
    name=site_config.name,
    wifi_ssid=site_config.wifi_ssid,
    wifi_password=site_config.wifi_password,
    mqtt_broker=site_config.mqtt_broker,
    ledPin=site_config.wifi_led_pin,
    debug=site_config.debug
)

server.dump()
server.start(background=True)



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

    time.sleep_ms(site_config.period_ms)
