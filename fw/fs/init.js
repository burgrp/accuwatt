/* global RegisterGPO, Register, RegisterDS18B20 */

load("api_df_reg.js");
load("api_df_reg_gpo.js");
//load("api_df_reg_ds18b20.js");

load("api_df_pcf8574.js");

let pcf = PCF8574.create(56);

Register.add("Heating", pcf.createRegister(0, 5));
Register.add("LED1", pcf.createRegister(6));
Register.add("LED2", pcf.createRegister(7));
//Register.add("Temp", RegisterDS18B20.create(4));
