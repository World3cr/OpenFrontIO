import { LitElement, css, html } from "lit";
import { customElement, state } from "lit/decorators.js";
import goldCoinIcon from "../../../../resources/images/GoldCoinIcon.svg";
import { translateText } from "../../../client/Utils";
import { EventBus } from "../../../core/EventBus";
import { PlayerActions, UnitType } from "../../../core/game/Game";
import { GameView } from "../../../core/game/GameView";
import { renderNumber } from "../../Utils";
import { BuildItemDisplay, flattenedBuildTable } from "./BuildMenu";
import { Layer } from "./Layer";
import { QuickBuildPlaceRequestEvent } from "./QuickBuildHandler";

@customElement("quickbuild-menu")
export class QuickBuildMenu extends LitElement implements Layer {
  public game: GameView;
  public eventBus: EventBus;
  public playerActions: PlayerActions | null = null;

  @state()
  private _isVisible = false;

  @state()
  private _isDragging = false;

  @state()
  private _draggedItem: BuildItemDisplay | null = null;

  @state()
  private _dragX = 0;

  @state()
  private _dragY = 0;

  @state()
  private _availableBuildings: BuildItemDisplay[] = [];

  private _lastMousePosition: { x: number; y: number } | null = null;

  tick() {
    // Show menu only when player is in-game and not in spawn phase
    if (!this.game || !this.game.myPlayer() || this.game.inSpawnPhase()) {
      if (this._isVisible) {
        console.log("QuickBuildMenu: hiding menu (spawn phase or no player)");
        this._isVisible = false;
        this.requestUpdate();
      }
      return;
    }

    // Show menu when player is alive and in-game
    if (this.game.myPlayer()?.isAlive() && !this._isVisible) {
      console.log("QuickBuildMenu: showing menu (player alive and in-game)");
      this._isVisible = true;
      this.requestUpdate();
    }

    if (this._isVisible) {
      this.refresh();
    }
  }

  init() {
    console.log("QuickBuildMenu: init() called");
    this.setupEventListeners();
    // Don't show immediately - let tick() handle visibility based on game state
  }

  private setupEventListeners() {
    // Global mouse events for drag and drop
    document.addEventListener("mousemove", this.onMouseMove.bind(this));
    document.addEventListener("mouseup", this.onMouseUp.bind(this));
    document.addEventListener("dragover", this.onDragOver.bind(this));
    document.addEventListener("drop", this.onDrop.bind(this));
  }

  static styles = css`
    :host {
      display: block;
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      z-index: 1000;
      pointer-events: none;
    }

    .quickbuild-container {
      background: linear-gradient(
        to top,
        rgba(30, 30, 30, 0.95) 0%,
        rgba(30, 30, 30, 0.85) 80%,
        transparent 100%
      );
      backdrop-filter: blur(8px);
      border-top: 2px solid #444;
      padding: 12px 20px 8px;
      display: flex;
      justify-content: center;
      align-items: center;
      pointer-events: auto;
      transition: transform 0.3s ease;
    }

    .quickbuild-container.hidden {
      transform: translateY(100%);
    }

    .quickbuild-menu {
      display: flex;
      gap: 8px;
      max-width: 90vw;
      overflow-x: auto;
      scrollbar-width: thin;
      scrollbar-color: #666 transparent;
    }

    .quickbuild-menu::-webkit-scrollbar {
      height: 4px;
    }

    .quickbuild-menu::-webkit-scrollbar-track {
      background: transparent;
    }

    .quickbuild-menu::-webkit-scrollbar-thumb {
      background: #666;
      border-radius: 2px;
    }

    .build-item {
      position: relative;
      width: 60px;
      height: 70px;
      background: rgba(44, 44, 44, 0.9);
      border: 2px solid #444;
      border-radius: 8px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      cursor: grab;
      transition: all 0.2s ease;
      padding: 4px;
      user-select: none;
      flex-shrink: 0;
    }

    .build-item:hover {
      background: rgba(58, 58, 58, 0.95);
      border-color: #666;
      transform: translateY(-2px);
    }

    .build-item:active {
      cursor: grabbing;
      transform: translateY(0px) scale(0.95);
    }

    .build-item.disabled {
      background: rgba(26, 26, 26, 0.7);
      border-color: #333;
      cursor: not-allowed;
      opacity: 0.5;
    }

    .build-item.disabled:hover {
      transform: none;
      background: rgba(26, 26, 26, 0.7);
      border-color: #333;
    }

    .build-icon {
      width: 32px;
      height: 32px;
      margin-bottom: 2px;
    }

    .build-item.disabled .build-icon {
      opacity: 0.5;
    }

    .build-cost {
      font-size: 10px;
      color: #fff;
      display: flex;
      align-items: center;
      gap: 2px;
    }

    .build-item.disabled .build-cost {
      color: #ff4444;
    }

    .cost-icon {
      width: 8px;
      height: 8px;
    }

    .build-count-chip {
      position: absolute;
      top: -6px;
      right: -6px;
      background: #2c2c2c;
      color: #fff;
      padding: 2px 6px;
      border-radius: 10px;
      font-size: 10px;
      border: 1px solid #444;
      min-width: 16px;
      text-align: center;
    }

    .drag-preview {
      position: fixed;
      pointer-events: none;
      z-index: 10000;
      transform: translate(-50%, -50%);
      opacity: 0.8;
      filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.5));
    }

    .hidden {
      display: none !important;
    }

    .toggle-button {
      position: absolute;
      top: -40px;
      right: 20px;
      background: rgba(30, 30, 30, 0.9);
      border: 2px solid #444;
      border-radius: 8px 8px 0 0;
      color: #fff;
      padding: 8px 12px;
      cursor: pointer;
      font-size: 12px;
      transition: all 0.2s ease;
      pointer-events: auto;
    }

    .toggle-button:hover {
      background: rgba(58, 58, 58, 0.95);
      border-color: #666;
    }

    @media (max-width: 768px) {
      .quickbuild-container {
        padding: 8px 12px 6px;
      }

      .build-item {
        width: 50px;
        height: 60px;
      }

      .build-icon {
        width: 26px;
        height: 26px;
      }

      .build-cost {
        font-size: 9px;
      }

      .cost-icon {
        width: 7px;
        height: 7px;
      }
    }
  `;

