import { View } from 'dripsy';
import { TouchableWithoutFeedback } from 'react-native';

const Moves = ({ visibleMoves, size, onSelectMove }: any) => {
    const cellSize = size / 8;
    return visibleMoves.map((move: any) => {
        const { to } = move;
        const [file, rank] = to.split('');
        const left = (file.charCodeAt(0) - 'a'.charCodeAt(0)) * cellSize + cellSize / 4;
        const bottom = (rank - 1) * cellSize + cellSize / 4;
        return (
            <TouchableWithoutFeedback onPressOut={() => onSelectMove(move)} key={`move-${to}`}>
                <View
                  style={{borderRadius: 100, opacity: 0.4, shadowColor: 'black'}}
                  sx={{ 
                    backgroundColor: '#000',
                    position: 'absolute',
                    width: size / 8 / 2, 
                    height: size / 8 / 2, left, bottom 
                  }}
                >
                </View>
            </TouchableWithoutFeedback>
        );
    });
};

export default Moves;