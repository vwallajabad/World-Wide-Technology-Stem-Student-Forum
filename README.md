# World-Wide Technology Stem Student Forum Project

## Table of Contents
- [World-Wide Technology Stem Student Forum Project](#world-wide-technology-stem-student-forum-project)
  - [Table of Contents](#table-of-contents)
  - [Project Overview](#project-overview)
    - [Technologies Used](#technologies-used)
  - [Features](#features)
  - [Setup and Installation](#setup-and-installation)
  - [Usage Instructions](#usage-instructions)
  - [License](#license)

## Project Overview

The World-Wide Technology Stem Student Forum project is a comprehensive cybersecurity-focused platform designed to engage students in technology discussions and provide valuable resources. This project combines a web application with a chatbot interface, offering users a seamless experience for learning about various technological topics.

### Technologies Used

- Node.js
- Firebase Hosting
- Nodemailer
- OpenAI API
- Marked.js
- Deepseek
- OpenRouter
- Firebase Analytics

## Features

1. **Web Application**: A responsive web interface accessible through Firebase Hosting, featuring a chatbot interface for user interaction.

2. **Cybersecurity Chatbot**: An AI-powered chatbot named CyberBuddy, integrated into the web application, providing instant answers to user queries related to cybersecurity and technology.

3. **Email Generation**: The ability to generate and send custom-formatted emails regarding cybersecurity awareness, utilizing the OpenAI API for content creation. This feature now supports dynamic input for email content based on user interactions.

4. **Firebase Analytics Integration**: Tracking user engagement metrics for the web application.

5. **Responsive Design**: Optimized for both desktop and mobile devices.

## Setup and Installation

To set up this project locally:

1. Clone the repository:
   ```
   git clone https://github.com/vwallajabad/World-Wide-Technology-Stem-Student-Forum.git
   ```

2. Navigate to the project directory:
   ```
   cd world-wide-tech-stem-forum
   ```

3. Install dependencies:
   ```
   npm install
   ```

4. Set up environment variables:
   - Create a `.env` file in the root directory
   - Add the following variables:
     ```
     OPENROUTER_API_KEY=your_openrouter_api_key
     EMAIL_SENDER=your_email_sender
     APP_PASSWORD=your_app_password
     ```

5. Build and start the server:
   ```
   npm run dev
   ```

6. Deploy to Firebase Hosting:
   ```
   firebase deploy --only hosting
   ```

## Usage Instructions

1. Access the web application at `https://your-project-id.firebaseapp.com`
2. Interact with CyberBuddy by typing your questions in the chat interface
3. To generate and send emails, ensure you have an `emails.txt` file with valid email addresses in the `src` directory
4. Run the `sendEmails()` function in `index.js` to initiate the email generation and sending process

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.
