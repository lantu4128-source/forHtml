# Voice Note Web (Pure Frontend)

This is a pure WebAssembly version of Voice Note that runs entirely in the browser.
It uses [Vosk Browser](https://github.com/ccoreilly/vosk-browser) to run speech recognition locally on the device without any backend server.

## How to Deploy to GitHub Pages

1. **Get the Model**:
   - Ensure you have the `model` folder inside this directory.
   - If you ran the prepare script, it should be there.
   - If not, download [vosk-model-small-cn-0.22.zip](https://alphacephei.com/vosk/models/vosk-model-small-cn-0.22.zip), unzip it, and rename the folder to `model`.

2. **Upload to GitHub**:
   - Create a new GitHub repository.
   - Upload all files in this `voice-note-web` folder (index.html, model/, etc.) to the root of the repo (or a docs/ folder).
   - **Important**: Make sure the `model` folder is included.

3. **Enable GitHub Pages**:
   - Go to Repo Settings -> Pages.
   - Select the branch (e.g., main) and folder (root or docs).
   - Save.

4. **Access**:
   - Open the provided GitHub Pages URL (e.g., `https://username.github.io/repo`).
   - The first load will take some time to download the 40MB model.
   - Once loaded, it works offline!

## Limitations
- Lower accuracy compared to the 1.3GB server version.
- Initial load time depends on internet speed (40MB download).
- Heavy on mobile CPU/Battery.

