import React from "react"
import { SectionList, ViewStyle, TextStyle, ImageStyle, View } from "react-native"
import { STOCK_TRANSFER } from "./constant"
import { ListItem, Text } from "app/components"
import { colors } from "app/theme"
import { Observer } from "mobx-react-lite"
import LottieView from "lottie-react-native"

const EmptyJSON = require("../../../assets/lottie/emptyBox.json")
interface StockTransferTaskSectionListProps {
  data: any[]
  isLoading: boolean
  onSelectItem({ id, type, status }): void
  onRefresh(): void
  type: string
}

export function StockTransferTaskSectionList(props: StockTransferTaskSectionListProps) {
  const { data, isLoading, onSelectItem, onRefresh, type } = props

  function handleSelectItem({ id, status }) {
    onSelectItem({ id, type, status })
  }
  const renderEmpty = () => {
    if (data.length === 0)
      return <LottieView source={EmptyJSON} autoPlay={true} style={$emptyView} loop={true} />
  }

  const renderItem = (props) => {
    return (
      <Observer>
        {() => (
          <ListItem
            onPress={() => handleSelectItem({ id: props.item.id, status: props.item.status })}
            text={props.item.product.name}
            containerStyle={$container}
            RightComponent={<Text style={$quantity}>{props.item.quantity?.toString()}</Text>}
          />
        )}
      </Observer>
    )
  }

  const renderSectionHeader = (props) => {
    const { section } = props
    return (
      <View style={$sectionView}>
        <Text weight="bold" style={$sectionHeader}>
          {STOCK_TRANSFER.STATUS[section.status]}
        </Text>
      </View>
    )
  }

  return (
    <SectionList
      refreshing={isLoading}
      onRefresh={onRefresh}
      sections={data}
      renderItem={(props) => renderItem(props)}
      renderSectionHeader={(props) => renderSectionHeader(props)}
      ListFooterComponent={renderEmpty()}
      stickySectionHeadersEnabled={true}
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
}

const $quantity: TextStyle = {
  alignSelf: "center",
}

const $emptyView: ImageStyle = {
  width: "50%",
  alignSelf: "center",
  marginTop: 20,
}

const $sectionView: ViewStyle = {
  backgroundColor: colors.background,
}
