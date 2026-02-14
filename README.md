## Digital Atelier

This is a spatial portfolio built as an interactive 3D environment rather than a traditional website.

**Key aspects to notice:**

- **Navigation as experience**  
  Movement through the space replaces page-based navigation. Scrolling, camera momentum, and spatial transitions guide exploration.

- **Systems thinking in presentation**  
  Projects are shown as modular elements that can be filtered, focused, and explored instead of static case study pages.

- **Interaction-driven design**  
  Camera behavior, fog, lighting, and motion respond to user input to create a living environment.

- **Design and engineering integration**  
  The project combines interaction design, real-time rendering, and frontend architecture into one cohesive system.

The atelier is intended to demonstrate how digital work can be experienced, not only viewed.

**Concept:**

The Digital Atelier is structured as a virtual studio composed of three rooms, each representing a different discipline: 
- InteractionRoom. play with moving objects
- SystemsRoom: an visual representation of how systems are connected and work together.
- StoryRoom: Inspiration by different small stories


**Navigation Philosophy**
The experience is built around movement rather than menus.
The user walks through a corridor using scroll-driven momentum.
Entrance fog creates depth and movement, allowing rooms and text to subtly shift and feel alive.
Rooms are previewed before entering, encouraging exploration.
Clicking a room transitions the camera into a focused mode.
Inside a room, camera motion is fixed to allow interaction with content.
Exiting returns the user seamlessly to the corridor.
The environment behaves like a continuous space rather than a sequence of screens.

## Run Locally

```bash
git clone <repo-url>
cd dev-log
npm install
npm run dev
