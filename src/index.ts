import { createRootDiContainer } from './app/di/container';
import { DI_TOKENS } from './app/di/tokens';

function onDomLoaded(): void {
  const appEl = document.getElementById('game');
  if (!appEl) {
    throw new Error(`appEl="#game" not found`);
  }
  startApp(appEl);
}

async function startApp($root: HTMLElement): Promise<void> {
  const diContainer = createRootDiContainer({ $root });
  const game = diContainer.get(DI_TOKENS.game);

  await game.start();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', onDomLoaded);
} else {
  onDomLoaded();
}
