EESchema Schematic File Version 2
LIBS:power
LIBS:device
LIBS:switches
LIBS:relays
LIBS:motors
LIBS:transistors
LIBS:conn
LIBS:linear
LIBS:regul
LIBS:74xx
LIBS:cmos4000
LIBS:adc-dac
LIBS:memory
LIBS:xilinx
LIBS:microcontrollers
LIBS:dsp
LIBS:microchip
LIBS:analog_switches
LIBS:motorola
LIBS:texas
LIBS:intel
LIBS:audio
LIBS:interface
LIBS:digital-audio
LIBS:philips
LIBS:display
LIBS:cypress
LIBS:siliconi
LIBS:opto
LIBS:atmel
LIBS:contrib
LIBS:valves
LIBS:device.farm
EELAYER 25 0
EELAYER END
$Descr A4 11693 8268
encoding utf-8
Sheet 1 1
Title ""
Date ""
Rev ""
Comp ""
Comment1 ""
Comment2 ""
Comment3 ""
Comment4 ""
$EndDescr
$Comp
L LM75A U1
U 1 1 5AF99E87
P 6300 2850
F 0 "U1" H 6450 3150 60  0000 C CNN
F 1 "LM75A" H 6500 2550 60  0000 C CNN
F 2 "Housings_SOIC:SOIC-8_3.9x4.9mm_Pitch1.27mm" H 6300 2850 60  0001 C CNN
F 3 "" H 6300 2850 60  0000 C CNN
	1    6300 2850
	1    0    0    -1  
$EndComp
$Comp
L I2C X1
U 1 1 5AF99EF6
P 4800 2800
F 0 "X1" H 4800 3150 60  0000 C CNN
F 1 "I2C" H 4800 2450 60  0000 C CNN
F 2 "device.farm:Micro-Match-FOB-4" H 4950 2950 60  0001 C CNN
F 3 "" H 4950 2950 60  0001 C CNN
	1    4800 2800
	1    0    0    -1  
$EndComp
$Comp
L VCC #PWR01
U 1 1 5AF99F97
P 5150 2600
F 0 "#PWR01" H 5150 2450 50  0001 C CNN
F 1 "VCC" H 5150 2750 50  0000 C CNN
F 2 "" H 5150 2600 50  0001 C CNN
F 3 "" H 5150 2600 50  0001 C CNN
	1    5150 2600
	0    1    1    0   
$EndComp
$Comp
L VCC #PWR02
U 1 1 5AF99FB1
P 6300 2450
F 0 "#PWR02" H 6300 2300 50  0001 C CNN
F 1 "VCC" H 6300 2600 50  0000 C CNN
F 2 "" H 6300 2450 50  0001 C CNN
F 3 "" H 6300 2450 50  0001 C CNN
	1    6300 2450
	1    0    0    -1  
$EndComp
$Comp
L GND #PWR03
U 1 1 5AF99FC2
P 5150 3000
F 0 "#PWR03" H 5150 2750 50  0001 C CNN
F 1 "GND" H 5150 2850 50  0000 C CNN
F 2 "" H 5150 3000 50  0001 C CNN
F 3 "" H 5150 3000 50  0001 C CNN
	1    5150 3000
	0    -1   -1   0   
$EndComp
$Comp
L GND #PWR04
U 1 1 5AF99FDA
P 6300 3250
F 0 "#PWR04" H 6300 3000 50  0001 C CNN
F 1 "GND" H 6300 3100 50  0000 C CNN
F 2 "" H 6300 3250 50  0001 C CNN
F 3 "" H 6300 3250 50  0001 C CNN
	1    6300 3250
	1    0    0    -1  
$EndComp
Wire Wire Line
	5150 2750 5850 2750
Wire Wire Line
	5150 2850 5850 2850
$Comp
L GS3 A2
U 1 1 5AF9A1BB
P 7000 3350
F 0 "A2" H 7050 3550 50  0000 C CNN
F 1 "GS3" H 7050 3151 50  0000 C CNN
F 2 "Connectors:GS3" V 7088 3276 50  0001 C CNN
F 3 "" H 7000 3350 50  0001 C CNN
	1    7000 3350
	-1   0    0    1   
$EndComp
$Comp
L GS3 A1
U 1 1 5AF9A20D
P 7000 2850
F 0 "A1" H 7050 3050 50  0000 C CNN
F 1 "GS3" H 7050 2651 50  0000 C CNN
F 2 "Connectors:GS3" V 7088 2776 50  0001 C CNN
F 3 "" H 7000 2850 50  0001 C CNN
	1    7000 2850
	-1   0    0    1   
$EndComp
$Comp
L GS3 A0
U 1 1 5AF9A239
P 7000 2350
F 0 "A0" H 7050 2550 50  0000 C CNN
F 1 "GS3" H 7050 2151 50  0000 C CNN
F 2 "Connectors:GS3" V 7088 2276 50  0001 C CNN
F 3 "" H 7000 2350 50  0001 C CNN
	1    7000 2350
	-1   0    0    1   
