load("api_i2c.js");

let PCF8574 = {

    create: function(address, i2c) {

        return {
            address: address,
            i2c: i2c || I2C.get(),
            regWrite: 0xFF,

            read: function() {                
                let value = I2C.read(this.i2c, this.address, 1, true).at(0);
                print("pcf read", value);
                return value;
            },

            write: function(value) {
                print("pcf write", value);
                let x = I2C.write(this.i2c, this.address, chr(value), 1, true);
            },            

            createRegister: function(lsb, msb, initVal, logic) {
                if (msb === undefined) {
                    msb = lsb;
                }

                let register = {
                    lsb: lsb,
                    msb: msb,
                    pcf: this,
                    logic: logic === undefined? true: logic,

                    set: function(value) {

                        for (let b = 0; b < this.msb - this.lsb + 1; b++) {
                            let bv = value === null? 1: ((value >> b) & 1);
                            if (!this.logic) {
                                bv = ~bv & 1;
                            }                            
                            this.pcf.regWrite = this.pcf.regWrite & ~(1 << (b + this.lsb)) | (bv << (b + this.lsb));
                        }

                        this.pcf.write(this.pcf.regWrite);
                    },
                    get: function() {          
                        let v = this.pcf.read();                        
                        if (!this.logic) {
                            v = ~v;
                        }
                        let mask = ((1 << this.msb) << 1) - 1;
                        let regVal = (v & mask) >> this.lsb;
                        this.observer.callback(regVal);
                    }
                };

                register.set(initVal === undefined? 0: initVal);

                return register;
            }
        }
    }

}