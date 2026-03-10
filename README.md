# Next Piano Teacher

A modern, interactive web application designed to help users learn piano through visualization and real-time feedback. Built with **Next.js 15**, **Tone.js**, and **React 19**, it provides a "Synthesia-style" experience directly in the browser.

![Piano Teacher Preview](public/favicon.png)

## 🎹 Features

-   **Falling Notes Visualization**: Real-time "falling" notes that sync with MIDI playback, making it easier to follow and learn complex pieces.
-   **MIDI Connectivity**: Full support for external MIDI keyboards. Connect your instrument and play along with visual guides.
-   **Interactive Virtual Keyboard**: High-quality visual keyboard that highlights notes as they are played (manually or via MIDI).
-   **Synthesizer Customization**:
    -   Multiple synth presets.
    -   Adjustable ADSR (Attack, Decay, Sustain, Release) settings.
    -   Powered by the robust **Tone.js** audio engine.
-   **Scoring & Feedback**:
    -   Real-time scoring based on accuracy.
    -   Performance tracking: Hits, misses, combo streaks, and reaction times.
    -   Post-session results summary.
-   **Multiple Modes**: Switch between specialized modes like "Falling Notes" for learning and standard practice modes.
-   **Song Library**: Pre-loaded classical MIDI files (e.g., Beethoven's Moonlight Sonata, Mozart's Für Elise).
-   **Modern UI/UX**:
    -   Responsive design with screen size warnings.
    -   Light and Dark mode support.
    -   Fullscreen mode for an immersive experience.

## 🚀 Getting Started

### Prerequisites

-   Node.js (LTS recommended)
-   npm or yarn

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/mendiak/piano-web.git
    cd piano-web
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Run the development server:
    ```bash
    npm run dev
    ```

4.  Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🛠️ Tech Stack

-   **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
-   **UI Library**: [React 19](https://react.dev/)
-   **Audio Engine**: [Tone.js](https://tonejs.github.io/)
-   **MIDI Processing**: [@tonejs/midi](https://github.com/Tonejs/Midi)
-   **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
-   **Language**: JavaScript / TypeScript

## 📁 Project Structure

-   `app/`: Next.js App Router pages and global styles.
-   `components/`: Core UI components and the main application logic.
-   `hooks/`: Custom React hooks for MIDI handling, synth management, scoring, and animations.
-   `public/midi/`: Pre-loaded MIDI songs.
-   `utils/`: MIDI utilities and keyboard configuration.

## 👤 Author

Developed by **Mikel Aramendia**
-   Portfolio: [mendiak.github.io/portfolio](https://mendiak.github.io/portfolio/)

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
