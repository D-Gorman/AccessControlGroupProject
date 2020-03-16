# AccessControlGroupProject
Shared code repository for the group 2 security and resilience project on access control

# PartOfLogin
## Version 1.0
1. Function of Login UI. 
2. Connection between Page of Login and Page of occupant/researcher/both.

### Structure of PartOfLogin
![image](https://github.com/D-Gorman/AccessControlGroupProject/blob/PartOfLogin/StructureOfLogin.png)

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
