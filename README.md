# Lab-Management

DESCRIPTION

This software is a webbsite based booking system where you can set up and manage booking and returning equipment in, for example, a lab or whatever you have that can be booked and returned. The software forces users to create their own login in order to book items. The software then keeps track of whats booked when it got returned and who has booked what.

FEATURES

The working features in this programe is a database with built in tables and procedures. The database stores all the information that JavaScript then precents on the website. 
On the website you will be able to see a homepage, you can see all the equipment that is in the database (eaven the booked ones), you are able to add items to the database through the webpage. If any equipment is broken or damaged you can edit their status under the tab "Edit Equipment". Under the tab "My Profile" you will be able to se your profile and what your id is and what mail you signed up with. It is also here where you can book the available equipment on the site, all available equipment can be seen under "Book Equipment". Under "My Bookings" you are able to manage your booked equipment and return those through here. Under the tab "Log" there you can se exactly everything that is currently booked and when things are scheduled to be returned and when it have been returned.

HOW TO SETUP AND RUN

In order to get the software working you need to download all the files into a repository somewhere on your computer. To set up the database you need to have MySql dowwnloaded and working on your computer (make sure you also have MySql workbench installed). Once you have made sure MySql is working then you need to run the setup.sql. This will create the database (easiest way to do this is through MySql workbench). Then once the setup is done you need to run the file ddl.sql (this will create all the tables and procedures).
After the database is setup you need to open the repository in a code editor (preferably Visual studio code). In the terminal you then run the folowing command:

npm install

this will download all the packages needed to run the website. Once that is done you are ready to start up the website by typing in

node index.js

into the terminal. And there you have it, now start your prefeard browser and in the top searchbar write: localhost:1337. This will take you to the loginpage.
