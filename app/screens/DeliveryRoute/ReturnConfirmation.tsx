import React, { FC, useEffect, useState } from "react"
import { AppStackScreenProps } from "../../navigators"
import { observer } from "mobx-react-lite"
import { Alert, Dimensions, Platform, TextStyle, TouchableOpacity, View, ViewStyle } from "react-native"

import { Button, Header, ListItem, Loading, Screen, Text, TextField } from "../../components"
import { colors } from "../../theme"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useIsConnected } from "react-native-offline"
import { useStores } from "../../models"
import moment from "moment"
import { NetworkInfo } from "react-native-network-info"

interface ReturnConfirmationProps extends AppStackScreenProps<"ReturnConfirmation"> {}

const { width } = Dimensions.get("screen")
export const ReturnConfirmationScreen: FC<ReturnConfirmationProps> = observer(
  function ReturnConfirmationScreen(_props) {
    const isConnected = useIsConnected()
    const { bottom } = useSafeAreaInsets()
    const { navigation } = _props
    const {
      orderStore: {
        returnCart,
        getReturnTotalPrice,
        returnStocks,
        isLoading,
        selectedTask,
        markLoading,
      },
    } = useStores()
    const paymentMethod = {
      value: 2,
      methodName: 'Credit',
      icon: 'creditNote'
    }
    const [remark, setRemark] = useState("")
    const totalPrice = getReturnTotalPrice().toFixed(2)

    useEffect(() => {
      markLoading(false)
    }, [])

    function handleGoBack() {
      navigation.goBack()
    }

    function handleRemarksChange(remark) {
      setRemark(remark)
    }

    async function submitOrder() {
      const IPAddress =
        Platform.OS === "ios"
          ? await NetworkInfo.getIPV4Address()
          : await NetworkInfo.getIPAddress()
      const response = await returnStocks({
        date: moment().format("YYYY-MM-DD HH:mm:ss"),
        paymentType: paymentMethod.value,
        isConnected,
        IPAddress,
        remark
      })
      navigation.push("ReturnAcknowledgement", { response })
    }

    async function handleConfirm() {
      Alert.alert("Return Confirmation", "Please confirm all the details before submit return ordder.", [
        {
          text: "Cancel",
          onPress: () => {},
          style: "cancel",
        },
        { text: "Confirm", onPress: async () => await submitOrder() },
      ])
    }


    // @ts-ignore
    return (
      <>
        <Header
          title={selectedTask.customer.company}
          leftIcon={"back"}
          onLeftPress={handleGoBack}
        />
        <Screen preset={"auto"}>
          <View style={$titleView}>
            <Text weight={"bold"}>Return Summary</Text>
            <TouchableOpacity onPress={handleGoBack}>
              <Text weight={"bold"} style={$editText}>
                Edit
              </Text>
            </TouchableOpacity>
          </View>

          {returnCart.map((item, index) => (
            <>
              <ListItem
                key={item.product_id}
                disabled={true}
                text={item.name}
                LeftComponent={<ItemBox quantity={item.quantity} />}
                RightComponent={
                  <Text size={"sm"} weight={"semiBold"} style={$center}>
                    {item.totalprice.toFixed(2)}
                  </Text>
                }
                containerStyle={$cartItemView}
              />
              {returnCart.length - 1 !== index && <Divider />}
            </>
          ))}
          <Divider />
          <ListItem
            disabled={true}
            LeftComponent={
              <Text size={"sm"} weight={"semiBold"} style={$center}>
                Return Total:
              </Text>
            }
            RightComponent={
              <Text size={"sm"} weight={"bold"} style={$center}>{`RM ${totalPrice}`}</Text>
            }
            containerStyle={$cartItemView}
          />

          <Text weight={"bold"} style={$paymentDetailsTitle}>
            Return Details
          </Text>
          <ListItem
            disabled
            text={paymentMethod.methodName}
            leftIcon={paymentMethod.icon}
            iconSize={20}
            containerStyle={$cartItemView}
          />
          <Divider />
          <ListItem
            text={"Total Return"}
            RightComponent={<Text style={$center}>{`RM ${getReturnTotalPrice().toFixed(2)}`}</Text>}
            containerStyle={$cartItemView}
          />

          <Divider />

          <View style={$inputContainer}>
            <Text>Remarks</Text>
            <TextField
              placeholder={"Type something here"}
              value={remark}
              onChangeText={(text) => handleRemarksChange(text)}
              containerStyle={$textField}
              multiline
            />
          </View>


          <View style={$bottomSpace} />
        </Screen>

        <View
          style={{
            ...$bottomButtonContainer,
            paddingBottom: bottom + 10,
          }}
        >
          <Button onPress={handleGoBack} preset={"filled"} text={"Cancel"} style={$cancelButton} />
          <Button
            onPress={handleConfirm}
            preset={"filled"}
            text={"Confirm"}
            style={$confirmButton}
          />
        </View>

        {isLoading && <Loading preset={"blurFullScreen"} />}
      </>
    )
  },
)

const ItemBox = ({ quantity }) => (
  <View style={$itemBox}>
    <Text size={"xxs"}>{`${quantity} X`}</Text>
  </View>
)

const Divider = (_) => <View style={$divider} />

const $titleView: ViewStyle = {
  flexDirection: "row",
  justifyContent: "space-between",
  paddingHorizontal: 20,
  marginBottom: 10,
}
const $editText: TextStyle = {
  color: colors.palette.primary500,
}

const $cartItemView: ViewStyle = {
  backgroundColor: colors.palette.neutral100,
  paddingHorizontal: 20,
}
const $center: ViewStyle = {
  alignSelf: "center",
}
const $paymentDetailsTitle: TextStyle = {
  paddingHorizontal: 20,
  marginTop: 20,
  marginBottom: 10,
}

const $itemBox: ViewStyle = {
  borderWidth: 1,
  borderColor: colors.palette.primary500,
  padding: 4,
  height: 40,
  justifyContent: "center",
  alignSelf: "center",
  marginRight: 10,
}
const $divider: ViewStyle = {
  borderBottomWidth: 0.8,
  width: width * 0.95,
  alignSelf: "center",
  borderBottomColor: colors.palette.secondary100,
}

const $bottomSpace: ViewStyle = {
  paddingVertical: 20,
}

const $bottomButtonContainer: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  paddingTop: 20,
  backgroundColor: colors.palette.neutral100,
}

const $cancelButton: ViewStyle = {
  width: 150,
  borderRadius: 30,
  backgroundColor: colors.palette.secondary300,
  marginRight: 10,
}

const $confirmButton: ViewStyle = {
  width: 150,
  borderRadius: 30,
}

const $inputContainer: ViewStyle = {
  paddingHorizontal: 20,
  backgroundColor: colors.palette.neutral100,
  paddingVertical: 10,
}

const $textField: ViewStyle = {
  marginTop: 5,
}
