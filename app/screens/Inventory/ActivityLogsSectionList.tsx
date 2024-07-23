import React from "react"
import { SectionList, ViewStyle, TextStyle ,View} from "react-native"
import { ListItem, Text } from "app/components"
import { colors } from "app/theme"
import { TRANSACTION_TYPE } from "./constant"

export function ActivityLogsSectionList(props) {
  const { data, onRefresh, isLoading } = props

  const renderItem = (props) => {
    return (
      <ListItem
        text={props.item.name}
        containerStyle={$container}
        RightComponent={<Text style={$quantity}>{props.item.quantity}</Text>}
      />
    )
  }

  const renderSectionHeader = (props) => {
    const { section } = props
    return (
      <View style={$sectionHeader}>
        <Text weight="bold" >
          {TRANSACTION_TYPE[section.type]}
        </Text>
      </View>
    )
  }

  return (
    <SectionList
      onRefresh={onRefresh}
      refreshing={isLoading}
      sections={data}
      renderItem={(props) => renderItem(props)}
      renderSectionHeader={(props) => renderSectionHeader(props)}
    />
  )
}

const $container: ViewStyle = {
  paddingHorizontal: 20,
  backgroundColor: colors.palette.neutral100,
}

const $sectionHeader: ViewStyle = {
  paddingHorizontal: 20,
  paddingVertical: 10,
  backgroundColor: colors.background
}

const $quantity: TextStyle = {
  alignSelf: "center",
}


