import React from "react"
import { StyleProp, TextStyle, TouchableOpacity, View, ViewStyle } from "react-native"

import { colors } from "../theme"
import {Text, TextProps} from './Text'


const colorSchemes = {
  default: colors.tag.grey,
  error: colors.tag.red,
  success: colors.tag.green,
  warning: colors.tag.yellow,
};

type ColorSchemeType = keyof typeof colorSchemes;

export interface TagProps {
  preset?: 'light' | 'dark';
  colorScheme?: ColorSchemeType;
  title: string;
  style?: StyleProp<ViewStyle>;
  fontStyle?: StyleProp<TextStyle>;
  touchableStyle?: StyleProp<ViewStyle>;
  onPress?(): void;
  bold?: boolean;
  TextProps?: TextProps
}

export function Tag(props: TagProps) {
  const {
    preset = 'light',
    colorScheme = 'default',
    title,
    style,
    fontStyle,
    touchableStyle,
    TextProps,
    onPress,
    bold = true,
  } = props;

  if (preset === 'dark') {
    return (
      <TouchableOpacity
        style={touchableStyle}
        disabled={!onPress}
        onPress={onPress}>
        <View
          style={[
            $tags,
            {
              borderColor: colorSchemes[colorScheme].primary,
              backgroundColor: colorSchemes[colorScheme].primary,
            },
            style,
          ]}>
          <Text
            {...TextProps}
            style={[
              {
                color: colorSchemes[colorScheme].secondary,
                fontWeight: bold ? 'bold' : 'normal',
              },
              fontStyle,
            ]}>
            {title}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={touchableStyle}
      disabled={!onPress}
      onPress={onPress}>
      <View
        style={[
          $tags,
          {
            borderColor: colorSchemes[colorScheme].primary,
            backgroundColor: colorSchemes[colorScheme].secondary,
          },
          style,
        ]}>
        <Text
          {...TextProps}
          style={[
            {
              color: colorSchemes[colorScheme].primary,
              fontWeight: bold ? 'bold' : 'normal',
            },
            fontStyle,
          ]}>
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );
}


const $tags: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 2,
  marginRight: 5,
  borderWidth: 1,
  alignSelf: 'center',
};
