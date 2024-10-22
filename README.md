# Airbnb Clone Project

This project is part of my attempts at learning/getting better at **TailwindCSS**, **authentication using JWT tokens**, and trying out **Amazon S3 buckets**. I’m building this while trying to avoid relying too much on external libraries, 
trying to achieve as much as I can with just CSS and focus on making components reusable. 
I started this project following a tutorial from "Coding with Dawid" youtube channel, and then kept adding features, validations and user feedback.


## Features

- **Sign up and log in**
- **Browse available accommodations** 
- **Book a place / Cancel booking**
- **List, Edit and delete accomodations**
- **Keep user informed after specific actions with ToastContainer**

## To-Do List

- [x] Add functionality for **cancelling bookings**
- [ ] Fix the issue where the **page sometimes goes blank** when navigating using the browser back button.
- [ ] Optimize the **form validation** and add more validations in the back-end.
- [ ] Implement **search functionality** so users can easily find accommodations.
- [ ] Add ripple efects to button presses for more visual feedback. (Attempt to copy the way MUI buttons work)
- [ ] Create a **settings panel** with features like **dark mode**.

## How to Run the App

1. Clone the repo.
2. Open a terminal for the back-end and front-end, navigating to api and client respectively.
3. Run `npm install` to grab all dependencies.
4. Configure your `.env` file with your **JWT secret**, **MongoDB connection string**, and **AWS S3 credentials**.
5. Run the backend and front-end with `yarn dev`
