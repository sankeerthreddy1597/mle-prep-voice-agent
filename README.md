
## Introduction

AI voice Agent to help you prepare for US MLE interviews. The project uses AI to build interviews and then uses AI voice agents to conduct the interview. The voice agent was built using the VAPI framework.

### Features
- Authenitcation using Clerk
- Allows user to choose the topic for the interview
- Google Gemini AI prepares the interview questions based on the topic selected
- VAPI framework:
  - Speech to Text using deepgram
  - LLM using OpenAI gpt4
  - Text to Speech using elevenLabs
- Chadcn component library

#### UI
Auth Screen
<img width="828" alt="Screenshot 2025-07-01 at 2 44 04 PM" src="https://github.com/user-attachments/assets/3991b709-87c4-4426-889f-9fc4aabb5abe" />

Voice Agent With topic selection
<img width="1437" alt="Screenshot 2025-07-01 at 2 44 28 PM" src="https://github.com/user-attachments/assets/95084e51-e178-4aee-ba0a-fce4c01bd518" />

Active Session
<img width="550" alt="Screenshot 2025-07-01 at 2 44 44 PM" src="https://github.com/user-attachments/assets/d6eda466-fe33-43aa-9c1f-78cec62a435c" />

## Getting Started

Install the dependencies:

```bash
npm install
```
Example env file
```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=YOUR_CLERK_KEY
CLERK_SECRET_KEY=YOUR_CLERK_SECRET_KEY
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/

GOOGLE_GENERATIVE_AI_API_KEY=YOUR_GOOGLE_GEMINI_KEY
NEXT_PUBLIC_VAPI_WEB_KEY=YOUR_VAPI_KEY
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
