import React from "react"
import { View, TouchableOpacity, ViewStyle, TextStyle, ImageStyle } from "react-native"
import { BottomModal } from "../BottomModal"
import { TextField } from "../TextField"
import { Text } from "../Text"
import { Icon } from "../Icon"
import { Button } from "../Button"
import { colors } from "app/theme"

export interface QuantityModalProps {
  isVisble: boolean
  title: string
  onCancel(): void
  onMinus(): void
  onAdd(): void
  onChangeText(text: string): void
  onConfirm(): void
  quantity: string
  remaining: string
}

export function QuantityModal(props: QuantityModalProps) {
  const {
    isVisble,
    title,
    onCancel,
    onMinus,
    onAdd,
    onChangeText,
    onConfirm,
    quantity,
    remaining,
  } = props

  return (
    <BottomModal preset={"mini"} isVisible={isVisble} onCancel={onCancel}>
      <View style={$container}>
        <Text size={"lg"} weight={"bold"} style={$title}>
          {title}
        </Text>

        <View style={$row}>
          <TouchableOpacity onPress={onMinus} style={$minusButton}>
            <Icon icon={"minus"} size={20} style={$icon} />
          </TouchableOpacity>

          <TextField
            value={quantity}
            onChangeText={(text) => onChangeText(text)}
            keyboardType={"numeric"}
            containerStyle={{ width: 100 }}
            textAlign={"center"}
          />

          <TouchableOpacity onPress={onAdd} style={$plusButton}>
            <Icon icon={"plus"} size={20} style={$icon} />
          </TouchableOpacity>
        </View>
        {
          remaining && <Text style={$remainingText}>{`Remaining ${remaining}`}</Text>
        }

        <Button
          onPress={onConfirm}
          preset={"filled"}
          text={"Add to basket"}
          style={$confirmButton}
        />
      </View>
    </BottomModal>
  )
}

const $container: ViewStyle = {
  justifyContent: "center",
  alignItems: "center",
  paddingVertical: 20,
}

const $title: TextStyle = {
  marginBottom: 20,
}

const $row: ViewStyle = {
  flexDirection: "row",
  marginHorizontal: 20,
}

const $minusButton: ViewStyle = {
  backgroundColor: colors.palette.secondary300,
  borderRadius: 50,
  padding: 10,
  marginRight: 20,
  justifyContent: "center",
}

const $plusButton: ViewStyle = {
  backgroundColor: colors.palette.primary500,
  borderRadius: 50,
  padding: 10,
  marginLeft: 20,
  justifyContent: "center",
}

const $icon: ImageStyle = {
  tintColor: colors.palette.neutral100,
}

const $remainingText: TextStyle = {
  marginTop: 5,
  color: colors.palette.secondary200,
}

const $confirmButton: ViewStyle = {
  borderRadius: 30,
  width: 250,
  marginTop: 30,
}
