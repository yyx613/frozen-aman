import React, { FC } from "react"
import LottieView from "lottie-react-native"
import { observer, Observer } from "mobx-react-lite"
import { Alert, Dimensions, FlatList, View, ViewStyle } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { Button, Header, Loading, Screen, Text } from "../../components"
import { colors } from "../../theme"
import { AppStackScreenProps } from "app/navigators"
import { useStores } from "../../models"

const EmptyJSON = require("assets/lottie/empty.json")

interface PendingOrderProps extends AppStackScreenProps<"PendingOrder"> {}

const { width } = Dimensions.get("screen")

export const PendingOrder: FC<PendingOrderProps> = observer(function PendingOrder(_props) {
  const { navigation } = _props
  const { orderStore } = useStores()
  const { bottom } = useSafeAreaInsets()

  function handleGoBack() {
    navigation.goBack()
  }

  async function handleSubmit() {
    const response = await orderStore.submitPendingTask()
    if (response.kind !== "ok") Alert.alert("Something is wrong. Please submit again.")
    console.log("response", response)
  }

  function renderEmpty() {
    if (orderStore.pendingOrders.length === 0)
      return <LottieView source={EmptyJSON} autoPlay={true} style={$emptyView} loop={true} />
    return <View style={$footer} />
  }

  function renderItem(props) {
    const { item } = props
    return (
      <Observer>
        {() => (
          <View style={$listItemView}>
            <View style={{ flex: 3 }}>
              <Text size={"xxs"}>{item.invoiceNo}</Text>
              <Text size={"sm"} weight={"semiBold"} numberOfLines={1}>
                {item.customerName}
              </Text>
              {/* <Text size={"xxs"}>{item.task.customer.phone}</Text> */}
            </View>
          </View>
        )}
      </Observer>
    )
  }

  return (
    <>
      <Screen safeAreaEdges={["bottom"]}>
        <Header
          title="Pending Orders Submission"
          safeAreaEdges={["top"]}
          leftIcon="back"
          onLeftPress={handleGoBack}
        />
        <FlatList
          data={orderStore.pendingOrders.slice()}
          renderItem={(props) => renderItem(props)}
          keyExtractor={(item) => item.customerId.toString()}
          contentContainerStyle={$listContainer}
          ListFooterComponent={renderEmpty}
        />
      </Screen>

      {orderStore.pendingOrders.length !== 0 && (
        <Button
          onPress={handleSubmit}
          preset={"filled"}
          text={"Submit Pending Orders"}
          style={{ ...$bottomButton, bottom: bottom + 5 }}
        />
      )}

      {orderStore.isLoading && <Loading preset="blurFullScreen" />}
    </>
  )
})

const $listContainer: ViewStyle = {
  marginHorizontal: 20,
  alignItems: "center",
}

const $bottomButton: ViewStyle = {
  borderRadius: 30,
  width: 300,
  position: "absolute",
  alignSelf: "center",
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

const $footer: ViewStyle = {
  height: 250,
}

const $emptyView: ImageStyle = {
  width: "70%",
  alignSelf: "center",
  flex: 2,
}
