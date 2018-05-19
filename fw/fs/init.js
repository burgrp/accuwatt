/* global RegisterGPO, Register, RegisterDS18B20 */

load('api_config.js');
load("api_gpio.js");
load("api_timer.js");
load("api_i2c.js");

load("api_df_pcf8574.js");

load("api_df_reg.js");
load("api_df_reg_gpo.js");
load("api_df_reg_cfg.js");


let regTarget = Register.add("target", RegisterConfig.create("heating.target", function(value) {
    return {
        heating: {
            target: value
        }
    };
}));

let regHttd = Register.add("httd", RegisterConfig.create("heating.httd", function(value) {
    return {
        heating: {
            httd: value
        }
    };
}));

let regEnabled = Register.add("enabled", RegisterConfig.create("heating.enabled", function(value) {
    return {
        heating: {
            enabled: value
        }
    };
}));

let i2c = I2C.get();

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

Timer.set(tickMs, Timer.REPEAT, function(ctx) {
    
    let highTariff = GPIO.read(pinTariff) === 1;
    print("HIGH TARIFF", highTariff);

    let temp = 19;
    print("TEMP", temp);

    let enabled = regEnabled.value;
    print("ENABLED", enabled);
    
    let channels;
    
    if (enabled || temp !== undefined) {

        let target = regTarget.value;
        print("TARGET", target);
    
        if (highTariff) {
            let httd = regHttd.value;
            print("High tariff, decreasing target by", httd);
            target -= httd;
        }
        print("TARGET", target);
    
        channels = (target - temp) * 3; // 3 channels / degree
        if (channels > 6) {
            channels = 6;
        }
        if (channels < 0) {
            channels = 0;
        }

    } else {
        channels = 0;
    }

    print("CHANNELS", channels);

    let pcfWrite = 0;

    for (let c = 0; c < 6; c++) {
        pcfWrite |= (channels > c? 0: 1) << (portRelay + c);
    }
    

    //pcfWrite |= 1 << portLed2;
    pcf.write(pcfWrite);

}, null);