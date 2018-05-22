load("api_i2c.js");
load("api_timer.js");

let RegisterLM75A = {

    create: function (address, i2c) {

        let register = {

            address: address,
            i2c: i2c || I2C.get(),            

            read: function () {

                let prevValue = this.value;

                let valueStr = I2C.read(this.i2c, this.address, 2, true);                
                
                if (valueStr !== null) {
                    
                    let msb = valueStr.at(0);
                    let lsb = valueStr.at(1);
                    
                    if (msb & 0x80) {
                        this.value = (((msb << 8 | lsb) >> 5) & 0x3FF) * 0.125 - 128;
                    } else {
                        this.value = (((msb << 8 | lsb) >> 5) & 0x3FF) * 0.125;
                    }              
                    
                } else {
                    this.value = undefined;
                }           

                if (this.value !== prevValue) {
                    this.get();
                }                
            },

            get: function () {
                this.observer.callback(this.value);
            }

        };

        Timer.set(1000, Timer.REPEAT, function (r) {
            r.read();
        }, register);


        return register;
    }
}