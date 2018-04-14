/* global RegisterGPO, Register, RegisterDS18B20 */

load('api_config.js');
load("api_gpio.js");

load("api_df_reg.js");
load("api_df_reg_gpo.js");
load("api_df_reg_gpi.js");
load("api_df_reg_ds18b20.js");
load("api_df_pcf8574.js");

let blockingTemp = Cfg.get('heating.blockingTemp');
print("Blocking temperature is", blockingTemp, "oC");

let pcf = PCF8574.create(56);

let heatingReg = pcf.createRegister(0, 5, 0, false);

let heatingBlocked = false;

let heatingRegProxy = Register.add("Heating", {
    get: function() {
        heatingReg.get();
    },
    set: function(value) {
        if (heatingBlocked) {
            print("Heating blocked");
        } else {
            heatingReg.set(value);
        }
    }
});

heatingReg.observer = heatingRegProxy.observer;

Register.add("LED1", pcf.createRegister(6, 6, 1, false));

let led2 = Register.add("LED2", pcf.createRegister(7, 7, 0, false));

let tempReg = Register.add("Temp", RegisterDS18B20.create(4));

tempReg.observer = {
    origObserver: tempReg.observer,
    callback: function(temp) {
        heatingBlocked = temp >= blockingTemp;
        if (heatingBlocked) {
            heatingReg.set(0);
            led2.set(1);
        }
        this.origObserver.callback(temp);        
    }
}

Register.add("Tariff", RegisterGPI.create(5, GPIO.PULL_DOWN));