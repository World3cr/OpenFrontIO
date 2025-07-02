# OpenFrontIO Development Guide

## Project Overview

OpenFrontIO is a real-time strategy multiplayer web game built with TypeScript. Players compete to expand territory, build alliances, and engage in strategic battles on maps based on real-world geography. This is a fork/rewrite of WarFront.io.

## 🏗️ Architecture Overview

### Core Technologies

- **Frontend**: TypeScript, Canvas API, PixiJS for graphics, WebSockets for real-time communication
- **Backend**: Node.js, Express, WebSocket Server, Clustering for multi-worker architecture
- **Build System**: Webpack, TypeScript compiler
- **Testing**: Jest with test coverage
- **Styling**: TailwindCSS
- **Linting**: ESLint with TypeScript support

### Project Structure

```
OpenFrontIO/
├── src/
│   ├── client/          # Frontend code (GPL v3 license)
│   │   ├── Main.ts             # Main entry point for client
│   │   ├── ClientGameRunner.ts # Core game runner logic
│   │   ├── Transport.ts        # WebSocket communication
│   │   ├── LocalServer.ts      # Local/single-player server
│   │   └── graphics/           # Rendering and UI components
│   ├── core/            # Shared code between client/server (MIT license)
│   │   ├── game/              # Game logic and mechanics
│   │   ├── configuration/     # Configuration management
│   │   ├── Schemas.ts         # Zod validation schemas
│   │   └── worker/            # Web worker for game processing
│   └── server/          # Backend code (MIT license)
│       ├── Server.ts          # Main server entry point
│       ├── Master.ts          # Master process (load balancer)
│       ├── Worker.ts          # Worker processes (game servers)
│       ├── GameServer.ts      # Individual game instance logic
│       └── GameManager.ts     # Game lifecycle management
├── tests/               # Test files
├── resources/           # Static assets (images, maps, etc.)
├── webpack.config.js    # Frontend build configuration
├── package.json         # Dependencies and scripts
└── tsconfig.json        # TypeScript configuration
```

## 🎮 Game Architecture

### Client-Server Communication

- **WebSocket Protocol**: Real-time bidirectional communication
- **Message Types**: Intent (player actions), Ping (heartbeat), Hash (sync verification)
- **Turn-Based System**: Server processes turns at regular intervals
- **Synchronization**: Hash verification ensures all clients stay in sync

### Game Flow

1. **Lobby Phase**: Players join, configure game settings
2. **Prestart**: Map loading and client preparation
3. **Active Game**: Turn-based gameplay with real-time updates
4. **Game End**: Winner determination and game archival

### Multi-Process Architecture

- **Master Process**: Load balancer, manages worker processes
- **Worker Processes**: Handle individual games and WebSocket connections
- **Clustering**: Horizontal scaling across multiple CPU cores

## 🚀 Development Commands

### Essential Commands

```bash
# Development mode (both client and server with hot reload)
npm run dev

# Client only (frontend development)
npm run start:client

# Server only (backend development)
npm run start:server-dev

# Production build
npm run build-prod

# Run tests
npm run test

# Test with coverage
npm run test:coverage

# Linting
npm run lint
npm run lint:fix

# Code formatting
npm run format
```

### Development Workflow

1. **Start Development**: `npm run dev` - Runs both client and server
2. **Frontend Only**: `npm run start:client` - For UI/graphics work
3. **Backend Only**: `npm run start:server-dev` - For server logic
4. **Testing**: `npm run test` - Run test suite

## 🔧 Key Components

### Client Side (`src/client/`)

#### Main.ts

- **Purpose**: Application entry point, initializes UI components
- **Key Functions**: Handle lobby joining, user authentication, modal management
- **Dependencies**: All UI modals, user settings, authentication

#### ClientGameRunner.ts

- **Purpose**: Core game client logic, coordinates all client components
- **Key Functions**:
  - `joinLobby()`: Connect to multiplayer games
  - `createClientGame()`: Initialize game instance
  - `ClientGameRunner.start()`: Begin game loop
- **Dependencies**: Transport, GameRenderer, InputHandler, WorkerClient

#### Transport.ts

- **Purpose**: WebSocket communication layer
- **Key Functions**:
  - `connect()`: Establish server connection
  - `connectLocal()`: Single-player mode
  - `connectRemote()`: Multiplayer mode
- **Message Handling**: Intent sending, server message processing

#### Graphics System (`src/client/graphics/`)

- **GameRenderer.ts**: Main rendering coordinator
- **Layers**: Modular rendering system (UI, terrain, units, effects)
- **PixiJS Integration**: Hardware-accelerated graphics

### Server Side (`src/server/`)

#### Server.ts

- **Purpose**: Main server entry point
- **Architecture**: Cluster master/worker pattern
- **Environment**: Production vs Development configurations

#### Master.ts

- **Purpose**: Load balancer and API gateway
- **Responsibilities**: Route requests to workers, public lobby management
- **Endpoints**: Game creation, lobby listing, player kicking

