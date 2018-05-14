/* global GPIO */

load("api_gpio.js");

let RegisterGPI = {
    create: function (pin, pull) {

        GPIO.set_button_handler(pin, pull, GPIO.INT_EDGE_NEG, 200, function (x) {
            print('Button press, pin: ', x);
        }, null);

        return {
            pin: pin,

            get: function () {
                let value = GPIO.read(this.pin) === 1;
                this.observer.callback(value);
            }
        };
    }
};
