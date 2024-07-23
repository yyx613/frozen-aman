import React, { FC, useState } from "react"
import { ViewStyle } from "react-native"
import Share from "react-native-share"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { AppStackScreenProps } from "../../navigators"
import { observer } from "mobx-react-lite"
import { useStores } from "../../models"
import { Header, Screen, Button } from "../../components"
import { Receipt } from "../../components/templates/Receipt"
import { PAY_BY_CREDIT } from "./constant"

interface ReturnReceiptProps extends AppStackScreenProps<"ReturnReceipt"> {}

export const ReturnReceiptScreen: FC<ReturnReceiptProps> = observer(function OrderReceiptScreen(
  _props,
) {
  const { bottom } = useSafeAreaInsets()
  const { navigation } = _props
  const [receiptBase64, setReceiptBase64] = useState("")
  const {
    orderStore: { returnReceiptDetails },
    authenticationStore,
  } = useStores()

  function handleDone() {
    navigation.popToTop()
  }
  function handleShare() {
    if (!receiptBase64) return
    Share.open({ url: receiptBase64 })
      .then(() => {
        console.log("share success")
      })
      .catch((err) => {
        console.log("err share", err)
      })
  }

  function getPaidAmount() {
    if (returnReceiptDetails.paymentType === PAY_BY_CREDIT) return "0"
    return returnReceiptDetails.amount?.toString()
  }

  console.log('returnReceiptDetails', returnReceiptDetails)

  const details = [
    { title: "Invoice", value: returnReceiptDetails.returnNo },
    { title: "Invoice Date", value: returnReceiptDetails.date },
    { title: "Address", value: returnReceiptDetails.address },
    { title: "Driver", value: authenticationStore.user.name },
    returnReceiptDetails?.remark && { title: "Remark", value: returnReceiptDetails.remark },
  ]

  const summary = [
    { title: "Paid Amount", value: `RM ${getPaidAmount()}` },
    { title: "Updated Credit", value: `RM ${returnReceiptDetails.newCredit?.toFixed(2).toString()}` },
  ]

  function handleBack() {
    navigation.goBack()
  }

  return (
    <>
      <Screen>
        <Header
          title={"Invoice Preview"}
          leftIcon={"back"}
          onLeftPress={handleBack}
          rightIcon="print"
          onRightPress={handleShare}
        />
        <Receipt
          details={details}
          orders={returnReceiptDetails.invoiceDetail}
          summary={summary}
          total={`RM ${returnReceiptDetails.amount}`}
          groupCompany={returnReceiptDetails.groupCompany}
          customer={returnReceiptDetails.customer}
          onCapture={(uri) => setReceiptBase64(uri)}
        />
      </Screen>
      <Button
        onPress={handleDone}
        preset={"filled"}
        text={"Done"}
        style={{ ...$button, bottom: bottom + 10 }}
      />
    </>
  )
})

const $button: ViewStyle = {
  borderRadius: 30,
  width: 300,
  position: "absolute",
  bottom: 5,
  alignSelf: "center",
}
