import React, { FC } from "react"
import { observer } from "mobx-react-lite"
import { TextStyle, View, ViewStyle } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { AppStackScreenProps } from "app/navigators"
import { Text, Screen, Header, ListItem, Button } from "app/components"
import { colors } from "app/theme"
import { useStores } from "../../models"
import { STOCK_TRANSFER } from "./constant"

interface StockTransferTaskDetailProps extends AppStackScreenProps<"StockTransferTaskDetails"> {}

export const StockTransferTaskDetailScreen: FC<StockTransferTaskDetailProps> = observer(
  function StockTransferTaskDetailScreen(
    _props, // @demo remove-current-line
  ) {
    const { bottom } = useSafeAreaInsets()
    const { navigation, route } = _props
    const { id, type, status } = route.params
    const { stockStore } = useStores()
    const isRequestTask = type === STOCK_TRANSFER.TASK_TYPE.TO_DRIVER
    const task = isRequestTask
      ? stockStore.getRequestStockTransferTaskById(id)
      : stockStore.getPendingApproveStockTransferTaskById(id)

    async function handleReject() {
      await stockStore.updateStockTransfer({ id, status: STOCK_TRANSFER.ACTION.REJECT })
      navigation.popToTop()
      navigation.push("StockTransferHistory")
    }

    async function handleApprove() {
      await stockStore.updateStockTransfer({ id, status: STOCK_TRANSFER.ACTION.APPROVE })
      navigation.popToTop()
      navigation.push("StockTransferHistory")
    }

    function handleGoBack() {
      navigation.goBack()
    }

    function renderButton() {
      if (isRequestTask && status === STOCK_TRANSFER.ACTION.PENDING)
        return (
          <Button
            onPress={handleReject}
            preset={"filled"}
            text={"Cancel Transfer"}
            style={$cancelButton}
          />
        )
      if (!isRequestTask) {
        return (
          <>
            <Button
              onPress={handleReject}
              preset={"filled"}
              text={"Reject"}
              style={$cancelButton}
            />
            <Button
              onPress={handleApprove}
              preset={"filled"}
              text={"Confirm"}
              style={{ width: 150, borderRadius: 30 }}
            />
          </>
        )
      }
      return null
    }
    return (
      <>
        <Screen preset="fixed">
          <Header title="Stock Transfer Details" leftIcon="back" onLeftPress={handleGoBack} />

          <View style={$titleSection}>
            <Text weight={"bold"}>Transfer Summary</Text>
          </View>
          <ListItem
            disabled={true}
            text={task?.product?.name}
            containerStyle={$listContainerView}
            RightComponent={<Text style={$center}>{`${task.quantity} X`}</Text>}
          />
          <ListItem
            disabled={true}
            text={isRequestTask ? "Transfer To: " : "Request From: "}
            containerStyle={$transferToListContainer}
            RightComponent={
              <Text style={$center}>
                {isRequestTask ? task.todriver.name : task.fromdriver.name}
              </Text>
            }
          />

          <ListItem
            disabled={true}
            text="Status"
            RightComponent={
              <Text size={"sm"} weight={"bold"} style={{ ...$center, ...$editText }}>
                {STOCK_TRANSFER.STATUS[task.status]}
              </Text>
            }
            containerStyle={$listContainerView}
          />
        </Screen>
        <View
          style={{
            ...$bottomButtonView,
            bottom: bottom + 10,
          }}
        >
          {renderButton()}
        </View>
      </>
    )
  },
)

const $titleSection: ViewStyle = {
  flexDirection: "row",
  justifyContent: "space-between",
  paddingHorizontal: 20,
  marginBottom: 10,
}

const $editText: TextStyle = {
  color: colors.palette.primary500,
}

const $listContainerView: ViewStyle = {
  backgroundColor: colors.palette.neutral100,
  paddingHorizontal: 20,
}

const $center: TextStyle = {
  alignSelf: "center",
}
const $transferToListContainer: ViewStyle = {
  backgroundColor: colors.palette.neutral100,
  paddingHorizontal: 20,
  marginTop: 20,
}

const $bottomButtonView: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
}

const $cancelButton: ViewStyle = {
  width: 150,
  borderRadius: 30,
  backgroundColor: colors.palette.secondary300,
  marginRight: 10,
}
