import { SelectedCardEntity } from './selected-card.entity';
import { injected } from 'brandi';
import { Container } from 'pixi.js';

export class SelectedCardContainerEntity {
  public readonly container: Container;
  public readonly cards: Set<SelectedCardEntity> = new Set();

  constructor() {
    this.container = this.createContainer();
  }

  public addChildren(card: SelectedCardEntity): void {
    this.cards.add(card);
    this.container.addChild(card.container);
  }

  public removeChildren(card: SelectedCardEntity): void {
    this.cards.delete(card);

    card.destroy();
  }

  public open(): void {
    this.cards.forEach((card) => {
      card.open();
    });
  }

  public isEmpty(): boolean {
    return this.cards.size === 0;
  }

  public destroy(): void {
    this.container.destroy();
  }

  private createContainer(): Container {
    const container = new Container();

    return container;
  }
}

injected(SelectedCardContainerEntity);
