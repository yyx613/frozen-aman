import React, { FC, useState } from "react"
import Share from "react-native-share"

import { AppStackScreenProps } from "../../navigators"
import { observer } from "mobx-react-lite"
import { Receipt } from "../../components/templates/Receipt"
import { Header, Screen } from "../../components"
import { useStores } from "app/models"

interface InvoiceReceiptProps extends AppStackScreenProps<"InvoiceReceipt"> {}

export const InvoiceReceiptScreen: FC<InvoiceReceiptProps> = observer(function InvoiceReceiptScreen(
  _props,
) {
  const { navigation, route } = _props
  const [receiptBase64, setReceiptBase64] = useState("")
  const { creditNotesStore } = useStores()
  const invoice = creditNotesStore.invoice || {
    invoiceno: "",
    date: "",
    newcredit: 0,
    invoicedetail: [],
    invoicepayment: [],
    customer: { company: "", address: "" },
  }

  function getPaidAmount() {
    if (invoice.invoicepayment.length === 0) return "0"
    return invoice.invoicepayment.reduce((total, i) => total + i.amount, 0)?.toFixed(2)
  }

  function handleShare() {
    console.tron.log({ path: "InvoiceReceipt", receiptBase64 })
    if (!receiptBase64) return
    Share.open({ url: receiptBase64 })
      .then(() => {
        console.log("share success")
      })
      .catch((err) => {
        console.log("err share", err)
      })
  }

  const details = [
    { title: "Invoice", value: invoice.invoiceno },
    {
      title: "Invoice Date",
      value: invoice.date,
    },
    { title: "Address", value: invoice.customer.address },
    { title: "Driver", value: invoice.driver.name },
  ]

  const summary = [
    { title: "Paid Amount", value: `RM ${getPaidAmount()}` },
    { title: "Updated Credit", value: `RM ${invoice.newcredit?.toFixed(2).toString()}` },
  ]

  function handleBack() {
    navigation.goBack()
  }

  return (
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
        orders={invoice.invoicedetail}
        summary={summary}
        total={`RM ${creditNotesStore.geInvoiceTotal()}`}
        customer={invoice.customer.company}
        groupCompany={invoice.customer.groupcompany}
        onCapture={(uri) => setReceiptBase64(uri)}
      />
    </Screen>
  )
})
