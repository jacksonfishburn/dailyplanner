# Daily Planner

## Specification

### Elevator Pitch

A quick and easy way to plan out your day! Write down and save your todo items and how long they will take you. Once the day comes to get it done, simply drag and drop the item into the time slot you plan on doing it. There will be two lists holding different types of items: frequent items that will never be removed from the list no matter how many times you plan them, and one time todo items which will no longer be in the list once they are planned. This will make it super easy to plan all parts of your day, things like going to the gym or going to class can be on the frequent list, and things like a friends birthday party, an event or even just an uncommon chore can be on the todo list. This makes for effortless productivity and time management!

### Design

![Website Design](assets/Design.png)

### Key Features
* Secure login over HTTPS
* Persistent user accounts with saved todo items and schedules
* Add, edit, and remove todo items categorized as recurring or one-time
* Drag-and-drop interface for building a daily schedule
* Automatic removal of one-time items once scheduled
* Reusable recurring items that can be scheduled multiple times
* Visual representation of a full day broken into time blocks
* Schedule data saved and restored on refresh or re-login

### Technologies

* HTML - Structure the application. 
* CSS - Stylize pages, animate drag and drop. Ensure clean spacing and consistent color choices.
* React - Provides UI for login and schedule display. Handles drag and drop logic. 
* Service - Register users and verify login. Retrieve user data to display correct todo items. 
* Database - Store authentication information, users, and user data including items and schedules. 
* WebSocket - Broadcast real-time schedule updates across an account on multiple devices.
---
## HTML Deliverable

For this deliverable I built out the structure of my application using HTML.
* I completed the prerequisites for this deliverable (Simon deployed, GitHub link, Git commits)
* HTML pages - 4 HTML pages that represent the ability to login, make a schedule, add items to the todo lists, and document application purposes.
* Proper HTML element usage - Used nav, lists, buttons, tables and more where applicable.
* Links - The login page links to the Plan Day page. The Plan Day page has an add option that links to the Manage Items page.
* Text - textual context used throughout application to show intended use.
* 3rd party API placeholder - Weather description at top of schedule
* Images - Mountain image added to About page
* DB/Login - Input box and submit button for login. Item lists represent data that will be stored in database.
* WebSocket - Adding a item will result in a real time update to what is presented.


## CSS Deliverable

For this deliverable I stylized my webpage using CSS.
* Header, footer, and main content body - all parts stylized with CSS. 
* Navigation elements - links on the header and bottons throughout the application to move between pages. 
* Responsive to window resizing - used flexbox to make many elements of the site resize with the window, including the schedule and item lists. 
* Application elements - used and designed a number of elements including a table, radio, input boxs and more. 
* Application text content - lots of text used throughout the application, all stylized in different, appropriate, and readable ways. 
* Application images - made image fill main section in the about page, with a dimmed overlay applied to improve text readability. 
