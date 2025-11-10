# Interactive Web GIS Application

An interactive web-based Geographic Information System (GIS) application for Croatia, built with OpenLayers and React. The application displays cadastral parcels and CORINE Land Cover 2018 data with interactive features.

## Features

- Interactive map view constrained to Croatia's geographical boundaries
- Cadastral parcel layer with click-to-select functionality
- CORINE Land Cover 2018 WMS layer with toggle control
- Popup display showing detailed parcel information
- Feature highlighting on selection


## Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Mapping Library**: OpenLayers 10
- **Styling**: Tailwind CSS v4
- **Vector Tiles**: Mapbox Vector Tiles (MVT) format
- **Build Tool**: Vite
- **Package Manager**: npm

## Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

## Installation

```bash
# Clone the repository
git clone <repository-url>

# Navigate to project directory
cd interactive-web-GIS-app

# Install dependencies
npm install

# Start development server
npm run dev
```

## Project Structure

```
src/
├── components/
│   ├── CustomMap.tsx          # Base map component with OSM tiles
│   ├── MapInitializer.tsx     # Bridge between react-openlayers and custom context
│   ├── ParcelPopup.tsx        # Popup component for parcel details
│   └── LayerToggle.tsx        # Toggle control for CORINE layer
├── context/
│   └── mapContext.tsx         # Shared Map Context for OpenLayers instance
├── layers/
│   ├── CustomVectorTileLayer.tsx  # Cadastral parcels vector tile layer
│   └── CorineLayer.tsx        # CORINE Land Cover 2018 WMS layer
├── types/
│   └── index.ts               # Shared TypeScript interfaces
├── utils/
│   └── popupPositioning.ts    # Popup positioning utility functions
└── App.tsx                    # Main application component
```

## Data Sources

### Cadastral Parcels
- **Source**: Tegola vector tile server
- **Endpoint**: `https://gis-dev.listlabs.net/api/tegola/tegola-capabilities`
- **Format**: Mapbox Vector Tiles (MVT)
- **Layer**: cadastral_parcels
- **Z-Index**: 2 (top layer)

### CORINE Land Cover 2018
- **Source**: European Environment Agency (EEA)
- **Endpoint**: `https://image.discomap.eea.europa.eu/arcgis/services/Corine/CLC2018_WM/MapServer/WMSServer`
- **Protocol**: WMS 1.3.0
- **Layer**: 13 (Mainland Europe vector)
- **Z-Index**: 1 (middle layer)
- **Opacity**: 0.7

### Base Map
- **Source**: OpenStreetMap (OSM)
- **Z-Index**: 0 (bottom layer)

## Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

### Key Configuration

**Map Boundaries (Croatia)**
- Projection: EPSG:3857 (Web Mercator)
- Extent: [1392000, 5175000, 2080000, 5850000]

**CORINE Land Cover Layers**
- Layer 12: Raster format (for overview/zoomed out view)
- Layer 13: Vector format (for detailed/zoomed in view)

## Map Interactions

### Parcel Selection
- Click on any cadastral parcel to select it
- Selected parcels are highlighted in green
- Popup displays parcel number and area
- Popup automatically closes when map is panned

### Layer Toggle
- Use the "Show/Hide Land Cover" button in the top-right corner
- Toggles the visibility of the CORINE Land Cover layer


## Browser Support

Modern browsers with support for:
- ES6+ JavaScript
- WebGL (for OpenLayers rendering)
- Fetch API

## Known Issues

- CORINE layer visibility depends on zoom level (MinScaleDenominator/MaxScaleDenominator constraints)
- Layer 13 (vector) may not render at very low zoom levels


