# Firebase Auth Setup Guide

To use the Firebase Admin SDK locally (for tasks like creating test users or verifying tokens on the backend), you need a Service Account Key.

## How to get your `service-account.json`

1.  Open the [Firebase Console](https://console.firebase.google.com/).
2.  Select your project (**berkeley-sis**).
3.  Click the **Settings** (gear icon) in the left sidebar and select **Project settings**.
4.  Navigate to the **Service accounts** tab.
5.  Ensure **Node.js** is selected and click the **Generate new private key** button.
6.  Click **Generate key** in the pop-up to download the JSON file.
7.  Rename the downloaded file to `service-account.json`.
8.  Place the file in the `back-end/` directory of this project.

## Alternative: Using the Firebase Emulator

If you prefer to work entirely locally without a real Firebase project:

1.  Install the Firebase CLI: `npm install -g firebase-tools`
2.  Run `firebase init emulators` in the project root.
3.  Start the emulators: `firebase emulators:start`
4.  Set the following environment variable in your terminal before starting the backend:
    `$env:FIREBASE_AUTH_EMULATOR_HOST="127.0.0.1:9099"` (PowerShell)
    `export FIREBASE_AUTH_EMULATOR_HOST="127.0.0.1:9099"` (Bash/zsh)
