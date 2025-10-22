# Room Planner 2D - User Guide

## 🎨 Welcome to Your Professional Room Planner!

This guide will help you understand all the amazing features we've built into this professional 2D room planning application.

---

## 🚀 Getting Started

### Running the Application
```bash
npm run dev
```

The application will open in your browser. You'll see:
- **Left Panel**: AI Designer Agent (chat interface)
- **Center**: Canvas with professional grid
- **Top**: Toolbar with all tools
- **Right Panel**: Product selection (when furniture is selected)
- **Bottom Panel**: Wall properties (when wall is selected)

---

## 🛠️ Tools & Features

### 1. **Select Tool** (👆)
- Default tool for selecting and moving objects
- Click on any element to select it
- Drag furniture to reposition
- Press **Delete** key to remove selected element

### 2. **Wall Tool** (🧱)
The most powerful tool with professional features:

#### How to Draw Walls:
1. Click the Wall tool
2. Click on canvas to start drawing
3. Move mouse to see green preview line
4. Click to create wall segment
5. Continue clicking to draw connected walls
6. **Double-click** to finish, or press **ESC** to cancel

#### Smart Snapping Features:
- **Point Snapping**: Automatically snaps to existing wall endpoints (within 20px)
- **Horizontal Snapping**: When nearly horizontal, snaps perfectly straight
- **Vertical Snapping**: When nearly vertical, snaps perfectly straight
- **Visual Feedback**: Preview line turns **orange** when snapped
- **Alignment Guides**: Dashed lines appear across canvas showing alignment

#### Real-Time Dimensions:
- Length displayed on preview line as you draw
- Shows in meters (e.g., "4.92m") or millimeters (e.g., "1234mm")
- Updates dynamically with mouse movement

#### Wall Properties:
- **Click any wall** to open editing panel at bottom
- Adjust **Length**: 100mm - 10000mm (slider + input)
- Adjust **Height**: 200cm - 500cm (default 270cm)
- Adjust **Thickness**: 5cm - 30cm (default 10cm)
- **Delete wall** with confirmation dialog
- Press **ESC** to close panel

### 3. **Window Tool** (🪟)
Enhanced window placement system:

#### How to Add Windows:
1. Select Window tool
2. Click **directly on a wall**
3. Window automatically snaps to wall
4. If you click off a wall, you'll get an error: "Окна и двери можно размещать только на стенах!"

#### Window Features:
- Visual glass pane effect (blue translucent)
- Hover to see handles
- Click to select (shows blue handles)
- Always aligned with wall

### 4. **Door Tool** (🚪)
Similar to windows with special door visualization:

#### Door Features:
- Must be placed on walls
- Shows door swing arc (90-degree arc)
- Visual door panel line
- Hover effects with purple/orange highlights

### 5. **Furniture Tools**
Multiple furniture categories available:

- 🪑 **Stool** (chairs/seating)
- 🔲 **Table** (tables)
- 🛋️ **Sofa/Кресло** (sofas and armchairs)
- 🛏️ **Bed** (beds)
- 🚰 **Sink** (bathroom fixtures)
- 🚿 **Shower/Bath** (shower cabins)
- 🚽 **Toilet**
- 📺 **TV**

#### Furniture Interaction:
1. Click tool to select furniture type
2. Click on canvas to place
3. **Drag** to reposition
4. **Click** to open product panel (right side)
5. Choose from multiple products in category
6. See price, dimensions, description
7. Real-time total price displayed in bottom-left

---

## 🎯 Visual Feedback System

### Hover Effects
Every interactive element responds to hover:

- **Walls**: 
  - Slight scale increase
  - Shadow appears
  - Small pencil icon (✏️) appears at center
  - Endpoint handles become visible

- **Windows/Doors**:
  - Color highlight
  - Handles appear
  - Shadow effect

- **Furniture**:
  - Cursor changes to grab/move icon
  - Ready to drag

### Selection Feedback
When you select an element:

- **Blue glow** around selected item
- **Thicker stroke** on walls
- **Handles** at endpoints
- Relevant panel opens (Wall or Product)

### Drawing Feedback
While drawing walls:

- **Green preview line**: Shows where wall will be created
- **Orange preview line**: When snapped to axis/point
- **Distance label**: Follows the line showing length
- **Endpoint circles**: Start and end points highlighted
- **Guide lines**: Full-screen dashed lines when axis-aligned
- **Top banner**: Instructions for current action

---

## 🎨 Professional Grid System

The canvas features a Planner 5D-style grid:

### Grid Types:
- **Minor Lines** (light gray): Every 50cm
- **Major Lines** (darker gray): Every 1 meter
- **Labels**: Metric measurements at major intervals
- **Origin Marker**: Red/orange lines at (0,0)

### Why This Grid?
- Helps visualize room scale
- Easy to estimate furniture fit
- Professional appearance
- Matches industry standards

---

## ⌨️ Keyboard Shortcuts

