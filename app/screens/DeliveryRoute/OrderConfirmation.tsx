import React, { FC, useEffect, useState } from "react"
import { AppStackScreenProps } from "../../navigators"
import { observer } from "mobx-react-lite"
import {
  Dimensions,
  Platform,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
  Alert,
} from "react-native"

import {
  BottomModal,
  Button,
  Header,
  ListItem,
  Loading,
  Screen,
  Text,
  TextField,
} from "../../components"
import { colors } from "../../theme"
import { PAYMENT_METHOD } from "./constant"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useIsConnected } from "react-native-offline"
import { NetworkInfo } from "react-native-network-info"
import { useStores } from "../../models"
import moment from "moment"

interface OrderConfirmationProps extends AppStackScreenProps<"OrderConfirmation"> {}

const { width } = Dimensions.get("screen")
export const OrderConfirmationScreen: FC<OrderConfirmationProps> = observer(
  function OrderConfirmationScreen(_props) {
    const isConnected = useIsConnected()
    const { bottom } = useSafeAreaInsets()
    const { navigation } = _props
    const {
      orderStore: {
        cart,
        getTotalPrice,
        checkFOC,
        foc,
        addInvoice,
        isLoading,
        selectedTask,
        markLoading,
      },
    } = useStores()
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState({
      id: "",
      value: null,
      methodName: "Please Select Payment Method",
      icon: "payment",
    })
    const [remark, setRemark] = useState("")
    const totalPrice = getTotalPrice().toFixed(2)

    useEffect(() => {
      markLoading(false)
      checkFOC()
    }, [])

    function handleGoBack() {
      navigation.goBack()
    }

    function handleClose() {
      setIsModalVisible(false)
    }

    function handleOpenPaymentModal() {
      setIsModalVisible(true)
    }

    function handleSelectPaymentMethod(item) {
      setSelectedPaymentMethod(item)
      handleClose()
    }

    async function submitOrder() {
      const IPAddress =
        Platform.OS === "ios"
          ? await NetworkInfo.getIPV4Address()
          : await NetworkInfo.getIPAddress()
      const response = await addInvoice({
        date: moment().format("YYYY-MM-DD HH:mm:ss"),
        remark,
        paymentType: selectedPaymentMethod.value,
        isConnected,
        IPAddress,
      })
      navigation.push("OrderAcknowledgement", { response })
    }

    async function handleConfirm() {
      if (!selectedPaymentMethod.id) return Alert.alert("Please select payment type before submit.")
      Alert.alert("Order Confirmation", "Please confirm all the details before submit order.", [
        {
          text: "Cancel",
          onPress: () => {},
          style: "cancel",
        },
        { text: "Confirm", onPress: async () => await submitOrder() },
      ])
    }

    function handleRemarksChange(remark) {
      setRemark(remark)
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
            <Text weight={"bold"}>Order Summary</Text>
            <TouchableOpacity onPress={handleGoBack}>
              <Text weight={"bold"} style={$editText}>
                Edit
              </Text>
            </TouchableOpacity>
          </View>

          {cart.map((item, index) => (
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
              {cart.length - 1 !== index && <Divider />}
            </>
          ))}
          {foc.length !== 0 && (
            <>
              <Text text="FOC:" weight={"semiBold"} style={$cartItemView} />

              {foc.map((item, index) => (
                <>
                  <ListItem
                    disabled={true}
                    text={item.name}
                    LeftComponent={<ItemBox quantity={item.quantity} />}
                    RightComponent={
                      <Text size={"sm"} weight={"semiBold"} style={$center}>
                        0
                      </Text>
                    }
                    containerStyle={$cartItemView}
                  />
                  {cart.length - 1 !== index && <Divider />}
                </>
              ))}
            </>
          )}

          <Divider />
          <ListItem
            disabled={true}
            LeftComponent={
              <Text size={"sm"} weight={"semiBold"} style={$center}>
                Order Total:
              </Text>
            }
            RightComponent={
              <Text size={"sm"} weight={"bold"} style={$center}>{`RM ${totalPrice}`}</Text>
            }
            containerStyle={$cartItemView}
          />

          <Text weight={"bold"} style={$paymentDetailsTitle}>
            Payment Details
          </Text>
          <ListItem
            text={selectedPaymentMethod.methodName}
            leftIcon={selectedPaymentMethod.icon}
            rightIcon={"next"}
            iconSize={20}
            onPress={handleOpenPaymentModal}
            containerStyle={$cartItemView}
          />
          <Divider />
          <ListItem
            text={"Total Collectable"}
            RightComponent={<Text style={$center}>{`RM ${getTotalPrice().toFixed(2)}`}</Text>}
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

        <BottomModal preset={"mini"} isVisible={isModalVisible} onCancel={handleClose}>
          {PAYMENT_METHOD.map((item) => (
            <>
              <ListItem
                onPress={() => handleSelectPaymentMethod(item)}
                leftIcon={item.icon}
                iconSize={30}
                style={$paymentMethodListItem}
                text={item.methodName}
              />
              <Divider />
            </>
          ))}
        </BottomModal>

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

const $inputContainer: ViewStyle = {
  paddingHorizontal: 20,
  backgroundColor: colors.palette.neutral100,
  paddingVertical: 10,
}
const $textField: ViewStyle = {
  marginTop: 5,
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

const $paymentMethodListItem: ViewStyle = {
  paddingHorizontal: 15,
}
