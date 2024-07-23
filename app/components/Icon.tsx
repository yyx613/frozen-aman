import * as React from "react"
import { ComponentType } from "react"
import {
  Image,
  ImageStyle,
  StyleProp,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  ViewStyle,
} from "react-native"

export type IconTypes = keyof typeof iconRegistry

interface IconProps extends TouchableOpacityProps {
  /**
   * The name of the icon
   */
  icon: IconTypes

  /**
   * An optional tint color for the icon
   */
  color?: string

  /**
   * An optional size for the icon. If not provided, the icon will be sized to the icon's resolution.
   */
  size?: number

  /**
   * Style overrides for the icon image
   */
  style?: StyleProp<ImageStyle>

  /**
   * Style overrides for the icon container
   */
  containerStyle?: StyleProp<ViewStyle>

  /**
   * An optional function to be called when the icon is pressed
   */
  onPress?: TouchableOpacityProps["onPress"]
}

/**
 * A component to render a registered icon.
 * It is wrapped in a <TouchableOpacity /> if `onPress` is provided, otherwise a <View />.
 *
 * - [Documentation and Examples](https://github.com/infinitered/ignite/blob/master/docs/Components-Icon.md)
 */
export function Icon(props: IconProps) {
  const {
    icon,
    color,
    size,
    style: $imageStyleOverride,
    containerStyle: $containerStyleOverride,
    ...WrapperProps
  } = props

  const isPressable = !!WrapperProps.onPress
  const Wrapper: ComponentType<TouchableOpacityProps> = WrapperProps?.onPress
    ? TouchableOpacity
    : View

  return (
    <Wrapper
      accessibilityRole={isPressable ? "imagebutton" : undefined}
      {...WrapperProps}
      style={$containerStyleOverride}
    >
      <Image
        style={[
          $imageStyle,
          color && { tintColor: color },
          size && { width: size, height: size },
          $imageStyleOverride,
        ]}
        source={iconRegistry[icon]}
      />
    </Wrapper>
  )
}

export const iconRegistry = {
  back: require("../../assets/icons/back.png"),
  bell: require("../../assets/icons/bell.png"),
  caretLeft: require("../../assets/icons/caretLeft.png"),
  caretRight: require("../../assets/icons/caretRight.png"),
  check: require("../../assets/icons/check.png"),
  clap: require("../../assets/icons/clap.png"),
  community: require("../../assets/icons/community.png"),
  components: require("../../assets/icons/components.png"),
  debug: require("../../assets/icons/debug.png"),
  github: require("../../assets/icons/github.png"),
  heart: require("../../assets/icons/heart.png"),
  hidden: require("../../assets/icons/hidden.png"),
  ladybug: require("../../assets/icons/ladybug.png"),
  lock: require("../../assets/icons/lock.png"),
  menu: require("../../assets/icons/menu.png"),
  more: require("../../assets/icons/more.png"),
  pin: require("../../assets/icons/pin.png"),
  podcast: require("../../assets/icons/podcast.png"),
  settings: require("../../assets/icons/settings.png"),
  slack: require("../../assets/icons/slack.png"),
  view: require("../../assets/icons/view.png"),
  x: require("../../assets/icons/x.png"),
  email: require("../../assets/icons/mail.png"),
  password: require("../../assets/icons/padlock.png"),
  home: require("../../assets/icons/home.png"),
  stock: require("../../assets/icons/stock.png"),
  delivery: require("../../assets/icons/lorry.png"),
  cart: require("../../assets/icons/shopping-cart.png"),
  box: require("../../assets/icons/stock.png"),
  credit: require("../../assets/icons/label.png"),
  dollar: require("../../assets/icons/dollar.png"),
  drag: require("../../assets/icons/drag.png"),
  plus: require("../../assets/icons/plus.png"),
  minus: require("../../assets/icons/minus.png"),
  next: require("../../assets/icons/next.png"),
  bank: require("../../assets/icons/bank.png"),
  creditCard: require("../../assets/icons/credit-card.png"),
  cash: require("../../assets/icons/cash.png"),
  id: require("../../assets/icons/id.png"),
  note: require("../../assets/icons/note.png"),
  deliveryStatus: require("../../assets/icons/delivery-status.png"),
  map: require("../../assets/icons/map.png"),
  phone: require("../../assets/icons/phone.png"),
  history: require("../../assets/icons/history.png"),
  down: require("../../assets/icons/arrow-down.png"),
  search: require("../../assets/icons/search.png"),
  taskTransfer: require("../../assets/icons/task-transfer.png"),
  print: require("../../assets/icons/print.png"),
  calendar: require("../../assets/icons/calendar.png"),
  user: require("../../assets/icons/user.png"),
  summary: require("../../assets/icons/summary.png"),
  arrowDown: require("../../assets/icons/down-arrow.png"),
  creditNote: require("../../assets/icons/tag.png"),
  payment: require("../../assets/icons/coin.png"),
  logout: require("../../assets/icons/logout.png"),
}

const $imageStyle: ImageStyle = {
  resizeMode: "contain",
}
