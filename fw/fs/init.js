/* global RegisterGPO, Register, RegisterDS18B20 */

load("api_config.js");
load("api_gpio.js");
load("api_timer.js");
load("api_i2c.js");

load("api_df_reg.js");
load("api_df_reg_gpo.js");
load("api_df_reg_cfg.js");
load("api_df_reg_var.js");
load("api_df_reg_lm75a.js");
load("api_df_reg_pcf8574.js");
load("api_df_reboot.js");

let i2c = I2C.get();

let regPrefix = Cfg.get("heating.prefix");

let regTarget = Register.add(regPrefix + "target", RegisterConfig.create("heating.target", function (value) {
    return {
        heating: {
            target: value
        }
    };
}));

let regHttd = Register.add(regPrefix + "httd", RegisterConfig.create("heating.httd", function (value) {
    return {
        heating: {
            httd: value
        }
    };
}));

let regEnabled = Register.add(regPrefix + "enabled", RegisterConfig.create("heating.enabled", function (value) {
    return {
        heating: {
            enabled: value
        }
    };
}));

let regMaxChannels = Register.add(regPrefix + "maxchannels", RegisterConfig.create("heating.channels", function (value) {
    if (value > 6) value = 6;
    if (value < 0) value = 0;
    return {
        heating: {
            channels: value
        }
    };
}));


let regTemp = Register.add(regPrefix + "temp", RegisterLM75A.create(0x48, i2c));

let regTariff = Register.add(regPrefix + "tariff", RegisterVariable.create(undefined));
let regChannels = Register.add(regPrefix + "channels", RegisterVariable.create(undefined));

let pcfAddress = Cfg.get("heating.pcf8574");
print("PCF8574 address", pcfAddress);
let pcf = PCF8574.create(pcfAddress, i2c);

let portRelay = Cfg.get("heating.relay");
print("First relay PCF8574 port number", portRelay);

let portLed1 = Cfg.get("heating.led1");
print("LED1 PCF8574 port number", portLed1);

let portLed2 = Cfg.get("heating.led2");
print("LED2 PCF8574 port number", portLed2);

let pinTariff = Cfg.get("heating.tariff");
print("Tariff sensor on pin", pinTariff);

let tickMs = Cfg.get("heating.tickms");
print("Tick period set to", tickMs, "ms");

GPIO.set_mode(pinTariff, GPIO.MODE_INPUT);
GPIO.set_pull(pinTariff, GPIO.PULL_DOWN);

let actLed = true;

Reboot.after(10);

Timer.set(tickMs, Timer.REPEAT, function () {

    let highTariff = GPIO.read(pinTariff) === 0;

    print("HIGH TARIFF", highTariff);
    regTariff.setLocal(highTariff);

    let temp = regTemp.value;
    print("TEMP", temp);

    let enabled = regEnabled.value;
    print("ENABLED", enabled);

    let channels;

    let target = regTarget.value;
    if (target > 90) {
        target = 90;
    }
    print("TARGET", target);

    // LM75A sensor sometimes reads as 0, probably due to bad I2C timing.
    // We check for a minimum temperature to identify this error condition.
    if (temp < 2) {
        print("TEMP too low! Is I2C broken?");
        temp = undefined;
    }

    if (enabled && temp !== undefined) {

        if (highTariff) {
            let httd = regHttd.value;
            print("High tariff, decreasing target by", httd);
            target -= httd;
        }

        channels = Math.round((target - temp) * 3); // 3 channels / degree
        if (channels > regMaxChannels.value) {
            channels = regMaxChannels.value;
        }
        if (channels < 0) {
            channels = 0;
        }

        actLed = !actLed;

    } else {
        channels = 0;
        actLed = true;
    }

    print("CHANNELS", channels);
    regChannels.setLocal(channels);

    let pcfWrite = 0;

    for (let c = 0; c < 6; c++) {
        pcfWrite |= (channels > c ? 0 : 1) << (portRelay + c);
    }

    pcfWrite |= (highTariff ? 0 : 1) << portLed2;
    pcfWrite |= (actLed ? 0 : 1) << portLed1;

    pcf.write(pcfWrite);

}, null);