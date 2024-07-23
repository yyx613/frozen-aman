import React, { FC, useEffect } from "react"
import { observer } from "mobx-react-lite"
import moment from "moment"
import { TextStyle, View, ViewStyle } from "react-native"

import { AppStackScreenProps } from "app/navigators"
import { Button, Header, ListItem, Screen, Text } from "app/components"
import { colors } from "app/theme"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useStores } from "app/models"

interface ProductSelectionProps extends AppStackScreenProps<"InvoicePreview"> {}

export const InvoicePreviewScreen: FC<ProductSelectionProps> = observer(
  function InvoicePreviewScreen(
    _props, // @demo remove-current-line
  ) {
    const { bottom } = useSafeAreaInsets()

    const { navigation, route } = _props
    const { invoiceId, customerId, amount } = route.params || {}
    const { creditNotesStore, productStore } = useStores()
    const invoice = creditNotesStore.invoice || {
      invoiceno: "",
      date: "",
      newcredit: 0,
      invoicedetail: [],
      customer: { company: "", address: "" },
    }

    useEffect(() => {
      ;(async function load() {
        await creditNotesStore.loadInvoiceDetails({ customerId, invoiceId })
      })()
    }, [])

    function handleBack() {
      navigation.goBack()
    }

    function handlePreviewInvoice() {
      navigation.push("InvoiceReceipt", { amount })
    }

    return (
      <>
        <Screen>
          <Header title={invoice.invoiceno} leftIcon="back" onLeftPress={handleBack} />

          <View style={$container}>
            <Text text={"Total"} weight={"semiBold"} style={$title} />
            <Text
              text={`RM ${creditNotesStore.geInvoiceTotal()?.toString()}`}
              weight={"semiBold"}
              style={$totalText}
            />
            <View style={$divider} />
            <View style={$row}>
              <View>
                <Text text={"Updated Credit"} weight={"semiBold"} style={$title} />
                <Text text={`RM ${invoice.newcredit.toString()}`} />
              </View>

              <View>
                <Text text={"Paid Amount"} weight={"semiBold"} style={$title} />
                <Text text={`RM ${amount?.toString()}`} />
              </View>
            </View>
            <Text text={"Invoice for"} weight={"semiBold"} style={$title} />
            <Text text={invoice.customer.company} />
            <Text text={invoice.customer.address} />

            <Text text={"Issue On"} weight={"semiBold"} style={$title} />
            <Text text={invoice.date} />
          </View>

          <Text text="Products" weight="semiBold" style={$heading} />

          <View style={$container}>
            {invoice.invoicedetail?.map((item, index) => (
              <>
                <ListItem
                  LeftComponent={<ItemBox quantity={item.quantity} />}
                  text={productStore.getProductById(item.product_id)?.name}
                  RightComponent={<Text style={$center}>{`RM ${item.totalprice.toFixed(2)}`}</Text>}
                  containerStyle={$cartItemView}
                  height={30}
                />
                {invoice.invoicedetail.length - 1 !== index && <View style={$divider} />}
              </>
            ))}
          </View>
        </Screen>
        <Button
          onPress={handlePreviewInvoice}
          preset={"filled"}
          text={"Preview Invoice"}
          style={{ ...$button, bottom: bottom + 10 }}
        />
      </>
    )
  },
)

const ItemBox = ({ quantity }) => (
  <View style={$itemBox}>
    <Text size={"xxs"}>{`${quantity} X`}</Text>
  </View>
)
const $container: ViewStyle = {
  backgroundColor: colors.palette.neutral100,
  borderRadius: 10,
  paddingHorizontal: 20,
  paddingVertical: 10,
  marginHorizontal: 20,
}

const $title: TextStyle = {
  color: colors.palette.primary500,
  marginTop: 5,
}

const $totalText: TextStyle = {
  color: colors.palette.primary600,
}

const $divider: ViewStyle = {
  borderBottomWidth: 1,
  borderBottomColor: colors.palette.secondary100,
  marginVertical: 5,
}

const $row: ViewStyle = {
  flexDirection: "row",
  justifyContent: "space-between",
}

const $heading: TextStyle = {
  paddingHorizontal: 20,
  marginVertical: 10,
  color: colors.palette.primary600,
}

const $itemBox: ViewStyle = {
  borderWidth: 1,
  borderColor: colors.palette.primary500,
  padding: 2,
  height: 30,
  justifyContent: "center",
  alignSelf: "center",
  marginRight: 10,
}

const $cartItemView: ViewStyle = {
  backgroundColor: colors.palette.neutral100,
}
const $center: ViewStyle = {
  alignSelf: "center",
}

const $button: ViewStyle = {
  borderRadius: 30,
  width: 300,
  alignSelf: "center",
}
