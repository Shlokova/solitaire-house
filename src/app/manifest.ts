import { AssetsManifest } from 'pixi.js';
import font from '../assets/fonts/RubikBold.ttf';
import girl from '../assets/images/game/girl.png';
import goosebumps from '../assets/images/effects/goosebumps.png';
import steam from '../assets/images/effects/steam.png';
import fireplace from '../assets/images/game/fireplace.png';
import tape from '../assets/images/game/tape.png';
import tapeWindow from '../assets/images/game/tape_window.png';
import windowImg from '../assets/images/game/window.png';
import windowRepair from '../assets/images/game/window_repair.png';
import background from '../assets/images/game/bg.png';
import card2 from '../assets/images/cards/card_2.png';
import card3 from '../assets/images/cards/card_3.png';
import card4 from '../assets/images/cards/card_4.png';
import card5 from '../assets/images/cards/card_5.png';
import card6 from '../assets/images/cards/card_6.png';
import card7 from '../assets/images/cards/card_7.png';
import card8 from '../assets/images/cards/card_8.png';
import card9 from '../assets/images/cards/card_9.png';
import card10 from '../assets/images/cards/card_10.png';
import cardJ from '../assets/images/cards/card_J.png';
import cardQ from '../assets/images/cards/card_Q.png';
import cardK from '../assets/images/cards/card_K.png';
import cardA from '../assets/images/cards/card_A.png';
import cardBack from '../assets/images/cards/card_back.png';
import cardUnknown from '../assets/images/cards/card_uncknow.png';
import cardTape from '../assets/images/cards/card_tape.png';
import cardWindow from '../assets/images/cards/card_window.png';
import button from '../assets/images/ui/button.png';
import hand from '../assets/images/ui/hand.png';
import logo from '../assets/images/ui/logo.png';
import popup from '../assets/images/ui/popup.png';
import snow from '../assets/images/effects/snow.png';
import wind from '../assets/images/effects/wind.png';

export const enum ASSETS_NAME {
  Font = 'RubikBold',
  Girl = 'Girl',
  Goosebumps = 'Goosebumps',
  Steam = 'Steam',
  Fireplace = 'Fireplace',
  Tape = 'Tape',
  TapeWindow = 'TapeWindow',
  Window = 'Window',
  WindowRepair = 'WindowRepair',
  Background = 'Background',
  Card2 = 'Card2',
  Card3 = 'Card3',
  Card4 = 'Card4',
  Card5 = 'Card5',
  Card6 = 'Card6',
  Card7 = 'Card7',
  Card8 = 'Card8',
  Card9 = 'Card9',
  Card10 = 'Card10',
  CardJ = 'CardJ',
  CardQ = 'CardQ',
  CardK = 'CardK',
  CardA = 'CardA',
  CardBack = 'CardBack',
  CardUnknown = 'CardUncknow',
  CardTape = 'CardTape',
  CardWindow = 'CardWindow',
  Button = 'Button',
  Hand = 'Hand',
  Logo = 'Logo',
  Popup = 'Popup',
  Snow = 'Snow',
  Wind = 'Wind',
}

export const manifest: AssetsManifest = {
  bundles: [
    {
      name: 'assets',
      assets: [
        {
          alias: ASSETS_NAME.Font,
          src: font,
          data: {
            family: ASSETS_NAME.Font,
          },
        },
        {
          alias: ASSETS_NAME.Girl,
          src: girl,
        },
        {
          alias: ASSETS_NAME.Goosebumps,
          src: goosebumps,
        },
        {
          alias: ASSETS_NAME.Steam,
          src: steam,
        },
        {
          alias: ASSETS_NAME.Fireplace,
          src: fireplace,
        },
        {
          alias: ASSETS_NAME.Tape,
          src: tape,
        },
        {
          alias: ASSETS_NAME.TapeWindow,
          src: tapeWindow,
        },
        {
          alias: ASSETS_NAME.Window,
          src: windowImg,
        },
        {
          alias: ASSETS_NAME.WindowRepair,
          src: windowRepair,
        },
        {
          alias: ASSETS_NAME.Background,
          src: background,
        },
        {
          alias: ASSETS_NAME.Card2,
          src: card2,
        },
        {
          alias: ASSETS_NAME.Card3,
          src: card3,
        },
        {
          alias: ASSETS_NAME.Card4,
          src: card4,
        },
        {
          alias: ASSETS_NAME.Card5,
          src: card5,
        },
        {
          alias: ASSETS_NAME.Card6,
          src: card6,
        },
        {
          alias: ASSETS_NAME.Card7,
          src: card7,
        },
        {
          alias: ASSETS_NAME.Card8,
          src: card8,
        },
        {
          alias: ASSETS_NAME.Card9,
          src: card9,
        },
        {
          alias: ASSETS_NAME.Card10,
          src: card10,
        },
        {
          alias: ASSETS_NAME.CardJ,
          src: cardJ,
        },
        {
          alias: ASSETS_NAME.CardQ,
          src: cardQ,
        },
        {
          alias: ASSETS_NAME.CardK,
          src: cardK,
        },
        {
          alias: ASSETS_NAME.CardA,
          src: cardA,
        },
        {
          alias: ASSETS_NAME.CardBack,
          src: cardBack,
        },
        {
          alias: ASSETS_NAME.CardUnknown,
          src: cardUnknown,
        },
        {
          alias: ASSETS_NAME.CardTape,
          src: cardTape,
        },
        {
          alias: ASSETS_NAME.CardWindow,
          src: cardWindow,
        },
        {
          alias: ASSETS_NAME.Button,
          src: button,
        },
        {
          alias: ASSETS_NAME.Hand,
          src: hand,
        },
        {
          alias: ASSETS_NAME.Logo,
          src: logo,
        },
        {
          alias: ASSETS_NAME.Popup,
          src: popup,
        },
        {
          alias: ASSETS_NAME.Snow,
          src: snow,
        },
        {
          alias: ASSETS_NAME.Wind,
          src: wind,
        },
      ],
    },
  ],
};
