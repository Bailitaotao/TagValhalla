<div align="center">

<h1>TagValhalla</h1>
Droppable Name Tag
<br><br>

[![madewithlove](https://img.shields.io/badge/made_with-%E2%9D%A4-red?style=for-the-badge&labelColor=orange)](https://github.com/Bailitaotao/TagValhalla)

[![English](https://img.shields.io/badge/English-Read%20Docs-blue?style=for-the-badge&logo=googledocs&logoColor=white)](./README.md)
[![简体中文](https://img.shields.io/badge/简体中文-阅读文档-blue?style=for-the-badge&logo=googledocs&logoColor=white)](./docs/cn/README.md)
[![Change Log](https://img.shields.io/badge/Change%20Log-View%20Updates-blue?style=for-the-badge&logo=googledocs&logoColor=white)](https://github.com/Bailitaotao/TagValhalla)
[![License](https://img.shields.io/badge/LICENSE-MIT-green.svg?style=for-the-badge&logo=opensourceinitiative)](https://github.com/Bailitaotao/TagValhalla/LICENSE)

[**English**] | [**中文简体**](./docs/cn/README.md) | [**日本語**](./docs/ja/README.md) | [**한국어**](./docs/ko/README.md) | [**Türkçe**](./docs/tr/README.md)

</div>

## Overview

Want a meaningful way to remember your pets or legendary mobs? TagValhalla | Life Chronicle lets your world preserve every story. This Addon drops a special Name Tag when a named mob dies, embedding rich details about its life. The tag records survival time, affection, kill stats, and more.
![Screenshot-2025-08-26-001738](https://github.com/user-attachments/assets/bef7751e-ee8d-4f95-b256-73d8bb3a7fbe)

## Features

- 🏷️ Droppable info Name Tag on mob death: named mobs drop a tag containing their details
- ⏱️ Survival time tracking: logs time from spawn to death
- ❤️ Affection system: increase affection via feeding, petting, healing, etc.
- ⚔️ Kill statistics: track kills of players and other mobs with breakdowns
- 🤝 Interaction log: counts of feeds, pets, heals, and more
- 📍 Location info: spawn position and dimension
- 🩺 Health status: max and current health
- 👥 Owner tracking: records owner info for tamable mobs

## Project Structure

```
TagValhalla/
├── behavior_pack/                 # Behavior pack
│   ├── manifest.json             # Behavior pack manifest
│   ├── scripts/                  # JavaScript scripts
│   │   ├── main.js               # Entry point
│   │   ├── mobDataManager.js     # Mob data manager
│   │   ├── nametagHandler.js     # Name tag handler
│   │   └── eventHandler.js       # Event handler
│   ├── items/                    # Item definitions
│   │   └── info_nametag.json     # Info Name Tag item
│   ├── entities/                 # Entity definitions
│   └── loot_tables/              # Loot tables
│       └── mob_death_nametag.json
├── resource_pack/                # Resource pack
│   ├── manifest.json             # Resource pack manifest
│   ├── textures/                 # Textures
│   │   └── items/                # Item textures
│   └── models/                   # Models
│       └── entity/               # Entity models
├── README.md                     # Project documentation (this file)
└── USAGE.md                      # Usage guide
```

## Core Components

### 1. MobDataManager
- Stores and manages all mob lifecycle data
- CRUD operations for data records
- Handles save/load persistence
- Formats mob info into readable text

### 2. NametagHandler
- Creates special Name Tags carrying mob info
- Serializes/deserializes tag data
- Generates display text and detailed descriptions
- Provides data compression/decompression

### 3. EventHandler
- Listens to game events
- Handles mob spawn, death, interaction events
- Manages kill stats and affection updates
- Controls Name Tag drop logic

## Data Model

Each recorded mob contains:

```javascript
{
  id: "Entity ID",
  typeId: "Mob type ID",
  name: "Mob name",
  spawnTime: "Spawn timestamp",
  lifetime: "Lifetime in seconds",
  killCount: {
    players: "Players killed",
    mobs: "Mobs killed",
    specific: {} // Per-type kill breakdown
  },
  affection: "Affection (0-100)",
  interactions: {
    fed: "Times fed",
    petted: "Times petted",
    healed: "Times healed"
  },
  location: {
    dimension: "Spawn dimension",
    x: "X coordinate",
    y: "Y coordinate",
    z: "Z coordinate"
  },
  health: {
    max: "Max health",
    current: "Current health"
  },
  owner: "Owner name",
  achievements: [], // Achievement list
  customData: {} // Custom data
}
```

## Installation

1. Copy `behavior_pack` into your world's `behavior_packs` directory
2. Copy `resource_pack` into your world's `resource_packs` directory
3. Enable both packs in the world settings
4. Important: turn on experimental features "Beta APIs" and "Script API"
5. Start the world—the addon will run automatically

## How to Use

1. Name a mob: use a regular Name Tag to give a mob a name so it gets tracked
2. Interact with the mob: feed, pet, heal, etc., to increase affection
3. View info: when a named mob dies, it drops an info Name Tag; use it to view details
4. Collect records: gather tags from different mobs to build your bestiary

See more in [USAGE.md](./USAGE.md)

## Contributing

Issues and PRs are welcome to improve this project.

## License

This project is licensed under the MIT License.
