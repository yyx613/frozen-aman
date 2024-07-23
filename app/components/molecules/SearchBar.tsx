import React from "react"
import { TouchableOpacity, TextInput, ViewStyle, TextStyle } from "react-native"

import { Icon } from "../Icon"
import { colors, typography } from "app/theme"

interface SearchBarProps {
  placeholder?: string
  value?: string
  onChangeText(text: string): void
  viewStyle?: ViewStyle
  textInputStyle?: TextStyle
}

export function SearchBar(props: SearchBarProps) {
  const { placeholder = "Search", value, onChangeText, viewStyle, textInputStyle } = props
  return (
    <TouchableOpacity style={{ ...$searhContainer, ...viewStyle }}>
      <Icon icon="search" size={20} color={colors.palette.primary500} />
      <TextInput
        value={value}
        placeholder={placeholder}
        style={{ ...$textInput, ...textInputStyle }}
        onChangeText={onChangeText}
        placeholderTextColor={colors.text}
      />
    </TouchableOpacity>
  )
}

const $searhContainer: ViewStyle = {
  backgroundColor: colors.palette.secondary100,
  borderRadius: 10,
  padding: 10,
  marginHorizontal: 20,
  marginTop: 20,
  flexDirection: "row",
  alignItems: "center",
}

const $textInput: TextStyle = {
  fontFamily: typography.primary.normal,
  color: colors.text,
  fontSize: 14,
  height: 30,
  flex: 1,
  textAlignVertical: "center",
  paddingVertical: 0,
  paddingHorizontal: 0,
  marginHorizontal: 5,
}
