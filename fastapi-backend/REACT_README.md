# InstaShopper - Modern React Frontend

A beautiful, modern React application for AI-powered video product analysis with dark mode support and responsive design.

## 🚀 Quick Start

1. **Install dependencies:**
   ```bash
   cd fastapi-backend
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   Navigate to `http://localhost:5173`

## 🎨 Features

### Modern UI Design
- Clean, modern interface with Inter font
- Responsive design that works on all screen sizes
- Smooth animations and transitions
- Professional color scheme and typography

### Dark Mode Support
- Toggle between light and dark themes
- Automatic system preference detection
- Persistent theme selection

### Video Analysis
- **Video Link Tab**: Paste TikTok or Instagram URLs for analysis
- **Upload Tab**: Drag & drop or browse to select video files
- Real-time video preview with embeds
- Progress indicators during analysis

### Product Cards
- Shopify-inspired product card design
- Confidence scoring with color-coded badges
- Detailed product information (color, material, pattern, brand)
- Frame tracking showing where products appear
- "Find Similar Items" action buttons

### Layout
- Two-column layout: video content on left, product results on right
- Tabbed interface for video input methods
- Collapsible sections and organized information hierarchy

## 🛠 Build Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 🎯 Usage

1. **Video Link Analysis**:
   - Switch to "Video Link" tab
   - Paste a TikTok or Instagram video URL
   - Click "Analyze Video" to process

2. **File Upload Analysis**:
   - Switch to "Upload File" tab
   - Drag & drop a video file or click "Choose File"
   - Click "Analyze Video" to process

3. **View Results**:
   - Analyzed products appear as cards on the right
   - Each card shows product details, confidence, and frame locations
   - Click "Find Similar Items" to explore related products

## 🎨 Theme System

The app uses CSS custom properties for theming:

- Light theme: Clean whites and subtle grays
- Dark theme: Deep blues with high contrast text
- Smooth transitions between themes
- System preference detection

## 📱 Responsive Design

- Mobile-first approach
- Tablet and desktop optimizations
- Flexible grid layouts
- Touch-friendly interactions

## 🔧 Technical Stack

- **React 19** - Latest React with concurrent features
- **Vite** - Fast build tool and dev server
- **Lucide React** - Beautiful icon library
- **CSS Custom Properties** - Modern theming approach
- **Inter Font** - Professional typography

## 🌐 Backend Integration

The frontend connects to the FastAPI backend at `http://localhost:8000`:

- Video upload endpoint: `POST /analyze-video`
- Automatic proxy setup for API calls
- Error handling and loading states
- Real-time analysis feedback

## 📂 Project Structure

```
src/
├── components/          # Reusable React components
│   ├── Header.jsx      # App header with branding and theme toggle
│   ├── ProductCard.jsx # Individual product display card
│   ├── ProductGrid.jsx # Grid of product cards
│   ├── TabButton.jsx   # Tab navigation button
│   ├── VideoPreview.jsx # Video preview and embed
│   └── VideoUpload.jsx # File upload with drag & drop
├── hooks/              # Custom React hooks
│   └── useTheme.js     # Theme management hook
├── styles/             # CSS stylesheets
│   └── globals.css     # Global styles and theme variables
├── App.jsx             # Main application component
└── main.jsx            # React app entry point
```