  render() {
    return html`
      <div class="quickbuild-container ${this._isVisible ? "" : "hidden"}">
        <button
          class="toggle-button"
          @click=${this.toggleVisibility}
          title="Toggle Quick Build Menu"
        >
          QuickBuild ${this._isVisible ? "▼" : "▲"}
        </button>

        <div class="quickbuild-menu">
          ${this._availableBuildings.map(
            (item) => html`
              <div
                class="build-item ${this.canBuild(item) ? "" : "disabled"}"
                draggable="${this.canBuild(item)}"
                @dragstart=${(e: DragEvent) => this.onDragStart(e, item)}
                @mousedown=${(e: MouseEvent) => this.onMouseDown(e, item)}
                title="${this.getTooltip(item)}"
              >
                <img
                  src=${item.icon}
                  alt="${item.unitType}"
                  class="build-icon"
                />
                <div class="build-cost">
                  ${renderNumber(this.cost(item))}
                  <img src=${goldCoinIcon} alt="gold" class="cost-icon" />
                </div>
                ${item.countable
                  ? html`<div class="build-count-chip">
                      ${this.count(item)}
                    </div>`
                  : ""}
              </div>
            `,
          )}
        </div>
      </div>

      ${this._isDragging && this._draggedItem
        ? html`
            <div
              class="drag-preview"
              style="left: ${this._dragX}px; top: ${this._dragY}px;"
            >
              <div class="build-item">
                <img
                  src=${this._draggedItem.icon}
                  alt="${this._draggedItem.unitType}"
                  class="build-icon"
                />
              </div>
            </div>
          `
        : ""}
    `;
  }

  private onDragStart(event: DragEvent, item: BuildItemDisplay) {
    if (!this.canBuild(item)) {
      event.preventDefault();
      return;
    }

    this._isDragging = true;
    this._draggedItem = item;

    // Set drag data
    event.dataTransfer!.setData(
      "application/json",
      JSON.stringify({
        unitType: item.unitType,
        action: "build",
      }),
    );

    // Hide default drag image
    const dragImage = new Image();
    dragImage.src =
      "data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=";
    event.dataTransfer!.setDragImage(dragImage, 0, 0);

    this.requestUpdate();
  }

  private onMouseDown(event: MouseEvent, item: BuildItemDisplay) {
    if (!this.canBuild(item)) return;

    this._lastMousePosition = { x: event.clientX, y: event.clientY };
  }

