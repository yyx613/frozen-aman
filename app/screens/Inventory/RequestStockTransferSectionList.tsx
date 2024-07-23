import React from "react"
import { ImageStyle, SectionList, TextStyle, ViewStyle } from "react-native"
import { STOCK_TRANSFER } from "./constant"
import { ListItem, Text } from "app/components"
import { colors } from "app/theme"
import { Observer } from "mobx-react-lite"
import LottieView from "lottie-react-native"

const EmptyJSON = require("../../../assets/lottie/emptyBox.json")

interface RequestStockTransferTaskSectionListProps{
  data: any[];
  isLoading: boolean;
  type: string;
  onSelectItem(id: string, type: string): void,
  onRefresh(): void
}

export function RequestStockTransferTaskSectionList(props:RequestStockTransferTaskSectionListProps ) {
  const {data, isLoading, type, onSelectItem, onRefresh}= props

  function handleSelectItem(id) {
    onSelectItem(id, type)
  }

  const renderEmpty=()=>{
    if(data.length=== 0)
      return <LottieView source={EmptyJSON} autoPlay={true} style={$emptyView} loop={true} />
  }

  const renderItem = (props) => {
    return (
      <Observer>
        {() => (
          <ListItem
            onPress={() => handleSelectItem(props.item.id)}
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
      <Text weight="bold" style={$sectionHeader}>
        {STOCK_TRANSFER.STATUS[section.status]}
      </Text>
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
  flex:2
}
