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

![image](https://user-images.githubusercontent.com/114899075/199219755-8074ad1e-e9a3-47c2-bc5a-b863320608d8.png)


- API Gateway logs are on the following Path:

![image](https://user-images.githubusercontent.com/114899075/199219867-52694a5c-6c38-4339-98a0-4a9693ed46ee.png)


- Cloud Trail logs are on the following Path:

![image](https://user-images.githubusercontent.com/114899075/199219903-ed62330f-4fa7-4626-ac90-018654cfeb29.png)



### **Custom Mobile APP Logs:**


All the logs from the Mobile APP are transmitted to cloud watch on the following Path:

![image](https://user-images.githubusercontent.com/114899075/199219968-6ea00195-1781-48f3-b685-bd5a75374bbf.png)


**Note:** The part ‘/bingsu-v2-1’ may change as this is the name of the stack that we provide while uploading cloudformation template.


## **3) Video Streaming:**

KVS Video streaming is available on the following path:

![image](https://user-images.githubusercontent.com/114899075/199220016-136b5e9c-dc25-4795-804e-ab7b53211c3a.png)



**Note:** The part ‘/bingsu-v2-1’ may change as this is the name of the stack that we provide while uploading cloudformation template. The location url will be available from the output section in while uploading cloud formation template, For e.g:

![image](https://user-images.githubusercontent.com/114899075/199220075-861296a5-aafe-4ce5-aa06-8fdc237e4bf2.png)

<div align="center">Fig 1</div>

## **4) QR Code Scanning:**
The location url will be available from the output section while uploading cloud formation template, see Fig 1.

## **5) Dashboard:**
The location url will be available from the output section while uploading cloud formation template, see Fig 1.



