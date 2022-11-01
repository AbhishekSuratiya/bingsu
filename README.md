# **About AWS IOT Bingsu:**
AWS IOT Bingsu is a Mobile App which can transmit the mobile sensors data to an AWS Sitewise Dashboard in realtime.

# **AWS IOT Bingsu Components:**

## **1) Sensors:** 
Here is the list of all sensors with what each platform currently support:

|Sensor Name|Description|Unit|Available in IOS|Available in Android|
| :-: | :-: | :-: | :-: | :-: |
|Accelerometer(x,y,z)|x,y,z coordinate values|m/s2|YES|YES|
|Magnetometer(x,y,z)|x,y,z coordinate values|μT|YES|YES|
|Orientation(x,y,z)|x,y coordinate from gyroscope, z value from accelerometer|`	`m/s2, μT|YES|YES|
|Ambient Light|Intensity of light |Lux|NO|YES|
|Gyroscope(x,y,z)|x,y,z coordinate values|Degree/s|YES|YES|
|KVS Video Stream|Camera streaming in Portrait or Landscape||YES|YES|
|GPS Coordinates(Lat,Long)|Latitude and Longitude positions||YES|YES|
|Altitude|IOS: values above sea level<br>Android: values above the WGS 84 reference ellipsoid  |m|YES|YES|
|Barometer|Barometer sensor readings|hPa|YES|YES|
|Proximity|Shows whether sensor is active. When you hover over the screen near speaker, it will change to 1 means active.||YES|YES|
|Battery Level|Current Battery Level (0-100%)|Percent (%)|YES|YES|
|Wifi Status|Connected or Disconnected||YES|YES|
|Wifi Strength|Signal Strength|dBm|NO|YES|
|Cellular Details|Basic Cellular details like Cellular company, Generation, isExpensive||YES|YES|
|Cellular Strength|||NO|NO|
|CPU Usage|Current CPU usage ( it can exceed 100% due to multiple cores)|Percent|YES|YES|
|CPU Temperature|||NO|NO|

### **Points to remember:**
On some low end devices Barometer sensor may cause issues so for those lower models we may not see Barometer sensor in the APP.

## **2) Logs:** 
Two categories of Logs are present in the AWS IOT Bingsu APP:

### **AWS Generated Logs:**

- AWS Sitewise logs are on the following Path:



- API Gateway logs are on the following Path:



- Cloud Trail logs are on the following Path:





### **Custom Mobile APP Logs:**


All the logs from the Mobile APP are transmitted to cloud watch on the following Path:
![](Aspose.Words.94d56e75-e62c-487f-bdca-c5d71a3776d8.004.png)

Note: The part ‘/bingsu-v2-1’ may change as this is the name of the stack that we provide while uploading cloudformation template.


## **3) Video Streaming:**

KVS Video streaming is available on the following path:
![](Aspose.Words.94d56e75-e62c-487f-bdca-c5d71a3776d8.005.png)

**Note:** The part ‘/bingsu-v2-1’ may change as this is the name of the stack that we provide while uploading cloudformation template. The location url will be available from the output section in while uploading cloud formation template, For e.g:

![](Aspose.Words.94d56e75-e62c-487f-bdca-c5d71a3776d8.006.png)

`						`Fig 1

## **4) QR Code Scanning:**
The location url will be available from the output section while uploading cloud formation template, see Fig 1.

## **5) Dashboard:**
The location url will be available from the output section while uploading cloud formation template, see Fig 1.



