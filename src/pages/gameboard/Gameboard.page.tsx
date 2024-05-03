import styles from './gameboard.page.module.scss'
import GameBoard from "@library/components/game/gameBoard/GameBoard.tsx";

export const GameboardPage = () => {
  return (
    <div className={styles.container}>
      <div className={styles.section}>
        <GameBoard />
      </div>
    </div>
  );
};
