import React, { FC } from "react"
import { observer } from "mobx-react-lite"
import { TextStyle, TouchableOpacity, View, ViewStyle } from "react-native"
import Animated, {
  Easing,
  Extrapolate,
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated"
import { colors } from "../../../theme"

interface TabBarProps {
  onTabChange: (index) => void
}

export const TabBar: FC<TabBarProps> = observer(function TabBar(_props) {
  const { onTabChange } = _props
  const animValue = useSharedValue(0)

  const handleTabPress = (tabIndex: number) => {
    onTabChange(tabIndex)
    animValue.value = withTiming(tabIndex, {
      duration: 300,
      easing: Easing.linear,
    })
  }

  const tab1Color = useAnimatedStyle(() => {
    return {
      color: interpolateColor(animValue.value, [0, 1], [colors.palette.primary500, colors.palette.secondary200]),
    }
  })

  const tab2Color = useAnimatedStyle(() => {
    return {
      color: interpolateColor(animValue.value, [0, 1], [colors.palette.secondary200, colors.palette.primary500]),
    }
  })

  const lineStyle = useAnimatedStyle(() => {
    const translateX = interpolate(
      animValue.value,
      [0, 1],
      [0, 100],
      Extrapolate.CLAMP,
    )

    return {
      width: 100,
      transform: [{ translateX }],
    }
  })

  return (
    <View style={$tabContainer}>
      <TouchableOpacity onPress={() => handleTabPress(0)} style={$tabButton}>
        <Animated.Text style={[$tabText, tab1Color]}>In</Animated.Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleTabPress(1)} style={$tabButton}>
        <Animated.Text style={[$tabText, tab2Color]}>Out</Animated.Text>
      </TouchableOpacity>
      <Animated.View style={[$line, lineStyle]} />
    </View>
  )
})

const $tabContainer: ViewStyle = {
  flexDirection: "row",
  backgroundColor: "white",
  alignItems: "center",
  height: 50,
  paddingHorizontal: 100,
}

const $tabButton: ViewStyle = {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
}

const $tabText: TextStyle = {
  fontSize: 18,
  fontWeight: "bold",
}

const $line: ViewStyle = {
  position: "absolute",
  height: 2,
  backgroundColor: colors.palette.primary500,
  bottom: 0,
  marginHorizontal: 100,
}