  private onMouseMove(event: MouseEvent) {
    if (this._isDragging && this._draggedItem) {
      this._dragX = event.clientX;
      this._dragY = event.clientY;
      this.requestUpdate();
    }
  }

  private onMouseUp(event: MouseEvent) {
    if (this._isDragging && this._draggedItem) {
      // Try to place the building at the mouse position
      this.tryPlaceBuilding(event.clientX, event.clientY);
    }

    this._isDragging = false;
    this._draggedItem = null;
    this.requestUpdate();
  }

  private onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  private onDrop(event: DragEvent) {
    event.preventDefault();

    try {
      const data = JSON.parse(event.dataTransfer!.getData("application/json"));
      if (data.action === "build" && data.unitType) {
        this.tryPlaceBuilding(event.clientX, event.clientY, data.unitType);
      }
    } catch (e) {
      console.warn("Invalid drag data:", e);
    }

    this._isDragging = false;
    this._draggedItem = null;
    this.requestUpdate();
  }

  private tryPlaceBuilding(
    screenX: number,
    screenY: number,
    unitType?: UnitType,
  ) {
    if (!this.game || !this.eventBus) return;

    const buildType = unitType || this._draggedItem?.unitType;
    if (!buildType) return;

    // Find the game canvas to convert screen coordinates to world coordinates
    const canvas = document.querySelector("canvas");
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const canvasX = screenX - rect.left;
    const canvasY = screenY - rect.top;

    // Emit the quickbuild place request event
    this.eventBus.emit(
      new QuickBuildPlaceRequestEvent(
        canvasX,
        canvasY,
        buildType,
        screenX,
        screenY,
      ),
    );
  }

  private toggleVisibility() {
    this._isVisible = !this._isVisible;
    this.requestUpdate();
  }

  private getTooltip(item: BuildItemDisplay): string {
    if (!this.canBuild(item)) {
      return translateText("build_menu.not_enough_money");
    }

    const name = item.key ? translateText(item.key) : item.unitType;
    const description = item.description ? translateText(item.description) : "";
    const cost = renderNumber(this.cost(item));

    return `${name}\n${description}\nCost: ${cost} gold`;
  }

  public canBuild(item: BuildItemDisplay): boolean {
    if (this.game?.myPlayer() === null || this.playerActions === null) {
      return false;
    }
    const buildableUnits = this.playerActions?.buildableUnits ?? [];
    const unit = buildableUnits.filter((u) => u.type === item.unitType);
    if (unit.length === 0) {
      return false;
    }
    return unit[0].canBuild !== false;
  }

  public cost(item: BuildItemDisplay): bigint {
    for (const bu of this.playerActions?.buildableUnits ?? []) {
      if (bu.type === item.unitType) {
        return bu.cost;
      }
    }
    return 0n;
  }

  public count(item: BuildItemDisplay): string {
    const player = this.game?.myPlayer();
    if (!player) {
      return "?";
    }
    return player.units(item.unitType).length.toString();
  }

  private refresh() {
    if (!this.game || !this.game.myPlayer()) {
      this._availableBuildings = [];
      return;
    }

    // Get current player actions for any tile (we'll use center of map as reference)
    const centerX = Math.floor(this.game.width() / 2);
    const centerY = Math.floor(this.game.height() / 2);
    const centerTile = this.game.ref(centerX, centerY);

    this.game
      .myPlayer()!
      .actions(centerTile)
      .then((actions) => {
        this.playerActions = actions;

        // Filter buildings to show only the most commonly used ones
        this._availableBuildings = flattenedBuildTable.filter((item) => {
          // Only show buildable and non-disabled units
          if (this.game?.config()?.isUnitDisabled(item.unitType)) {
            return false;
          }

          // Show buildings that are commonly used
          const commonBuildings = [
            UnitType.City,
            UnitType.DefensePost,
            UnitType.Factory,
            UnitType.Port,
            UnitType.MissileSilo,
            UnitType.SAMLauncher,
            UnitType.Warship,
            UnitType.AtomBomb,
            UnitType.HydrogenBomb,
            UnitType.MIRV,
          ];

          return commonBuildings.includes(item.unitType);
        });

        this.requestUpdate();
      });
  }

  showMenu() {
    this._isVisible = true;
    this.refresh();
  }

  hideMenu() {
    this._isVisible = false;
    this.requestUpdate();
  }

  get isVisible() {
    return this._isVisible;
  }
}
