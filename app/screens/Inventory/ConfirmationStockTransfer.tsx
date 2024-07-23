import React, { FC } from "react"
import { observer } from "mobx-react-lite"
import { TextStyle, TouchableOpacity, View, ViewStyle, Dimensions } from "react-native"

import { AppStackScreenProps } from "app/navigators"
import { Text, Screen, Header, ListItem, Button } from "app/components"
import { colors } from "app/theme"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useStores } from "../../models"

interface ProductSelectionProps extends AppStackScreenProps<"ProductSelection"> {}

const { width } = Dimensions.get("screen")

export const StockTransferConfirmationScreen: FC<ProductSelectionProps> = observer(
  function StockTransferConfirmationScreen(
    _props, // @demo remove-current-line
  ) {
    const { bottom } = useSafeAreaInsets()
    const { navigation } = _props
    const {
      stockStore: {
        cart,
        reset,
        getTotal,
        selectedDriver,
        getFormattedCartDetails,
        requestStockTransfer,
      },
    } = useStores()

    function handleGoBack() {
      navigation.goBack()
    }

    async function handleConfirm() {
     const response=  await requestStockTransfer({
        id: selectedDriver.driver_id,
        transferDetail: getFormattedCartDetails(),
      })
      reset()
      navigation.push('StockTransferAcknowledgement', {response})
    }

    return (
      <>
        <Screen preset="fixed">
          <Header title="Stock Transfer Confirmation" leftIcon="back" onLeftPress={handleGoBack} />

          <View style={$titleSection}>
            <Text weight={"bold"}>Transfer Summary</Text>
            <TouchableOpacity onPress={handleGoBack}>
              <Text weight={"bold"} style={$editText}>
                Edit
              </Text>
            </TouchableOpacity>
          </View>
          {cart.map((item) => (
            <>
              <ListItem
                key={item.name}
                text={item.name}
                containerStyle={$listContainerView}
                RightComponent={<Text style={$center}>{`${item.cart} X`}</Text>}
              />
              <View style={$divider} />
            </>
          ))}
          <ListItem
            disabled={true}
            LeftComponent={
              <Text size={"sm"} weight={"semiBold"} style={$center}>
                Total:
              </Text>
            }
            RightComponent={
              <Text size={"sm"} weight={"bold"} style={$center} text={getTotal()?.toString()} />
            }
            containerStyle={$listContainerView}
          />

          <ListItem
            disabled={true}
            LeftComponent={
              <Text size={"sm"} weight={"semiBold"} style={$center}>
                Transfer To:
              </Text>
            }
            RightComponent={
              <Text size={"sm"} weight={"bold"} style={{ ...$center, ...$editText }}>
                {selectedDriver?.name}
              </Text>
            }
            containerStyle={$transferToListContainer}
          />
        </Screen>

        <View
          style={{
            ...$bottomButtonView,
            bottom: bottom + 10,
          }}
        >
          <Button onPress={handleGoBack} preset={"filled"} text={"Cancel"} style={$cancelButton} />
          <Button
            onPress={handleConfirm}
            preset={"filled"}
            text={"Confirm"}
            style={{ width: 150, borderRadius: 30 }}
          />
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

const $divider: ViewStyle = {
  borderBottomWidth: 0.8,
  width: width * 0.95,
  alignSelf: "center",
  borderBottomColor: colors.palette.secondary100,
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
