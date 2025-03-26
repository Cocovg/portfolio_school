# Interactive 3D Portfolio

A modern portfolio website featuring an interactive 3D scene built with Vue.js and Three.js. The project showcases a dynamic 3D environment with interactive elements, animated lighting, and an immersive user experience.

## Features

- Interactive 3D scene with a dynamic star field background
- Animated lighting system with multiple light sources
- Clickable points with popup information
- Smooth camera controls and transitions
- Responsive design that adapts to different screen sizes
- Modern UI with Vue.js framework

## Technologies Used

- Vue.js 3
- Three.js
- Vite (for build tooling)
- Modern JavaScript (ES6+)

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn package manager

## Installation

1. Clone the repository:
```bash
git clone [your-repository-url]
cd portfolio
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
```

4. Build for production:
```bash
npm run build
# or
yarn build
```

## Project Structure

```
portfolio/
├── components/
│   └── ThreeScene.vue    # Main 3D scene component
├── composables/
│   └── usePathPoints.js  # Path points logic
├── public/
│   └── models/          # 3D model assets
└── ...
```

## Features in Detail

### 3D Scene
- Dynamic star field background with animated colors
- Interactive 3D model with realistic materials
- Multiple light sources for enhanced visual appeal
- Orbit controls for user interaction

### Interactive Elements
- Clickable points with information popups
- Smooth camera transitions
- Responsive design that works across devices

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Three.js community for the excellent 3D graphics library
- Vue.js team for the amazing framework
- All contributors who have helped shape this project
