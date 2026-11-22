# Happy Birthday Pradnya ❤️

A romantic, celebratory, and playful Happy Birthday website crafted with endless love by **Chetan** for **Pradnya**. 🎂✨

---

## ✨ Features

- 💌 **Magical Intro Hook**: A cinematic opening screen with background music unlock and interactive sound experience.
- 🎵 **Floating Music Player**: Ambient background music player with spinning vinyl animation and playback controls.
- 📸 **Dynamic Memory Slideshow (62 Photos)**: Automatically shuffles and displays 62 precious memory polaroids with smooth 3D stack perspective, swipe support, shuffle mode, and fullscreen lightbox view.
- 🕵️‍♀️ **"Forever 23 vs Officially 30" Meme Section**: Hilarious Marathi dialogue (written in English script) roasting her famous claim of being 23 when she was born in 1998, complete with an interactive Age Reality-O-Meter!
- 🎂 **Interactive Cake Cutting & Wishes**: Blow out candles to release fireworks, confetti showers, and glowing sky lanterns.
- 💌 **3D Flip Love Letter**: A touching personal birthday letter from Chetan to Pradnya.
- 🌌 **Dreamy Night Sky Visuals**: Shimmering stars, floating moon, shooting stars, and falling rose petals.

---

## 📂 Project Structure

```
Happy-Birthday-Pradnya/
├── assets/                  # Photos and music
│   ├── photos.json          # Manifest of photo paths
│   ├── photos-data.js       # Global JS photo list
│   └── music.mp3            # Background music track
├── Css/
│   └── style.css            # Styles and animations
├── img/
│   ├── banner.png           # Birthday bunting banner
│   └── cake.svg             # Cake illustration
├── index.html               # Main website
├── background.js            # Romantic canvas night sky & petals
├── main.js                  # Audio, photo slider, memes & interactions
├── scan-assets.js           # Asset scanner for dynamic photo detection
├── vercel.json              # Vercel deployment configuration
└── package.json             # Build scripts
```

---

## 🚀 How to Add Photos & Music

1. **Add Photos**:
   - Place your photos inside the `assets/` folder.
   - Run `node scan-assets.js` (or run `npm run build`) to automatically update `assets/photos.json` and `assets/photos-data.js`.
   - The website dynamically adjusts to whatever number of photos you put in!

2. **Add Music**:
   - Place your music file as `assets/music.mp3`.
   - When visitors tap **"Unwrap Birthday Magic"**, the music plays smoothly.

---

## 🌐 Deploying to Vercel

1. Push your changes to the `main` branch on GitHub.
2. Go to [Vercel](https://vercel.com) and import the `Happy-Birthday-Pradnya` repository.
3. Click **Deploy**. Vercel will automatically run the build command (`node scan-assets.js`) and serve the site!

---

*Made with all my heart by Chetan for Pradnya 🌹*
