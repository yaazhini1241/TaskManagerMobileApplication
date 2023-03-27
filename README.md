# TaskManagerMobileApplication

This is a task manager mobile application. It is created using react-native.
I have explained the steps to follow to successfully run this app.

## Steps 

1. Download the necessary applications and tools needed to run this app.
   I used:
   - XAMPP Control Panel App ( To create and connect to MySQL Database )
   - Android Studio ( To run the and display the app in a mobile environment )
   - Atom and local command prompts ( To do the coding of the app. Users can use any other code editors to their preferences as long as it is compatible )
   
2. First connect the database.
   - Open the XAMPP Control Panel App and start the 'Apache' and 'MySQL' services in this order. 
   - Establish a database connection by calling the below command in the terminal of the node file
      ```bash
      node app.js
      ```
3. Then Run the app.
   - Open the terminal of the task file and enter the following commands
     ```bash
      npm install
      ```
      ```bash
      expo start
      ```
   - Check that the IP address displayed in the terminal matches the URL in the 'api.js' page. If it does not match, remember to copy paste the IP address into the            'api.js' page to replace it.

App will successfully run.
