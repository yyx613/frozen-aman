import React from "react"
import {
  Image,
  ImageSourcePropType,
  ImageStyle,
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
  ViewStyle,
} from "react-native"
import { Text } from "../Text"
import { colors } from "app/theme"

export interface ProductCardProps extends TouchableOpacityProps {
  image: ImageSourcePropType
  tittle: string
  subtitle: string
  value?: string
}

export function ProductCard(props: ProductCardProps) {
  const { image, tittle, subtitle, onPress, value } = props
  return (
    <>
      <TouchableOpacity onPress={onPress} style={$productView}>
        <Image source={image} style={$iceImage} />
        <Text size={"sm"} weight={"bold"} style={$productName}>
          {tittle}
        </Text>
        <Text size={"sm"} weight={"semiBold"} style={$stockText}>
          {subtitle}
        </Text>
        {value && (
          <Text size={"sm"} weight={"semiBold"} style={$stockText}>
            {value}
          </Text>
        )}
      </TouchableOpacity>
    </>
  )
}

const $productView: ViewStyle = {
  backgroundColor: colors.palette.neutral100,
  padding: 20,
  borderRadius: 10,
  alignItems: "center",
  justifyContent: "center",
  flex: 1,
  marginHorizontal: 10,
}

const $iceImage: ImageStyle = {
  width: 50,
  height: 50,
}

const $stockText: TextStyle = {
  color: colors.palette.secondary300,
}

const $productName: TextStyle = {
  textAlign: "center",
}
