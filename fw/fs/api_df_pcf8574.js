load("api_i2c.js");

let PCF8574 = {

    create: function(address) {

        return {
            address: address,
            i2c: I2C.get(),
            regWrite: 0xFF,

            read: function() {                
                //let value = I2C.read(this.i2c, this.address, 1, true).at(0);
                //print("READ", value);
                return -1;//value;
            },

            write: function(value) {
                print("WRITE", value);
                print(JSON.stringify(this));
                let x = I2C.write(this.i2c, this.address, chr(value), 1, true);
                print("RESULT", x);
            },            

            createRegister: function(lsb, msb) {
                if (msb === undefined) {
                    msb = lsb;
                }
                print(">>>> Register", lsb, msb);

                let register = {
                    lsb: lsb,
                    msb: msb,
                    pcf: this,

                    set: function(value) {
                        
                        // for (let b = 0; b < this.msb - this.lsb + 1; b++) {
                        //     let bv = value === null? 1: ((value >> b) & 1);
                        //     this.pcf.regWrite = this.pcf.regWrite & ~(1 << (b + this.lsb)) | (bv << (b + this.lsb));
                        // }

                        this.pcf.write(value);//this.pcf.regWrite);
                    },
                    get: function() {          
                        // let v = this.pcf.read();                        
                        // let mask = ((1 << this.msb) << 1) - 1;
                        // this.observer.callback((v & mask) >> this.lsb);
                    }
                };

                return register;
            }
        }
    }

}