| Key | Action |
|-----|--------|
| **ESC** | Cancel drawing / Close panels |
| **Delete** | Remove selected element |
| **Double-click** | Finish wall drawing |

---

## 💬 Notifications (Toasts)

The app provides feedback for all actions:

### Types:
- ✓ **Success** (Green): "Стена добавлена", "Товар обновлён"
- ⚠ **Warning** (Yellow): "Рисование отменено"
- ✕ **Error** (Red): "Окна и двери можно размещать только на стенах!"
- ℹ **Info** (Blue): "Рисование завершено"

### Behavior:
- Appear in top-right corner
- Auto-dismiss after 3 seconds
- Can be manually closed (X button)
- Stack vertically if multiple

---

## 💰 Price Tracking

### Bottom-Left Price Display:
- Shows **total cost** of all furniture
- Updates in real-time
- Displays **item count**
- Elegant white card design
- Only appears when furniture added

---

## 🎯 Best Practices

### For Best Results:

1. **Start with Walls**:
   - Draw perimeter first
   - Use double-click to close shapes
   - Take advantage of snapping for straight walls

2. **Add Windows/Doors**:
   - Place after walls are complete
   - Click directly on wall center for best placement
   - Space them appropriately

3. **Place Furniture**:
   - Consider room flow
   - Check dimensions before placing
   - Use product panel to find best fit/price

4. **Edit as Needed**:
   - Click walls to adjust dimensions
   - Drag furniture to perfect positions
   - Use delete key liberally

---

## 🎨 Design Philosophy

### What Makes This Professional:

1. **Visual Hierarchy**: Important elements stand out
2. **Immediate Feedback**: Every action has visual response
3. **Smart Defaults**: Sensible starting values
4. **Error Prevention**: Validation before problems occur
5. **Forgiving UX**: Easy undo (ESC, Delete)
6. **Progressive Disclosure**: Advanced features appear when needed
7. **Consistent Language**: Russian UI throughout
8. **Professional Aesthetics**: Clean, modern design

---

## 🐛 Troubleshooting

### Common Issues:

**Q: My wall won't snap straight**
- A: Move slower near alignment - it snaps within 15px

**Q: Can't place window**
- A: Make sure you're clicking directly on a wall (black line)

**Q: Drawing starts from old point**
- A: Press ESC to cancel, then start fresh (this bug is fixed!)

**Q: How to delete something?**
- A: Select it, press Delete key, or use panel delete button

**Q: Panel won't close**
- A: Press ESC or click the X button

---

## 🚀 Advanced Tips

### Pro User Techniques:

1. **Perfect Rectangles**: 
   - Use axis snapping for first wall
   - Each subsequent wall will align easily

2. **Quick Room Creation**:
   - Draw 3 walls
   - On 4th wall, click near start point to auto-close

3. **Furniture Layout**:
   - Place all items first
   - Fine-tune positions afterward
   - Use product panel to match budget

4. **Window Spacing**:
   - Standard spacing is ~1.5-2m between windows
   - Consider natural light needs

---

## 📊 Technical Specifications

### Scale & Measurements:
- **Canvas Scale**: 1 pixel = 10mm
- **Grid Major**: 100cm (1 meter)
- **Grid Minor**: 50cm
- **Default Wall Height**: 270cm (2.7m)
- **Default Wall Thickness**: 10cm

### Dimensions:
- Walls: 100mm - 10000mm length
- Room Height: 200cm - 500cm
- Wall Thickness: 5cm - 30cm
- Furniture: Various (see product details)

---

## 🎓 Tutorial Workflow

### First-Time User Journey:

1. **Launch app** → See clean interface
2. **Click Wall tool** → See instruction banner
3. **Click canvas** → Start drawing (green line appears)
4. **Move mouse** → See distance updating
5. **Click again** → Wall created, continue drawing
6. **Double-click** → Finish drawing
7. **Click on wall** → Panel opens with properties
8. **Click Window tool** → See placement instruction
9. **Click on wall** → Window appears
10. **Click Furniture** → Place and customize
11. **Check price** → See total in corner

---

## 🎉 Features Checklist

Everything you get:

- ✅ Professional grid system
- ✅ Smart wall drawing with snapping
- ✅ Real-time dimension display
- ✅ Full wall editing (length, height, thickness)
- ✅ Window/door wall-only placement
- ✅ Hover effects on all elements
- ✅ Selection highlighting
- ✅ Drag & drop furniture
- ✅ Product selection panel
- ✅ Price calculation
- ✅ Toast notifications
- ✅ Keyboard shortcuts
- ✅ Beautiful animations
- ✅ AI chat panel (UI ready)
- ✅ Mobile-responsive layout

---

## 🌟 Enjoy Planning!

You now have a professional-grade 2D room planner at your fingertips. The interface is intuitive, the feedback is immediate, and the results are beautiful. 

**Happy planning! 🏠✨**

