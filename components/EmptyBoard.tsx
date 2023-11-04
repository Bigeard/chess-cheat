import { View, Text } from 'dripsy';
import { FlatGrid } from 'react-native-super-grid';

const BOARD_SIZE = 8;

const EmptyBoard = ({ size }: any) => {
    return (
        <View
            sx={{
                width: size,
                height: size,
                backgroundColor: '#fff',
                borderRadius: '10%',
            }}
        >
            <FlatGrid
                scrollEnabled={false}
                staticDimension={size}
                itemDimension={size / BOARD_SIZE}
                fixed
                spacing={0}
                data={[...Array(BOARD_SIZE * BOARD_SIZE).keys()]}
                renderItem={({ item: index }: any) => {
                    const col = Math.floor(index / BOARD_SIZE);
                    const row = index % BOARD_SIZE;
                    const color = (row + col) % 2 === 0 ? '#ddd' : '#fff';
                    return (
                        <View
                            key={index.toString()}
                            sx={{
                                width: size / BOARD_SIZE,
                                height: size / BOARD_SIZE,
                                backgroundColor: color,
                                borderTopStartRadius: index === 0 ? '10%' : 0,
                                borderTopEndRadius: index === 7 ? '10%' : 0,
                                borderBottomStartRadius: index === 56 ? '10%' : 0,
                                borderBottomEndRadius: index === 63 ? '10%' : 0
                            }}
                        ><Text style={{ color: "#8c8c8c", padding: 4}}>{(index % 8 + 1 + 9).toString(36)}{Math.floor(index / 8) + 1}</Text>
                        </View>
                    );
                }}
            />
        </View>
    );
};

export default EmptyBoard;