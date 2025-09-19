export const themes = {
  light: {
    name: 'Light (Grayscale)',
    colors: {
      '--bg': '#f0f0f0', // Light gray background
      '--controls-bg': '#e0e0e0',
      '--fg': '#333333', // Dark gray foreground text
      '--select-fg': '#f0f0f0',
      '--white-key': '#ffffff', // White keys
      '--black-key': '#333333', // Black keys (dark gray)
      '--accent': '#007bff', // Vibrant blue accent
      '--note-color': '#007bff', // Notes in accent color
      '--pressed-key-color': '#66b3ff', // Pressed keys in a lighter shade of accent
    },
  },
  dark: {
    name: 'Dark (Grayscale)',
    colors: {
      '--bg': '#333333', // Dark gray background
      '--controls-bg': '#444444',
      '--fg': '#f0f0f0', // Light gray foreground text
      '--select-fg': '#f0f0f0',
      '--white-key': '#cccccc', // White keys (light gray)
      '--black-key': '#000000', // Black keys (black)
      '--accent': '#007bff', // Vibrant blue accent
      '--note-color': '#007bff', // Notes in accent color
      '--pressed-key-color': '#66b3ff', // Pressed keys in a lighter shade of accent
    },
  },
};