#### Worker.ts

- **Purpose**: Individual game server processes
- **Responsibilities**: Handle WebSocket connections, game management
- **Load Distribution**: Games distributed across workers by ID hash

#### GameServer.ts

- **Purpose**: Individual game instance management
- **Lifecycle**: Lobby → Prestart → Active → Finished
- **Features**: Player management, turn processing, synchronization

#### GameManager.ts

- **Purpose**: Manages multiple game instances per worker
- **Functions**: Game creation, client routing, cleanup

### Shared Code (`src/core/`)

#### Game Logic (`src/core/game/`)

- **Game.ts**: Core game mechanics and rules
- **GameView.ts**: Client-side game state representation
- **TerrainMapLoader.ts**: Map loading and processing

#### Configuration (`src/core/configuration/`)

- **Config.ts**: Server and client configuration interfaces
- **ConfigLoader.ts**: Environment-specific configuration loading

#### Schemas.ts

- **Purpose**: Zod schemas for message validation
- **Types**: Client/Server messages, game data structures
- **Validation**: Runtime type checking for all network communication

## 🔒 Security & Authentication

### JWT Authentication

- **Discord Integration**: OAuth2 with Discord for user authentication
- **Token Management**: JWT tokens for session management
- **Rate Limiting**: Request throttling to prevent abuse

### Input Validation

- **Zod Schemas**: All network messages validated with Zod
- **Client Verification**: Server validates all client actions
- **Synchronization Checks**: Hash verification prevents desync attacks

## 🧪 Testing Strategy

### Test Structure (`tests/`)

- **Unit Tests**: Individual component testing
- **Integration Tests**: Component interaction testing
- **Performance Tests**: Load and stress testing
- **Test Utilities**: Mock servers and test configurations

### Key Test Files

- **Game Logic**: Attack.test.ts, Team.test.ts, UnitGrid.test.ts
- **Client Tests**: UI component and interaction tests
- **Server Tests**: Game server and management tests

## 🎨 Frontend Development

### UI Components

- **Web Components**: Custom elements for modals and UI
- **Event System**: EventBus for component communication
- **Responsive Design**: Mobile and desktop support

### Graphics Pipeline

- **Canvas Rendering**: HTML5 Canvas for game graphics
- **PixiJS**: Hardware acceleration for smooth performance
- **Layered Rendering**: Modular rendering system

### Build Process

- **Webpack**: Module bundling and asset processing
- **TypeScript**: Type-safe compilation
- **Hot Reload**: Development server with live updates

## 🚀 Deployment

### Production Build

```bash
npm run build-prod
```

### Environment Variables

- **GAME_ENV**: dev/prod environment flag
- **GIT_COMMIT**: Version tracking
- **OTEL\_\***: OpenTelemetry configuration for monitoring

### Docker Support

- **Dockerfile**: Container configuration
- **Docker Compose**: Multi-service deployment
- **Production**: Includes Nginx reverse proxy

## 🐛 Debugging

### Client Debugging

- **Browser DevTools**: Standard web debugging
- **Console Logging**: Extensive logging throughout client
- **WebSocket Inspector**: Monitor real-time communication

### Server Debugging

- **Winston Logging**: Structured server-side logging
- **Process Monitoring**: Multi-worker process debugging
- **OpenTelemetry**: Distributed tracing and metrics

### Common Issues

1. **WebSocket Connection**: Check firewall and proxy settings
2. **Synchronization**: Monitor hash mismatches in logs
3. **Performance**: Use performance tests in `tests/perf/`

## 📝 Contributing Guidelines

### Code Style

- **ESLint**: Automated linting with TypeScript rules
- **Prettier**: Code formatting
- **Husky**: Pre-commit hooks for quality assurance

### Development Flow

1. **Feature Branch**: Create branch from main
2. **Development**: Write code with tests
3. **Testing**: Run full test suite
4. **Review**: Code review process
5. **Merge**: Squash and merge to main

### License Notes

- **Client Code**: GPL v3 (copyleft)
- **Server/Core**: MIT (permissive)
- **Assets**: Various licenses in resources/

## 🔧 Configuration

### Environment Setup

- **Node.js**: v24.3.0+ required
- **npm**: v11.4.2+ required
- **TypeScript**: v5.7.2+ (included)

### VS Code Setup

- **Extensions**: TypeScript, ESLint, Prettier recommended
- **Debug Config**: Launch configurations included
- **Task Runner**: VS Code tasks for common operations

## 📚 Additional Resources

### Documentation

- **README.md**: Quick start guide
- **LICENSE**: Licensing information
- **resources/changelog.md**: Version history

### External APIs

- **Discord OAuth**: User authentication
- **Cloudflare**: CDN and DNS management
- **OpenTelemetry**: Monitoring and observability

This development guide provides a comprehensive overview of the OpenFrontIO codebase. Refer to individual file documentation and inline comments for implementation details.
