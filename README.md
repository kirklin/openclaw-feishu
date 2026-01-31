# openclaw-feishu

A Feishu/Lark (飞书) channel plugin for OpenClaw, built with a clean **Hexagonal Architecture**.

## Architecture Overview

This project follows the Hexagonal Architecture (Ports and Adapters) pattern to ensure a clean separation between business logic and infrastructure details:

- **Domain Layer (`src/domain/`)**: Contains the core business logic, entities, and port interfaces. This layer is independent of any external frameworks.
- **Adapters Layer (`src/adapters/`)**: Implements the technical details for interacting with Feishu (via Node SDK) and OpenClaw (via Plugin SDK).
- **Application Layer (`src/application/`)**: Orchestrates the flow of data between adapters using domain logic.

## Getting Started

### Prerequisites

- Node.js (v22+)
- pnpm
- A Feishu App with proper permissions and Event Subscriptions enabled (WebSocket mode).

### Installation

```bash
# Via OpenClaw CLI
openclaw plugins install openclaw-feishu

# Or via npm
npm install openclaw-feishu
```

### Configuration

Create a `.env` file in the root directory:

```env
FEISHU_APP_ID=your_app_id
FEISHU_APP_SECRET=your_app_secret
OPENCLAW_AGENT_ID=your_agent_id
```

### Running the Bot

```bash
pnpm dev
```

## Project Structure

```text
src/
├── adapters/          # External integrations (Feishu, OpenClaw)
├── application/       # Use cases and orchestration
├── domain/            # Core entities and port definitions
├── config.ts          # Configuration and validation
└── index.ts           # Entry point and bootstrapping
```

## License

MIT
