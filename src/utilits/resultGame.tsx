import { username } from "../App";
import { kindOfWin } from "../constants/constant";
import { IKindOfWin, IResultGame } from "../types";

export const resultGame = (players: IResultGame[]): string => {
  const mySelectedElement = players.find(
    (player) => player.username === username
  )?.choice;
  const opponentsElements = players.map((player) => player.choice);
  const numberOfSelectedElementsByOpponents = Array.from(
    new Set(opponentsElements)
  ).length;
  //more than two items were selected, so the winner cannot be find
  if (numberOfSelectedElementsByOpponents >= 3) {
    return `We haven't winner, because everybody choose different element`;
  }
  //all selected one element
  if (numberOfSelectedElementsByOpponents === 1) {
    return `We haven't winner, because everybody choose ${mySelectedElement}`;
  }
  const elementOpponent = opponentsElements.filter(
    (element) => element !== mySelectedElement
  )[0];
  // check is player won or lost game
  if (numberOfSelectedElementsByOpponents === 2) {
    return kindOfWin[mySelectedElement as keyof IKindOfWin] === elementOpponent
      ? "You won this game"
      : "You lost this game";
  }
  return "";
};
