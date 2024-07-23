import { ImageStyle, Pressable, PressableProps, StyleProp, TextStyle, View, ViewStyle } from "react-native"
import { Text, TextProps } from "./Text"
import React from "react"
import { colors, spacing, typography } from "../theme"
import { Icon, IconTypes } from "./Icon"

export interface IconButtonProps extends PressableProps {
  /**
   * The name of the icon
   */
  icon: IconTypes

  /**
   * An optional tint color for the icon
   */
  iconColor?: string

  /**
   * An optional size for the icon. If not provided, the icon will be sized to the icon's resolution.
   */
  iconSize?: number

  /**
   * Style overrides for the icon image
   */
  imageStyle?: StyleProp<ImageStyle>
  /**
   * Text which is looked up via i18n.
   */
  tx?: TextProps["tx"]
  /**
   * The text to display if not using `tx` or nested components.
   */
  text?: TextProps["text"]
  /**
   * Optional options to pass to i18n. Useful for interpolation
   * as well as explicitly setting locale or translation fallbacks.
   */
  txOptions?: TextProps["txOptions"]
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>
  /**
   * An optional style override for the "pressed" state.
   */
  pressedStyle?: StyleProp<ViewStyle>
  /**
   * An optional style override for the button text.
   */
  textStyle?: StyleProp<TextStyle>
  /**
   * An optional style override for the button text when in the "pressed" state.
   */
  pressedTextStyle?: StyleProp<TextStyle>
}

export function IconButton(props: IconButtonProps) {
  const {
    icon,
    iconColor,
    iconSize,
    tx,
    text,
    txOptions,
    style: $viewStyleOverride,
    pressedStyle: $pressedViewStyleOverride,
    textStyle: $textStyleOverride,
    pressedTextStyle: $pressedTextStyleOverride,
    ...rest
  } = props

  function $viewStyle({ pressed }) {
    return [
      $viewPresets,
      $viewStyleOverride,
      !!pressed && [$pressedViewPresets, $pressedViewStyleOverride],
    ]
  }

  function $textStyle({ pressed }) {
    return [
      $textPresets,
      $textStyleOverride,
      !!pressed && [$pressedTextPresets, $pressedTextStyleOverride],
    ]
  }

  return (
    <Pressable style={$viewStyle} accessibilityRole="button" {...rest}>
      {(state) => (
        <View style={$iconTile}>
          <Icon
            icon={icon}
            color={iconColor}
            size={iconSize}
          />
          <Text tx={tx} text={text} txOptions={txOptions} style={$textStyle(state)}/>
        </View>
      )}
    </Pressable>
  )
}

const $viewPresets: ViewStyle = {
  minHeight: 56,
  borderRadius: 4,
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "row",
  paddingVertical: spacing.xs,
  paddingHorizontal: spacing.sm,
  overflow: "hidden",
  width: "25%",
}

const $pressedViewPresets: ViewStyle = {
  backgroundColor: colors.palette.neutral500
}

const $pressedTextPresets: TextStyle = {
  opacity: 0.9
}

const $textPresets: TextStyle = {
  fontSize: 13,
  lineHeight: 20,
  fontFamily: typography.primary.medium,
  textAlign: "center",
  flexShrink: 1,
  flexGrow: 0,
  zIndex: 2,
  color: colors.textDim
}

const $iconTile: ViewStyle = {
  alignItems: "center",
  paddingVertical: spacing.xs,
}
