import React from "react"
import LottieView from "lottie-react-native"
import { Dimensions, FlatList, ImageStyle, TouchableOpacity, View, ViewStyle } from "react-native"
import { colors } from "../../../theme"
import { Tag, Text } from "../../../components"
import { DELIVERY } from "../constant"
import { Observer } from "mobx-react-lite"
import { sortCustomerListByCode } from "app/utils/sorting"

const EmptyJSON = require("../../../../assets/lottie/empty.json")

const { width } = Dimensions.get("window")

type TaskListProps = {
  list: any[]
  onItemPress(customerId: string): void
  onRefresh(): void
  isLoading: boolean
}

export function TaskList(props: TaskListProps) {
  const { list, onItemPress, isLoading, onRefresh } = props

  const sortedList = sortCustomerListByCode(list)

  function renderEmpty() {
    if (list.length === 0)
      return <LottieView source={EmptyJSON} autoPlay={true} style={$emptyView} loop={true} />
    return <View style={$footer} />
  }

  function renderItem(props) {
    const { item } = props
    return (
      <Observer>
        {() => (
          <TouchableOpacity
            onPress={() => onItemPress(item.id)}
            key={item.id}
            style={{
              ...$listItemView,
              backgroundColor:
                item.based === 1 ? colors.palette.neutral100 : colors.palette.primary400,
            }}
          >
            <View style={{ flex: 3 }}>
              <Text size={"xxs"}>{item.customer.code}</Text>
              <Text size={"sm"} weight={"semiBold"} numberOfLines={1}>
                {item.customer.company}
              </Text>
              <Text size={"xxs"}>{item.customer.phone}</Text>
            </View>
            <View style={$tagIconContainer}>
              <Tag
                title={DELIVERY.TASK_STATUS[item.status]}
                colorScheme={item.status === DELIVERY.COMPLETED_STATUS ? "success" : "warning"}
                TextProps={{ size: "xxs" }}
              />
            </View>
          </TouchableOpacity>
        )}
      </Observer>
    )
  }

  return (
    <FlatList
      onRefresh={onRefresh}
      refreshing={isLoading}
      data={sortedList}
      keyExtractor={(item) => item.id}
      renderItem={(props) => renderItem(props)}
      showsVerticalScrollIndicator={false}
      ListFooterComponent={renderEmpty}
    />
  )
}

const $listItemView: ViewStyle = {
  flexDirection: "row",
  borderRadius: 10,
  backgroundColor: colors.palette.neutral100,
  width: width * 0.85,
  padding: 10,
  alignItems: "center",
  justifyContent: "space-between",
  marginVertical: 5,
}

const $tagIconContainer: ViewStyle = {
  flexDirection: "row",
  alignItems: "flex-end",
  justifyContent: "flex-end",
  flex: 1,
}

const $footer: ViewStyle = {
  height: 250,
}

const $emptyView: ImageStyle = {
  width: "70%",
  alignSelf: "center",
  flex: 2,
}
