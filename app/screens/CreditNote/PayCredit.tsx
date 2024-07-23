import React, { FC, useState } from "react"
import { AppStackScreenProps } from "app/navigators"
import { observer } from "mobx-react-lite"
import { View, ViewStyle, TextStyle, Dimensions, Keyboard, Alert } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { Screen, Header, Text, ListItem, Button, TextField } from "app/components"
import { colors } from "app/theme"
import { useStores } from "app/models"

interface PayCreditProps extends AppStackScreenProps<"PayCredit"> {}
const { width } = Dimensions.get("screen")

export const PayCreditScreen: FC<PayCreditProps> = observer(function PayCreditScreen(_props) {
  const { bottom } = useSafeAreaInsets()
  const { navigation, route } = _props
  const { customerId,credit } = route.params
  const { creditNotesStore } = useStores()
  const [paidAmount, setPaidAmount] = useState("")

  function handleGoBack() {
    navigation.goBack()
  }

  async function handleConfirm() {
    const response=  await creditNotesStore.payCreditNote({customerId, amount: paidAmount})
    navigation.push('PayCreditAcknowledgement', {response})
  }

  function handlePaidAmountChange(amount) {
    setPaidAmount(amount)
  }


  return (
    <>
      <View onTouchStart={Keyboard.dismiss} style={{flex: 1}}>
        <Header title="Pay Credit" leftIcon="back" onLeftPress={handleGoBack} />

        <ListItem
          disabled={true}
          LeftComponent={
            <Text size={"sm"} weight={"semiBold"} style={$center}>
              Total:
            </Text>
          }
          RightComponent={
            <Text size={"sm"} weight={"bold"} style={{ ...$center, ...$editText }}>
              {`RM ${credit}`}
            </Text>
          }
          containerStyle={$transferToListContainer}
        />
        <Text weight={"bold"} style={$paymentDetailsTitle}>
          Payment Details
        </Text>

        <Divider />
        <View style={$inputContainer}>
          <Text>Paid Amount (RM)</Text>
          <TextField
            placeholder={"0.00"}
            value={paidAmount}
            keyboardType={"number-pad"}
            containerStyle={$textField}
            onChangeText={(text) => handlePaidAmountChange(text)}
            inputWrapperStyle={$paidAmountField}
          />
        </View>
        <View style={$bottomSpace} />
      </View>

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
})
const Divider = (_) => <View style={$divider} />

const $editText: TextStyle = {
  color: colors.palette.primary500,
}

const $transferToListContainer: ViewStyle = {
  backgroundColor: colors.palette.neutral100,
  paddingHorizontal: 20,
  marginTop: 20,
}
const $center: TextStyle = {
  alignSelf: "center",
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

const $inputContainer: ViewStyle = {
  paddingHorizontal: 20,
  backgroundColor: colors.palette.neutral100,
  paddingVertical: 10,
}
const $textField: ViewStyle = {
  marginTop: 5,
}

const $paidAmountField: ViewStyle = {
  borderColor: colors.palette.secondary200,
}

const $bottomSpace: ViewStyle = {
  paddingVertical: 20,
}
const $divider: ViewStyle = {
  borderBottomWidth: 0.8,
  width: width * 0.95,
  alignSelf: "center",
  borderBottomColor: colors.palette.secondary100,
}
const $paymentDetailsTitle: TextStyle = {
  paddingHorizontal: 20,
  marginTop: 20,
  marginBottom: 10,
}

const $cartItemView: ViewStyle = {
  backgroundColor: colors.palette.neutral100,
  paddingHorizontal: 20,
}

const $paymentMethodListItem: ViewStyle = {
  paddingHorizontal: 15,
}
