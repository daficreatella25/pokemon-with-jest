import React from 'react';
import {StyleSheet, View} from 'react-native';

interface Props {
    width?: number
    heigth?: number
}

export const Spacer = (props:Props): JSX.Element => {
    const styles = StyleSheet.create({
        generatedStyle : {
            width: props.width ?? 0,
            height: props.heigth ?? 0 
        }
    })

  return <View  style={styles.generatedStyle}/>;
};

export default Spacer;
