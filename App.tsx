import { StyleSheet, useWindowDimensions, Text, Pressable } from 'react-native';
import { useEffect, useRef, useState } from 'react';
import { RootSiblingParent } from 'react-native-root-siblings';
import Toast from 'react-native-root-toast';
import { DripsyProvider, makeTheme } from 'dripsy';

import { DeviceMotion } from 'expo-sensors';
import * as Haptics from 'expo-haptics';

import { View } from 'dripsy';
import { Chess, Move } from 'chess.js'

import EmptyBoard from './components/EmptyBoard';
import Pieces from './components/Pieces';
import Moves from './components/Moves';

const URL_STOCKFISH_SERVER = 'http://vps-797577ef.vps.ovh.net:8989';
const TIMER_NEXT_STEP = 1000;
const theme = makeTheme({});
const chess = new Chess();


const App = () => {
  const countAction = useRef(0);
  const timerAction = useRef(Date.now());
  const onActionInfo = useRef(false);
  const onSelectFromX = useRef(true);
  const onSelectFromY = useRef(false);
  const onSelectToX = useRef(false);
  const onSelectToY = useRef(false);
  const actionPlayer = useRef("");
  const playerColor = useRef('w');
  const [botColor, setBotColor] = useState("Black");
  const [disableButtonChangeColor, setDisableButtonChangeColor] = useState(false);
  const [visibleMoves, setVisibleMoves] = useState<Move[]>([]);

  const { width } = useWindowDimensions();

  const sleep = (ms: number) => {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  const errorMessage = (error: string) => {
    console.log(error);
    Toast.show(error, {position: Toast.positions.TOP, hideOnPress: true, duration: 10000, backgroundColor: "#fff", textColor: "#000" });
  }

  const restartAction = () => {
    onSelectFromX.current = true;
    onSelectFromY.current = false;
    onSelectToY.current = false;
    onSelectToY.current = false;
    countAction.current = 0;
    actionPlayer.current = "";
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
  }

  const onDeviceMotionChange = (event: any) => {
    if (event.rotation.beta > 0.12 && timerAction.current + 600 < Date.now() && 
        chess.turn() === playerColor.current && !onActionInfo.current) {
      
      timerAction.current = Date.now();
      countAction.current = countAction.current + 1;
      console.log("-", countAction.current);

      setVisibleMoves([]);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      if (countAction.current > 8) {
        restartAction();
        errorMessage("Max size of the board 8x8 ❌");
      }

      if (onSelectFromX.current) {
        console.log("onSelect From X");
        // let possibleMoves = chess.moves();
        // console.log(possibleMoves);
        setTimeout(() => {
          if (timerAction.current + TIMER_NEXT_STEP < Date.now()) {
            actionPlayer.current = (countAction.current + 9).toString(36);
            onSelectFromX.current = false;
            onSelectFromY.current = true;
            onSelectToX.current = false;
            onSelectToY.current = false;
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            console.log("onSelect From X Success ✅", countAction.current, event.acceleration.z);
            countAction.current = 0;
          }
        }, TIMER_NEXT_STEP + 100);
      }
      else if (onSelectFromY.current) {
        console.log("onSelect From Y", actionPlayer.current);
        setTimeout(() => {
          if (timerAction.current + TIMER_NEXT_STEP < Date.now()) {
            actionPlayer.current += countAction.current.toString();

            // Check if piece exist for this position
            const checkFrom: any = `${actionPlayer.current[0]}${actionPlayer.current[1]}`;
            if (!chess.get(checkFrom)) {
              restartAction();
              errorMessage("No piece for this position (from) ❌");
              return;
            }

            onSelectFromX.current = false;
            onSelectFromY.current = false;
            onSelectToX.current = true;
            onSelectToY.current = false;
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            console.log("onSelect From Y Success ✅", countAction.current, event.acceleration.z);
            countAction.current = 0;
          }
        }, TIMER_NEXT_STEP + 100);
      }
      else if (onSelectToX.current) {
        console.log("onSelect To X", actionPlayer.current);
        setTimeout(() => {
          if (timerAction.current + TIMER_NEXT_STEP < Date.now()) {
            actionPlayer.current += (countAction.current + 9).toString(36);

            // Check move
            const checkFrom: any = `${actionPlayer.current[0]}${actionPlayer.current[1]}`;
            const piece = chess.get(checkFrom)
            const checkTo = chess.moves().findIndex(m => 
              m[m.length-2] === actionPlayer.current[2] && 
              (
                (m[0] === piece.type.toUpperCase()) || 
                (
                  (piece.type === 'p' && m.length === 2 && actionPlayer.current[0] === actionPlayer.current[2]) || 
                  (m.length === 3 && m[1] === 'x')
                )
              )
            );
            
            if (checkTo < 0) {
              restartAction();
              errorMessage("The move not exist for this piece (to X) ❌");
              return;
            }

            onSelectFromX.current = false;
            onSelectFromY.current = false;
            onSelectToX.current = false;
            onSelectToY.current = true;
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            console.log("onSelect To X Success ✅", countAction.current, event.acceleration.z);
            countAction.current = 0;
          }
        }, TIMER_NEXT_STEP + 100);
      }
      else if (onSelectToY.current) {
        console.log("onSelect To Y", actionPlayer.current);
        setTimeout(() => {
          if (timerAction.current + TIMER_NEXT_STEP < Date.now()) {
            actionPlayer.current += countAction.current.toString();

            // Check move
            const checkTo = chess.moves().findIndex(m => m[m.length-1] === actionPlayer.current[3]);
            if (checkTo < 0) {
              restartAction();
              errorMessage("The move not exist for this piece (to Y) ❌");
              return;
            }

            onSelectFromX.current = true;
            onSelectFromY.current = false;
            onSelectToX.current = false;
            onSelectToY.current = false;
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            console.log("onSelect To Y Success ✅", countAction.current, event.acceleration.z);
            countAction.current = 0;

            // Action Move!
            chess.move(actionPlayer.current);
            setVisibleMoves([]);
            moveBot();
          }
        }, TIMER_NEXT_STEP + 100);
      }
    }
  }

  const codeToNumber = (from: string, to: string) => {
    const fromX = (from[0].charCodeAt(0) - 97) + 1;
    const fromY = parseInt(from[1]);
    const toX = (to[0].charCodeAt(0) - 97) + 1;
    const toY = parseInt(to[1]);
    return [fromX, fromY, toX, toY];
  }

  const vibrationPosition = async (move: number[]) => {
    console.log(move);
    onActionInfo.current = true;
    for (let i = 0; i < 4; i++) {
      const count = move[i];
      await sleep(1000);
      for (let j = 0; j < count; j++) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
        console.log(i, i);
        await sleep(500);
      }
    }
    await sleep(1000);
    onActionInfo.current = false;
  }

  useEffect(() => {
    DeviceMotion.addListener(onDeviceMotionChange);
    return () => {
      DeviceMotion.removeAllListeners();
    };
  }, []);

  const handleSelectPiece = (square: any) => {
    const moves = chess.moves({ square: square, verbose: true });
    setVisibleMoves(moves);
  };

  const handleSelectMove = (move: any) => {
    const r = chess.move(move.promotion ? { ...move, promotion: 'q' } : move);
    console.log(r);
    setVisibleMoves([]);
    moveBot();
  };

  const moveBot = () => {
    if (chess.turn() != playerColor.current) {
      setDisableButtonChangeColor(true);
      // Request to the server
      fetch(URL_STOCKFISH_SERVER, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ "fen": chess.fen() }),
      })
        .then(response => response.text())
        .then(move => {
          console.log("Best move 🤖", move);
          const action = chess.move(move);
          new Promise(() => vibrationPosition(codeToNumber(action.from, action.to)));
        })
        .catch(e => errorMessage("Server 🤖 Error: " + e))
        .finally(() => setDisableButtonChangeColor(false));
    }
  }

  // --- Action Button ---
  const onPressRestartGame = () => {
    restartAction();
    chess.reset();
    moveBot();
  }

  const onPressUndo = () => {
    restartAction();
    chess.undo();
  }

  const onPressPlayerColor = () => {
    restartAction();
    playerColor.current = playerColor.current === 'w' ? 'b' : 'w';
    setBotColor(playerColor.current === 'w' ? "Black" : "White")
    moveBot();
  }

  return (
    <RootSiblingParent>
      <DripsyProvider theme={theme}>
        <View style={styles.container}>
          <Text style={[styles.text, {marginBottom: 16}]}>
            Count: {countAction.current}   -   Move: {actionPlayer.current[0]}{actionPlayer.current[1]} / {actionPlayer.current[2]}{actionPlayer.current[3]}
          </Text>
          <View style={{marginBottom: 50}}>
            <EmptyBoard size={Math.min(width, 400)} />
            <Pieces board={chess.board()} onSelectPiece={handleSelectPiece} size={width} />
            <Moves visibleMoves={visibleMoves} onSelectMove={handleSelectMove} size={width} />
          </View>
          <View style={{marginBottom: 80}}>
            <Pressable style={styles.button} disabled={disableButtonChangeColor} onPress={onPressPlayerColor}>
              <Text style={styles.text}>Bot 🤖 {botColor}</Text>
            </Pressable>
            <Pressable style={styles.button} onPress={onPressRestartGame}>
              <Text style={styles.text}>↻ Restart Game</Text>
            </Pressable>
            <Pressable style={styles.button} onPress={onPressUndo}>
              <Text style={styles.text}>⇦ Undo</Text>
            </Pressable>
          </View>
        </View>
      </DripsyProvider>
    </RootSiblingParent>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: 'black',
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'white',
  },
});

export default App;