$EndComp
Wire Wire Line
	6850 2350 6750 2350
Wire Wire Line
	6750 2350 6750 2750
Wire Wire Line
	6750 2950 6750 3350
Wire Wire Line
	6750 3350 6850 3350
Wire Wire Line
	6750 2850 6850 2850
$Comp
L VCC #PWR05
U 1 1 5AF9A436
P 7150 2250
F 0 "#PWR05" H 7150 2100 50  0001 C CNN
F 1 "VCC" H 7150 2400 50  0000 C CNN
F 2 "" H 7150 2250 50  0001 C CNN
F 3 "" H 7150 2250 50  0001 C CNN
	1    7150 2250
	0    1    1    0   
$EndComp
$Comp
L VCC #PWR06
U 1 1 5AF9A450
P 7150 2750
F 0 "#PWR06" H 7150 2600 50  0001 C CNN
F 1 "VCC" H 7150 2900 50  0000 C CNN
F 2 "" H 7150 2750 50  0001 C CNN
F 3 "" H 7150 2750 50  0001 C CNN
	1    7150 2750
	0    1    1    0   
$EndComp
$Comp
L VCC #PWR07
U 1 1 5AF9A46A
P 7150 3250
F 0 "#PWR07" H 7150 3100 50  0001 C CNN
F 1 "VCC" H 7150 3400 50  0000 C CNN
F 2 "" H 7150 3250 50  0001 C CNN
F 3 "" H 7150 3250 50  0001 C CNN
	1    7150 3250
	0    1    1    0   
$EndComp
$Comp
L GND #PWR08
U 1 1 5AF9A484
P 7150 2450
F 0 "#PWR08" H 7150 2200 50  0001 C CNN
F 1 "GND" H 7150 2300 50  0000 C CNN
F 2 "" H 7150 2450 50  0001 C CNN
F 3 "" H 7150 2450 50  0001 C CNN
	1    7150 2450
	0    -1   -1   0   
$EndComp
$Comp
L GND #PWR09
U 1 1 5AF9A49E
P 7150 2950
F 0 "#PWR09" H 7150 2700 50  0001 C CNN
F 1 "GND" H 7150 2800 50  0000 C CNN
F 2 "" H 7150 2950 50  0001 C CNN
F 3 "" H 7150 2950 50  0001 C CNN
	1    7150 2950
	0    -1   -1   0   
$EndComp
$Comp
L GND #PWR010
U 1 1 5AF9A4B8
P 7150 3450
F 0 "#PWR010" H 7150 3200 50  0001 C CNN
F 1 "GND" H 7150 3300 50  0000 C CNN
F 2 "" H 7150 3450 50  0001 C CNN
F 3 "" H 7150 3450 50  0001 C CNN
	1    7150 3450
	0    -1   -1   0   
$EndComp
NoConn ~ 5850 2950
$Comp
L PWR_FLAG #FLG011
U 1 1 5AF9A867
P 5450 1800
F 0 "#FLG011" H 5450 1875 50  0001 C CNN
F 1 "PWR_FLAG" V 5450 2100 50  0000 C CNN
F 2 "" H 5450 1800 50  0001 C CNN
F 3 "" H 5450 1800 50  0001 C CNN
	1    5450 1800
	0    1    1    0   
$EndComp
$Comp
L PWR_FLAG #FLG012
U 1 1 5AF9A888
P 5450 1950
F 0 "#FLG012" H 5450 2025 50  0001 C CNN
F 1 "PWR_FLAG" V 5450 2250 50  0000 C CNN
F 2 "" H 5450 1950 50  0001 C CNN
F 3 "" H 5450 1950 50  0001 C CNN
	1    5450 1950
	0    1    1    0   
$EndComp
$Comp
L VCC #PWR013
U 1 1 5AF9A89F
P 5450 1800
F 0 "#PWR013" H 5450 1650 50  0001 C CNN
F 1 "VCC" V 5450 2000 50  0000 C CNN
F 2 "" H 5450 1800 50  0001 C CNN
F 3 "" H 5450 1800 50  0001 C CNN
	1    5450 1800
	0    -1   -1   0   
$EndComp
$Comp
L GND #PWR014
U 1 1 5AF9A8BD
P 5450 1950
F 0 "#PWR014" H 5450 1700 50  0001 C CNN
F 1 "GND" V 5450 1750 50  0000 C CNN
F 2 "" H 5450 1950 50  0001 C CNN
F 3 "" H 5450 1950 50  0001 C CNN
	1    5450 1950
	0    1    1    0   
$EndComp
Text Label 5500 2750 0    60   ~ 0
SDA
Text Label 5500 2850 0    60   ~ 0
SCL
$EndSCHEMATC