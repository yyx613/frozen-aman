import React, { FC, useEffect } from "react"
import { ViewStyle, Image, View, ImageStyle, TextStyle, Alert, ScrollView, RefreshControl } from "react-native"

import { AppStackScreenProps } from "../../navigators"
import { Text, Header, Button } from "../../components"
import { spacing, colors } from "../../theme"
import { algorithm } from "app/utils/algorithm"
import { useStores } from "app/models"
import { observer } from "mobx-react-lite"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import LottieView from "lottie-react-native"
import { useIsFocused } from "@react-navigation/native"

const IceCubeImage = require("../../../assets/images/bread.png")
const EmptyLottie = require("../../../assets/lottie/emptyBox.json")

interface InventoryProps extends AppStackScreenProps<"Inventory"> {}

export const InventoryScreen: FC<InventoryProps> = observer(function InventoryScreen(_props) {
  const { bottom } = useSafeAreaInsets()
  const { navigation } = _props
  const { stockStore } = useStores()
  const isFocused = useIsFocused()


  useEffect(() => {
    ;(async () => {
      if(isFocused) await handleLoadStocks()
    })()
  }, [isFocused])

  async function handleLoadStocks() {
    const response = await stockStore.loadStocks()
    if (response.kind === "pendingOrderError") {
      Alert.alert("Pending Orders Subimssion", "Please submit all your pending orders.", [
        { text: "OK", onPress: () => navigation.push("PendingOrder") },
      ])
    }
  }

  function handleStockTransfer() {
    navigation.push("ActivityLogTab")
  }


  return (
    <>
      <View style={$screen}>
        <Header title={"Inventory"} safeAreaEdges={["top"]} />
        <ScrollView showsVerticalScrollIndicator={false} refreshControl={<RefreshControl refreshing={stockStore.isLoading} onRefresh={handleLoadStocks} />}>
          {algorithm.toMatrix(stockStore.stocks, 2)?.map((row) => (
            <View key={row.key} style={$rowView}>
              {row.value.map((col) => (
                <View key={col.name} style={$productView}>
                  <Image source={IceCubeImage} style={$iceImage} />
                  <Text size={"sm"} weight={"bold"} numberOfLines={1}>
                    {col.name}
                  </Text>
                  <Text
                    size={"sm"}
                    weight={"semiBold"}
                    style={$stockText}
                  >{`${col.quantity} unit`}</Text>
                </View>
              ))}
            </View>
          ))}

          {stockStore.stocks?.length === 0 && (
            <LottieView source={EmptyLottie} autoPlay={true} style={$emptyView} loop={true} />
          )}
        </ScrollView>
        <View style={{ height: bottom + 100 }} />
      </View>

      <Button
        onPress={handleStockTransfer}
        preset={"filled"}
        text={"Stock Transaction History"}
        style={{ ...$bottomButton, bottom: bottom + 10 }}
      />
    </>
  )
})

const $screen: ViewStyle = {
  marginHorizontal: spacing.md,
  flex: 1,
}

const $rowView: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  padding: 20,
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

const $bottomButton: ViewStyle = {
  borderRadius: 30,
  width: 300,
  position: "absolute",
  bottom: 5,
  alignSelf: "center",
}

const $emptyView: ImageStyle = {
  width: "70%",
  alignSelf: "center",
  marginTop: 50,
  // flex: 2,
}
