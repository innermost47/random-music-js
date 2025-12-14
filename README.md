# RANDOM MUSIC JS

A web-based music generator that creates coherent and randomized musical pieces using the Web Audio API. This project explores algorithmic composition, generating dynamic drum patterns, basslines, chords, and melodies within a chosen scale.

## Live Demo

- **Discover it online:** [https://random-music.anthony-charretier.fr/](https://random-music.anthony-charretier.fr/)
- **YouTube Demo:** [https://www.youtube.com/watch?v=cw6gSLhoE0g](https://www.youtube.com/watch?v=cw6gSLhoE0g)

## Features

- **Algorithmic Composition:** Generates unique and coherent musical sequences for drums, bass, chords, and melodies.
- **Two Generators:**
  - **EightBits:** Focuses on retro-inspired drum sounds and dynamic musical structures, including intros, breaks, and "riddims."
  - **Sine Wave:** Utilizes sine and other basic waveforms with various effects (delay, distortion, reverb, filtering) to create evolving electronic soundscapes.
- **Web Audio API:** Leverages browser capabilities for real-time audio synthesis and processing.
- **Dynamic Scale Changes:** The EightBits generator randomly selects root notes and minor modes for varied harmonic content.
- **Interactive Controls:** Play, pause, stop, and select between different music generators.
- **Visual Feedback:** (Implied by `startDraw`, `stopDraw` and `updateDisplay` functions) The UI updates to show current musical parameters.

## How it Works

The project consists of two main music generation modules: `eightBits.js` and `sine.js`, along with a central `main.js` to manage playback and UI.

### Core Concepts

- **`Timer.js`:** A custom timer utility for precise, Web Audio API-synchronized scheduling of musical events.
- **`Mode.js`:** (Used in `eightBits.js`) Manages musical scales, generating frequencies based on a root note and a chosen minor mode.
- **Buffers & Samples:** Drum sounds are loaded as audio buffers.
- **Oscillators:** Sine, sawtooth, and square wave oscillators are used for synthesizing melodic and harmonic content.
- **Web Audio Nodes:** Extensive use of `GainNode`, `BiquadFilterNode` (lowpass, highpass), `DelayNode`, `ConvolverNode` (reverb), `WaveShaperNode` (distortion), `StereoPannerNode`, and `AnalyserNode` for rich sound design and effects.

### EightBits Generator (`eightBits.js`)

This generator focuses on creating dynamic and structured tracks.

1.  **Drum Kits:** Loads various 8-bit inspired drum samples (kicks, snares, hats, claps, cymbals).
2.  **Scales and Modes:** Randomly picks a root note and a minor mode (`chromaticScale`, `minorModes`) to define the harmonic context for the entire song.
3.  **Sequence Generation:** Functions like `generateRandomBass`, `generateRandomNoteSequence`, `generateRandomChordSequence`, and `generateRandomMelody` create musical phrases based on the current scale.
4.  **Song Structure:** Implements "intro," "break," and "riddim" sections by dynamically changing drum patterns and musical phrases at specific song durations.
5.  **Filtering:** Applies lowpass filters with dynamic frequency sweeps to bass, notes, chords, and melodies, adding expressive movement.

### Sine Wave Generator (`sine.js`)

This generator creates a more ambient, evolving electronic soundscape, primarily using synthesized waveforms and a robust effects chain.

1.  **Drum Samples:** Loads a different set of drum samples for percussion.
2.  **Fixed Scale:** Uses a fixed A minor scale (frequencies array) for all melodic and harmonic content.
3.  **Complex FX Chain:**
    - **LFO:** A low-frequency oscillator modulates filter cutoff frequencies for movement.
    - **Distortion (`WaveShaperNode`):** Adds harmonic richness and grit.
    - **Delay (`DelayNode`):** Creates echoes with feedback.
    - **Filters (`BiquadFilterNode`):** Highpass and lowpass filters shape the sound.
    - **Reverb (`ConvolverNode`):** A short impulse response reverb adds space.
    - **Analyzer (`AnalyserNode`):** (Potentially for visualizers in `draw.js`).
4.  **Synth Voices:** `bassSynth`, `tbSynth`, `sqSynth`, `fundamentalSynth`, `thirdSynth`, `fifthSynth`, and `melodySynth` define distinct timbres for different musical roles using various oscillator types and ADSR-like gain envelopes.
5.  **Dynamic Sections:** Generates new melody, chord, and bass sequences at different measures to introduce variations.

## Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Edge, Safari) that supports the Web Audio API.

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/innermost47/random-music-js.git
    cd random-music-js
    ```
2.  **Serve the project:**
    You need a local web server to run this project, as it loads audio files via XHR. You can use:
    - **Live Server VS Code Extension:** If you use VS Code, install the "Live Server" extension and open the project folder. Right-click `index.html` and select "Open with Live Server".
    - **Node.js `http-server`:**
      ```bash
      npm install -g http-server
      http-server .
      ```
      Then open `http://localhost:8080` (or whatever port `http-server` tells you) in your browser.
    - **Python's built-in server:**
      ```bash
      python -m http.server
      ```
      Then open `http://localhost:8000` in your browser.

### Usage

1.  Open the `index.html` file in your web browser through a local web server.
2.  **Select a Song Type:** Use the "Select Wave" dropdown to choose between "8-Bits" (EightBits generator) and "Sine Wave" (Sine Wave generator).
3.  **Play:** Click the "Play" button to start the music generation.
4.  **Pause/Resume:** Click the "Play/Pause" button again to pause or resume playback.
5.  **Stop:** Click the "Stop" button to stop the music and reset the generator.
6.  **Help:** Click the "Help" button to re-open the welcome modal (if implemented).

## Project Structure

```
├── public/                # Static assets, including index.html and sounds
│   ├── sounds/            # Audio samples for drums and reverb impulses
│   │   ├── eightBits/
│   │   └── sine/
│   ├── css/
│   ├── js/
│   └── index.html
├── src/
│   ├── Timer.js           # Custom timer for audio scheduling
│   └── Mode.js            # Handles musical scales and frequency generation
├── eightBits.js           # The EightBits music generator module
├── sine.js                # The Sine Wave music generator module
├── main.js                # Main application logic, UI interactions, and playback control
├── utils/
│   └── utils.js           # Utility functions (audio context, scale data, drum kits, etc.)
└── README.md              # This file
```

## Technologies Used

- HTML5
- CSS3
- JavaScript (ES Modules)
- Web Audio API
- Bootstrap (for UI components)

## License

MIT
