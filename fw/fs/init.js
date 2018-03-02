/* global RegisterGPO, Register, RegisterDS18B20 */

load("api_df_reg.js");
load("api_df_reg_gpo.js");
load("api_df_reg_ds18b20.js");

Register.add("Relay", RegisterGPO.create(4));
Register.add("LED", RegisterGPO.create(5));
Register.add("Temp", RegisterDS18B20.create(12));
