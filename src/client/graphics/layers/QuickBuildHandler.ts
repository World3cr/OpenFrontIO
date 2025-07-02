import { EventBus, GameEvent } from "../../../core/EventBus";
import { Cell, UnitType } from "../../../core/game/Game";
import { GameView } from "../../../core/game/GameView";
import { BuildUnitIntentEvent } from "../../Transport";
import { TransformHandler } from "../TransformHandler";
import { Layer } from "./Layer";

export class QuickBuildPlaceRequestEvent implements GameEvent {
  constructor(
    public readonly screenX: number,
    public readonly screenY: number,
    public readonly unitType: UnitType,
    public readonly originalScreenX: number,
    public readonly originalScreenY: number,
  ) {}
}

export class QuickBuildHandler implements Layer {
  constructor(
    private game: GameView,
    private eventBus: EventBus,
    private transformHandler: TransformHandler,
  ) {
    this.setupEventListeners();
  }

  // Layer interface implementations
  init() {
    // Handler initialization done in constructor
  }

  tick() {
    // No tick logic needed for this handler
  }

  shouldTransform(): boolean {
    return false; // This handler doesn't render anything itself
  }

  private setupEventListeners() {
    // Listen for quickbuild place requests
    this.eventBus.on(
      QuickBuildPlaceRequestEvent,
      (event: QuickBuildPlaceRequestEvent) => {
        this.handlePlaceRequest(event);
      },
    );
  }

  private async handlePlaceRequest(event: QuickBuildPlaceRequestEvent) {
    if (!this.game || !this.game.myPlayer()) {
      console.warn("No game or player available for quickbuild");
      return;
    }

    // Convert screen coordinates to world coordinates
    const worldCoords = this.transformHandler.screenToWorldCoordinates(
      event.screenX,
      event.screenY,
    );

    // Validate coordinates are within the game map
    if (!this.game.isValidCoord(worldCoords.x, worldCoords.y)) {
      console.warn(
        "Invalid coordinates for quickbuild placement:",
        worldCoords,
      );
      return;
    }

    const targetTile = this.game.ref(worldCoords.x, worldCoords.y);

    // Check if the player can build this unit type at this location
    try {
      const actions = await this.game.myPlayer()!.actions(targetTile);
      const buildableUnit = actions.buildableUnits.find(
        (bu) => bu.type === event.unitType,
      );

      if (!buildableUnit || buildableUnit.canBuild === false) {
        console.warn(
          `Cannot build ${event.unitType} at position (${worldCoords.x}, ${worldCoords.y})`,
        );
        this.showPlacementFeedback(
          event.originalScreenX,
          event.originalScreenY,
          false,
        );
        return;
      }

      // Valid placement - emit the build intent event
      this.eventBus.emit(
        new BuildUnitIntentEvent(
          event.unitType,
          new Cell(worldCoords.x, worldCoords.y),
        ),
      );

      this.showPlacementFeedback(
        event.originalScreenX,
        event.originalScreenY,
        true,
      );
    } catch (error) {
      console.error("Error checking build validity:", error);
      this.showPlacementFeedback(
        event.originalScreenX,
        event.originalScreenY,
        false,
      );
    }
  }

  private showPlacementFeedback(
    screenX: number,
    screenY: number,
    success: boolean,
  ) {
    // Create a visual feedback element
    const feedback = document.createElement("div");
    feedback.style.position = "fixed";
    feedback.style.left = screenX + "px";
    feedback.style.top = screenY + "px";
    feedback.style.transform = "translate(-50%, -50%)";
    feedback.style.pointerEvents = "none";
    feedback.style.zIndex = "10001";
    feedback.style.fontSize = "24px";
    feedback.style.fontWeight = "bold";
    feedback.style.textShadow = "2px 2px 4px rgba(0,0,0,0.8)";
    feedback.style.animation = "quickbuild-feedback 1s ease-out forwards";
    feedback.textContent = success ? "✓" : "✗";
    feedback.style.color = success ? "#00ff00" : "#ff0000";

    // Add animation keyframes if not already present
    if (!document.querySelector("#quickbuild-feedback-styles")) {
      const style = document.createElement("style");
      style.id = "quickbuild-feedback-styles";
      style.textContent = `
        @keyframes quickbuild-feedback {
          0% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
          50% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1.2);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -70%) scale(0.8);
          }
        }
      `;
      document.head.appendChild(style);
    }

    document.body.appendChild(feedback);

    // Remove feedback after animation
    setTimeout(() => {
      if (feedback.parentNode) {
        feedback.parentNode.removeChild(feedback);
      }
    }, 1000);
  }
}
