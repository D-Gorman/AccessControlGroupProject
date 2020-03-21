# AccessControlGroupProject
Shared code repository for the group 2 security and resilience project on access control

# PartOfLogin
## Version 1.0
1. Function of Login UI. 
2. Connection between Page of Login and Page of occupant/researcher/both.

### Structure of Project
![image](https://github.com/D-Gorman/AccessControlGroupProject/blob/PartOfLogin/Structure_of_Project.jpeg)

## Version 2.0
1. Fix the structure of Page of DataRequestForm(only for researcher)
2. In the Page of DataRequestForm:

   1. It will be partly filled with all known data(un-editable) from the db about the researchers(id, name, role...).
   2. Complete the function of submitting the data requests. Plus, all the records will be inserted into db table data_request_log.
  
## Version 3.0
1. Add the function of download CSV file.    From Danial
+ Store all relative paramaters into the cookie.
+ Add button event to set off the downloading.

## Version 3.1
1. Add the function of log(all previous data requests).  From Kou
+ "/log" for researcher; 
+ "/RoomAccessDataLog" for occupant;

2. Add the function of setting up data policies.    From Natalie
+ Fix some problems:

   1. Fix the UI
   2. Set the "location" unable to be changed. 
   3. Add a selection about "role".
  
## Version 3.2
1. Fix some problem about "log"
+ Remove unnecessary code and streamline programs.
+ When there is no previous records, the website will be unavailable. Add callback("Empty record about the requests") to deal with this bug.

2. Fix some bug about "update policies"
+ Connecting to the database is performed asynchronously in js, so using callback when we need to iterative access to the database.

3. Add a table to display the occupant's current data access policy in the page of occupant.

## Version 3.4
1. Rename the file "Updata" to "UpdatePolicy".
2. DataRequestForm: 
+ Add the function of making judgment for data request.    From Steve
+ Change the UI of download, add a table to display the result of requests.
+ Fix some problem of the DataRequestForm.

   1. Add one more limit about the request time, "the end date could not be later than today".
   2. Users will submit requests for different kinds of data at the same time, so the judgment should be able to provide divided results for the group of requests. Utilizing the loop and callback to avoid asynchronism and solve this problem.
   
      + No policies for all data requests.    -->   jump to /researcher
      + All requests are denied.              -->   jump to /researcher
      + At last one request is accepted.      -->   jump to /download

3. Add the sql file, showing the structure of the database.

## Version 3.5
1. Fix the appearance of /login and /jump
2. Update database .sql file. Replace the row "password" with "hash_pwd" in table "loginInfo".
