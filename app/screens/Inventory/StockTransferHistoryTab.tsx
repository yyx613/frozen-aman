import React, { FC, useEffect } from "react"
import { Alert, ViewStyle, View } from "react-native"
import { Button, Header, Loading } from "app/components"
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs"
import { observer } from "mobx-react-lite"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { AppStackScreenProps } from "app/navigators"
import { useStores } from "app/models"
import { StockTransferTaskSectionList } from "./StockTransferTaskSectionList"
import { STOCK_TRANSFER } from "./constant"

const Tab = createMaterialTopTabNavigator()

export const StockTransferHistoryTab: FC<AppStackScreenProps<"StockTransferHistory">> = observer(
  function StockTransferHistoryTab(_props) {
    const { bottom } = useSafeAreaInsets()
    const { navigation } = _props
    const { stockStore, tripStore } = useStores()

    useEffect(() => {
      ;(async () => {
        stockStore.loadStockTransferTask().then()
        stockStore.resetCart()
        handleLoadStocks()
      })()
    }, [])

    async function handleLoadStocks() {
      const response = await stockStore.loadStocks()
      if (response.kind === "pendingOrderError") {
        Alert.alert(
          "Pending Orders Subimssion",
          "Please submit all your pending orders before create new order.",
          [{ text: "OK", onPress: () => navigation.push("PendingOrder") }],
        )
      }
    }

    function handleStockTransfer() {
      if (tripStore.status) return navigation.push("StockTransfer")
      Alert.alert("Please satrt a trip before stock transfer.")
    }

    function handleOnSelectItem({ id, type, status }) {
      navigation.push("StockTransferTaskDetails", { id, type, status })
    }

    async function handleRefresh() {
      await stockStore.loadStockTransferTask()
      stockStore.resetCart()
    }

    function handleGoBack() {
      navigation.goBack()
    }

    return (
      <>
        <Header title="Stock Transfer History" leftIcon="back" onLeftPress={handleGoBack} />
        <Tab.Navigator>
          <Tab.Screen
            name="Request"
            children={() => (
              <StockTransferTaskSectionList
                data={stockStore.getRequestStockTransferTask()}
                isLoading={stockStore.isLoading}
                onRefresh={handleRefresh}
                onSelectItem={handleOnSelectItem}
                type={STOCK_TRANSFER.TASK_TYPE.TO_DRIVER}
              />
            )}
          />
          <Tab.Screen
            name="Approve"
            children={() => (
              <StockTransferTaskSectionList
                data={stockStore.getApproveStockTransferTask()}
                isLoading={stockStore.isLoading}
                onRefresh={handleRefresh}
                onSelectItem={handleOnSelectItem}
                type={STOCK_TRANSFER.TASK_TYPE.FROM_DRIVER}
              />
            )}
          />
        </Tab.Navigator>
        {stockStore.isLoading && <Loading preset="blurFullScreen" />}

        <View style={{ height: bottom + 100 }} />

        <Button
          onPress={handleStockTransfer}
          preset={"filled"}
          text={"Stock Transfer"}
          style={{ ...$bottombButton, bottom: bottom + 10 }}
        />
      </>
    )
  },
)

const $bottombButton: ViewStyle = {
  borderRadius: 30,
  width: 300,
  position: "absolute",
  alignSelf: "center",
}
