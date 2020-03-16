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
1. 
+ Add the function of download CSV file. 
+ Store all relative paramaters into the cookie.
+ Add button event to set off the downloading.
