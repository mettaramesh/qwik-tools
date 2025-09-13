# Modularization of Qwik App

## Structure
- `src/Qwik.js`: Main app class, navigation, UI logic, clipboard analysis, and tool loading
- `src/jsonFormatter.js`: JSON Formatter tool (exports `load` and `setup`)
- `src/base64Tool.js`: Base64 encoder/decoder tool (exports `load` and `setup`)
- `src/urlTool.js`: URL encoder/decoder tool (exports `load` and `setup`)
- `src/jwtTool.js`: JWT decoder/inspector tool (exports `load` and `setup`)
- `src/uuidGenerator.js`: UUID generator tool (exports `load` and `setup`)
- `src/hashGenerator.js`: Hash generator tool (exports `load` and `setup`)
- `src/regexTester.js`: Regex tester tool (exports `load` and `setup`)
- `src/timestampConverter.js`: Timestamp converter tool (exports `load` and `setup`)
- `src/colorPicker.js`: Color picker tool (exports `load` and `setup`)
- `src/loremIpsum.js`: Lorem Ipsum generator tool (exports `load` and `setup`)
- `src/placeholderTool.js`: Placeholder for future tools
- `src/jsonYamlTool.js`: JSON ↔ YAML converter tool (exports `load` and `setup`)
- `src/utils.js`: Shared utility functions
- `main.js`: App entry point, initializes Qwik
- `app.js`: Legacy entry (now replaced by `main.js`)

## Setup & Hosting

### 1. Run Locally (No Server)
- Open `index.html` directly in your browser (double-click or right-click > Open With > Browser).
- Note: Some features (like clipboard access) may be limited due to browser security when running from `file://`.

### 2. Run with a Simple Local Server
- **Python 3:**
  - In the project directory, run: `python -m http.server 8000`
  - Open `http://localhost:8000` in your browser.
- **Node.js (http-server):**
  - Install globally (if needed): `npm install -g http-server`
  - Run: `http-server . -p 8000`
  - Open `http://localhost:8000` in your browser.
- **VS Code Live Server Extension:**
  - Right-click `index.html` and select "Open with Live Server".

### 3. Deploy to Static Hosting
- Upload all files to any static hosting provider (GitHub Pages, Netlify, Vercel, S3, etc.).
- Ensure HTTPS is enabled for full browser API support.
- No backend or build step is required—just static file hosting.

#### Deploying to GitHub Pages
1. Push your project to a GitHub repository.
2. Go to your repository on GitHub > **Settings** > **Pages**.
3. Under "Source," select the branch (usually `main` or `master`) and the folder (`/root` if files are in the root, or `/docs` if you move them there) where your `index.html` is located.
4. Click **Save**. GitHub will provide a URL (e.g., `https://yourusername.github.io/your-repo/`).
5. Visit the URL—your app should load!
6. **Tip:** If your app uses relative paths, it will work out of the box. If you use absolute paths, adjust them or set the correct `<base>` in your HTML for subfolder hosting.

### 4. Build/Bundle (Optional)
- For advanced use, you may bundle with a tool like Webpack, Parcel, or Vite. Entry point: `main.js`.
- Output the bundled files to a `dist/` directory and host as above.

## Modularization Principles
- Each tool is a separate module exporting at least `load(container)` (renders UI) and `setup(container)` (binds events, logic).
- The main app (`Qwik.js`) dynamically loads and initializes tools as needed, calling both `load` and `setup` after navigation or smart detection.
- All UI event delegation, navigation, and state management are handled in `Qwik.js`.
- Utility functions are centralized in `utils.js` for reuse.

## Usage
- Import and use `main.js` as your entry script in `index.html`.
- Each module is commented for clarity and maintainability.
- To add a new tool, create a new module in `src/`, export `load` and `setup`, and register it in `Qwik.js`.


