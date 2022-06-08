import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { css } from "@emotion/css";
import { IPlayer } from "./types/player";
import { kindOfElements } from "./constants/constant";
import { resultGame } from "./utilits/resultGame";

export const username = String(Math.floor(Math.random() * 100) + 1);

const socket = io("https://front-task-rps.herokuapp.com/", {
  query: {
    username,
  },
});

const App = () => {
  const [listOfPlayers, setListOfPlayers] = useState<IPlayer[]>([]);
  useEffect(() => {
    socket.emit("get_players");
  }, []);

  socket.on("players_received", (users) => {
    const newListOfPlayers = users.map((user: string) => ({
      nickname: user,
      connected: true,
      choise: false,
      finished: "",
    }));
    setListOfPlayers(newListOfPlayers);
  });

  socket.on("disconnected", (user) => {
    const newListOfPlayers = listOfPlayers.map((player) =>
      player.nickname === user.username
        ? { ...player, connected: false }
        : player
    );
    setListOfPlayers(newListOfPlayers);
  });

  socket.on("opponent_made_choise", (user) => {
    const newListOfPlayers = listOfPlayers.map((player) =>
      player.nickname === user.username ? { ...player, choise: true } : player
    );
    setListOfPlayers(newListOfPlayers);
  });

  socket.on("game_finished", (users) => {
    const newListOfPlayers = listOfPlayers.map((player) => ({
      ...player,
      finished: resultGame(users.results),
    }));
    setListOfPlayers(newListOfPlayers);
  });

  const aboutOpponent = (opponent: IPlayer): string =>
    `Opponent ${opponent.nickname} is 
    ${opponent.connected ? "online" : "offline"}, 
    he ${opponent.choise ? "made" : "makes"} choice`;

  return (
    <div>
      <h1
        className={css`
          margin-bottom: 10px;
        `}
      >
        Your nickname:
        <span
          className={css`
            background: #f9dada;
            padding: 2px 10px;
            border-radius: 3px;
            margin-left: 8px;
          `}
        >
          {username}
        </span>
      </h1>
      <div
        className={css`
          display: flex;
          flex-direction: column;
          margin-bottom: 20px;
        `}
      >
        {listOfPlayers
          .filter((player) => player.nickname !== username)
          .map((player) => (
            <span
              className={css`
                font-size: 18px;
              `}
              key={player.nickname}
            >
              {aboutOpponent(player)}
            </span>
          ))}
      </div>
      <div>
        <h3>
          {listOfPlayers
            .filter((player) => player.nickname !== username)
            .every((player) => player.choise)
            ? "Everybody wait for you, make your choise:"
            : "Make your choise (you also can change decision)"}
        </h3>
        <div
          className={css`
            display: flex;
          `}
        >
          {kindOfElements.map((elemet) => (
            <span
              className={css`
                border: 2px solid #c3bdf4;
                margin: 10px 10px 10px 0;
                padding: 10px 20px;
                cursor: pointer;
              `}
              onClick={() => socket.emit("choose", elemet)}
              key={elemet}
            >
              {elemet}
            </span>
          ))}
        </div>
      </div>
      <div
        className={css`
          border: 2px solid #d2e7cb;
          margin: 10px 0;
          padding: 10px 20px;
        `}
      >
        {listOfPlayers[0]?.finished
          ? listOfPlayers.find((player) => player.nickname === username)
              ?.finished
          : "Here you will see the result"}
      </div>
    </div>
  );
};

export default App;
