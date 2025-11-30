# Angular + SpreadJS Posts Manager

A polished Angular application that fetches posts from JSONPlaceholder API, displays them in a SpreadJS spreadsheet, allows column selection, supports inline editing, and saves data to a backend endpoint.

![Angular](https://img.shields.io/badge/Angular-17-red)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![SpreadJS](https://img.shields.io/badge/SpreadJS-17.0.4-green)

## Features

✨ **Data Loading**: Fetches 100 posts from JSONPlaceholder API  
📊 **SpreadJS Integration**: Full-featured spreadsheet with virtualization  
✏️ **Inline Editing**: Edit cells directly in the spreadsheet  
🎯 **Column Selection**: Choose which columns to include in save  
💾 **Dual Save Options**: Save selected columns or all data  
👁️ **Preview**: View JSON payload before saving  
📥 **Export**: Download data as JSON file  
🎨 **Modern UI**: Glassmorphism design with smooth animations  
📱 **Responsive**: Works on desktop, tablet, and mobile  
♿ **Accessible**: Keyboard navigation and ARIA support  
🧪 **Tested**: Comprehensive unit tests

## Tech Stack

- **Frontend**: Angular 17 (standalone components), TypeScript, RxJS
- **Spreadsheet**: SpreadJS 17.0.4 (via CDN)
- **Backend**: Express.js (mock server)
- **Styling**: CSS with custom properties, Inter font
- **Testing**: Jasmine, Karma

## Project Structure

```
demo/
├── server.js                          # Express mock backend
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── spreadsheet/          # SpreadJS component
│   │   │   ├── column-chooser/       # Column selection panel
│   │   │   ├── preview-modal/        # JSON preview modal
│   │   │   └── toast/                # Notification system
│   │   ├── services/
│   │   │   ├── posts.service.ts      # Fetch posts from API
│   │   │   └── save.service.ts       # Save to backend
│   │   ├── models/
│   │   │   └── post.model.ts         # TypeScript interfaces
│   │   ├── app.component.ts          # Main app component
│   │   └── app.component.html
│   ├── index.html                     # SpreadJS CDN links
│   ├── main.ts                        # Bootstrap app
│   └── styles.css                     # Global styles
└── package.json
```

## Installation

### Prerequisites

- Node.js 18+ and npm
- Modern browser (Chrome, Firefox, Safari, Edge)

### Setup

1. **Clone or navigate to the project directory**:
   ```bash
   cd /Users/mohit/Desktop/demo
   ```

2. **Install dependencies** (already done):
   ```bash
   npm install
   ```

## Running the Application

You need to run **both** the Angular dev server and the Express backend server.

### 1. Start the Backend Server

In one terminal:

```bash
node server.js
```

You should see:
```
🚀 Mock backend server running on http://localhost:3000
📡 Endpoints available:
   - POST http://localhost:3000/api/save-columns
   - POST http://localhost:3000/api/save-all
   - GET  http://localhost:3000/api/health
```

### 2. Start the Angular Dev Server

In another terminal:

```bash
npm start
```

Or:

```bash
ng serve
```

The app will be available at **http://localhost:4200**

## Usage Guide

### 1. Load Data

- On app load, 100 posts are automatically fetched from `https://jsonplaceholder.typicode.com/posts`
- Data is displayed in a SpreadJS spreadsheet with columns: **User ID**, **ID**, **Title**, **Body**

### 2. Select Columns

- Click the **Columns** button to open the column chooser panel
- Check/uncheck individual columns or use **Select All**
- Selected columns will be included in the save payload
- Column visibility updates in real-time in the spreadsheet

### 3. Edit Data

- Click any cell to edit its value
- Press Enter or click outside to confirm
- Edited values are automatically included in the next save

### 4. Preview Payload

- Click **Preview** to see the JSON payload that will be sent
- Shows first 5 rows with selected columns
- Click **Copy to Clipboard** to copy the JSON

### 5. Save Data

**Save Selected Columns**:
- Click **Save Selected** to save only the columns you've chosen
- Payload includes `selectedColumns` array and `rows` with only those columns

**Save All Data**:
- Click **Save All** to save all 4 columns for all rows
- Payload includes all data regardless of column selection

### 6. Export JSON

- Click **Export** to download the selected columns data as a JSON file
- File is named `posts-export-{timestamp}.json`

## API Endpoints

### Backend Mock Server

#### POST `/api/save-columns`

Save selected columns data.

**Request**:
```json
{
  "selectedColumns": ["id", "title"],
  "rows": [
    {"id": 1, "title": "Post 1"},
    {"id": 2, "title": "Post 2"}
  ]
}
```

**Response**:
```json
{
  "success": true,
  "savedCount": 2
}
```

#### POST `/api/save-all`

Save all data.

**Request**:
```json
{
  "rows": [
    {"userId": 1, "id": 1, "title": "Post 1", "body": "Body 1"},
    {"userId": 1, "id": 2, "title": "Post 2", "body": "Body 2"}
  ]
}
```

**Response**:
```json
{
  "success": true,
  "savedCount": 2
}
```

## Testing

### Run Unit Tests

```bash
npm test
```

Tests cover:
- **PostsService**: API fetch, error handling, retry logic
- **ColumnChooserComponent**: Select all, individual toggle, keyboard navigation
- **AppComponent**: Posts loading, toast notifications, modal controls

### Run Tests with Coverage

```bash
npm test -- --code-coverage
```

Coverage report will be in `coverage/` directory.

## Architecture Highlights

### SpreadJS Integration

- **Workbook Initialization**: Created in `ngAfterViewInit` lifecycle hook
- **Data Binding**: Uses `setDataSource()` for efficient rendering
- **Virtualization**: Enabled for smooth scrolling with 100+ rows
- **Column Control**: `setColumnVisible()` for dynamic column toggling
- **Data Extraction**: `getValue()` to read edited cell values

### State Management

- Component-based state (no external state library needed)
- RxJS observables for async operations
- Loading states for save operations
- Toast notifications for user feedback

### Responsive Design

- Mobile-first CSS with breakpoints
- Horizontal scrolling for spreadsheet on small screens
- Stacked buttons on mobile
- Touch-friendly interactions

### Accessibility

- ARIA labels on interactive elements
- Keyboard navigation (Tab, Enter, Escape)
- Focus-visible states
- `prefers-reduced-motion` support

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Known Limitations

- SpreadJS trial version (watermark may appear)
- Mock backend (data is not persisted)
- No authentication/authorization
- No pagination (loads all 100 posts at once)

## Troubleshooting

### SpreadJS not loading

- Check browser console for CDN errors
- Ensure you have internet connection (SpreadJS loads from CDN)
- Try clearing browser cache

### Backend connection error

- Ensure `server.js` is running on port 3000
- Check for CORS errors in browser console
- Verify no other service is using port 3000

### Build errors

- Delete `node_modules` and `package-lock.json`
- Run `npm install` again
- Ensure you're using Node.js 18+

## Future Enhancements

- [ ] Pagination or infinite scroll
- [ ] Advanced filtering and sorting
- [ ] Real backend integration
- [ ] User authentication
- [ ] Export to Excel/CSV
- [ ] Undo/redo functionality
- [ ] Dark mode toggle

## License

MIT

## Author

Built with ❤️ using Angular and SpreadJS
