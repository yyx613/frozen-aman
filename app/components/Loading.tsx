import * as React from 'react';
import { ActivityIndicator, ColorValue, View, Image, ViewStyle, ImageStyle } from "react-native"
import { colors } from "../theme"

const LoadingGif = require('../../assets/images/loading.gif');

interface LoadingProps {
  preset?: 'absolute' | 'fullscreen' | 'blurFullScreen' | 'list';
  size?: 'small' | 'large';
  color?: ColorValue;
}

export function Loading(props: LoadingProps) {
  const { preset, size, color = colors.palette.primary500 } = props;

  if (preset === 'absolute') {
    return (
      <View style={$absolute}>
        <ActivityIndicator animating={true} size={size} color={color} />
      </View>
    );
  }

  if (preset === 'fullscreen') {
    return (
      <View style={$loadingBackdrop}>
        <View style={$load}>
          <ActivityIndicator color={color} size={size ?? 'large'} />
        </View>
      </View>
    );
  }

  if (preset === 'blurFullScreen') {
    return (
      <View
        style={{
          ...$loadingBackdrop,
          ...$background,
        }}
      >
        <View style={$load}>
          <ActivityIndicator color={color} size={size ?? 'large'} />
        </View>
      </View>
    );
  }

  if (preset === 'list') {
    return (
      <View style={$gifView}>
        <Image source={LoadingGif} style={$gifImage} />
      </View>
    );
  }
  return <ActivityIndicator animating={true} size={size} color={color} />;
}



const $absolute: ViewStyle = {
  position: 'absolute',
  width: '100%',
  height: '100%',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'rgba(0,0,0,0.2)',
};

const $loadingBackdrop: ViewStyle = {
  position: 'absolute',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  justifyContent: 'center',
  alignItems: 'center',
};

const $load: ViewStyle = {
  width: 70,
  height: 70,
  borderRadius: 20,
  paddingLeft: 2,
  paddingTop: 1,
  backgroundColor: colors.palette.neutral100,
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: 44,
};

const $gifImage: ImageStyle = {
  width: 80,
  height: 40,
};
const $gifView: ViewStyle = {
  width: '100%',
  alignItems: 'center',
};

const $background: ViewStyle = {
  backgroundColor: 'rgba(0,0,0,0.1)',
};
