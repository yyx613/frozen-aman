import React, { FC } from "react"
import { Image, ImageStyle, View, ViewStyle } from "react-native"
import { AppStackScreenProps } from "../../navigators"
import { observer } from "mobx-react-lite"
import { Button, Header, ListItem, Screen, Text } from "../../components"
import { colors } from "../../theme"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useStores } from "../../models"
import { DELIVERY } from "./constant"

interface CustomerInfoProps extends AppStackScreenProps<"CustomerInfo"> {}

const UserImage = require("../../../assets/images/user.png")

export const CustomerInfoScreen: FC<CustomerInfoProps> = observer(function CustomerInfoScreen(
  _props, // @demo remove-current-line
) {
  const { bottom } = useSafeAreaInsets()
  const { navigation, route } = _props
  const { taskId } = route.params
  const { taskStore, orderStore } = useStores()
  const task = taskStore.getSelectedTask(taskId)
  const { customer, status } = task || {}

  function handleGoBack() {
    navigation.goBack()
  }

  function handleNewOrder() {
    orderStore.updateSelectedTask(task)
    if (task.invoice_id) {
      orderStore.updateCartWithExistingInvoice(task.invoice.invoicedetail)
      return navigation.push("OrderConfirmation")
    }
    orderStore.reset()
    navigation.push("ProductSelection")
  }

  function handleNewReturn() {
    orderStore.updateSelectedTask(task)
    if (task.invoice_id) {
      orderStore.updateCartWithExistingInvoice(task.invoice.invoicedetail)
      return navigation.push("OrderConfirmation")
    }
    orderStore.reset()
    navigation.push("ReturnSelection")
  }

  return (
    <>
      <Screen preset={"fixed"} contentContainerStyle={$centerView}>
        <Header title={"Customer Info"} leftIcon={"back"} onLeftPress={handleGoBack} />

        <Image source={UserImage} style={$userImage} />
        <Text preset={"subheading"} weight={"bold"}>
          {task.customer.company}
        </Text>

        <View style={$listContainer}>
          <ListItem leftIcon={"id"} text={customer.code ?? "-"} />
          <ListItem leftIcon={"map"} text={customer.addres ?? "-"} />
          <ListItem leftIcon={"phone"} text={customer.phone ?? "-"} />
          <ListItem leftIcon={"note"} text={`Credit RM${customer.credit}`} />
          <ListItem leftIcon={"deliveryStatus"} text={DELIVERY.TASK_STATUS[status]} />
        </View>
      </Screen>

      <View style={[$buttonContainer, { bottom: bottom + 10 }]}>

      <Button
        onPress={handleNewOrder}
        preset={"filled"}
        text={"New Order"}
        style={{ ...$button, bottom: bottom + 10 }}
      />


        <Button
          onPress={handleNewReturn}
          preset={"filled"}
          text={"Return Stock"}
          style={{ ...$button, bottom: bottom + 10 }}
        />
      </View>
    </>
  )
})

const $centerView: ViewStyle = {
  alignItems: "center",
}

const $userImage: ImageStyle = {
  width: 80,
  height: 80,
  marginVertical: 20,
  tintColor: colors.palette.primary500,
}

const $listContainer: ViewStyle = {
  backgroundColor: colors.palette.neutral100,
  borderRadius: 10,
  paddingHorizontal: 20,
  width: 300,
  marginTop: 20,
}

const $button: ViewStyle = {
  borderRadius: 30,
  width: 150,
  alignSelf: "center",
  marginHorizontal: 10,
}

const $buttonContainer: ViewStyle = {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
}
