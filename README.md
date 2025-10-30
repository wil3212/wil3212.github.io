# HTML Games Collection

A collection of classic games built with HTML, CSS, and JavaScript.

## 🎮 Games

### 15 Puzzle
A sliding tile puzzle where you arrange numbered tiles from 1 to 15 in order.

**Features:**
- Drag and drop tiles or click to move
- Move counter
- Shuffle function
- Win detection
- Colorful tile design

### Conway's Game of Life
A cellular automaton simulation where simple rules create complex patterns.

**Features:**
- Click to toggle cells
- Preset patterns (Glider, Blinker, Pulsar)
- Adjustable speed
- Customizable rules
- Random population
- Step-by-step or continuous simulation

## 📁 Project Structure

```
wil3212.github.io/
├── index.html              # Main landing page
├── games/
│   ├── 15-puzzle/
│   │   ├── index.html     # 15 Puzzle game page
│   │   ├── style.css      # Game-specific styles
│   │   ├── game.js        # Game logic
│   │   └── assets/        # Game-specific assets
│   └── game-of-life/
│       ├── index.html     # Game of Life page
│       ├── style.css      # Game-specific styles
│       └── game.js        # Game logic
├── assets/
│   ├── css/
│   │   └── common.css     # Shared styles
│   └── images/            # Shared images
├── index_old.html         # Backup of original file
├── 15Puzzle_old.html      # Backup of original file
└── README.md
```

## 🚀 Getting Started

1. Clone this repository
2. Open `index.html` in your web browser
3. Select a game to play

Or visit the live site on GitHub Pages: `https://[your-username].github.io`

## 🛠️ Development

Each game is self-contained in its own directory with:
- **HTML**: Page structure and layout
- **CSS**: Styling specific to that game
- **JavaScript**: Game logic and interactions

Common styles are shared via `assets/css/common.css`.

## 📝 Adding New Games

To add a new game:

1. Create a new directory in `games/`
2. Add `index.html`, `style.css`, and `game.js`
3. Add a link to the game on the main `index.html` page
4. Include any game-specific assets in a local `assets/` folder

## 🎨 Improvements Made

### 15 Puzzle
- Separated HTML, CSS, and JavaScript
- Removed hardcoded local file paths
- Added shuffle functionality
- Added win detection
- Improved UI with better styling
- Added move counter
- Added click-to-move in addition to drag-and-drop

### Game of Life
- Separated HTML, CSS, and JavaScript
- Added preset patterns
- Improved UI with organized controls
- Better button styling and layout
- Added explanatory text for rules
- Fixed edge-wrapping bugs

### Overall
- Created proper project structure
- Added modern landing page
- Improved navigation between games
- Added shared CSS for consistency
- Mobile-responsive design

## 📄 License

Feel free to use and modify these games for your own projects!

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Add new games
- Improve existing games
- Fix bugs
- Enhance the UI/UX

---

Created with ❤️ using HTML, CSS, and JavaScript
