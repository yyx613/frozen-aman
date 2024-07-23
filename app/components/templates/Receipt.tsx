import React, { useCallback, useRef } from "react"
import ViewShot from "react-native-view-shot"
import { ScrollView, TextStyle, View, ViewStyle, Image, ImageStyle } from "react-native"

import { colors, typography } from "../../theme"
import { Text } from "../Text"
import { useFocusEffect } from "@react-navigation/native"
import { useStores } from "app/models"
import { GroupCompany } from "app/services/api/task/task.type"

const BannerImage = require("assets/images/banner.png")

const DEFAULT_COMPANY = {
  code: "14419996-X",
  name: "Aman Jaya Food and Bakery Sdn Bhd",
  ssm: "14419996-X",
  address1: "13, 14, 15, Jalan Aman Jaya",
  address2: "Taman Aman Jaya",
  address3: "45400, Sekinchan Selangor.",
  address4: null,
}

type ReceiptDetailsProps = { title: string; value: string }
type OrderProps = {
  product_id: number
  price: number
  quantity: number
  totalprice: number
  name: string
  product: { name: string }
}

interface ReceiptProps {
  details?: ReceiptDetailsProps[]
  summary?: ReceiptDetailsProps[]
  orders?: any[]
  total: string
  customer?: string
  groupCompany?: GroupCompany
  onCapture(uri: string): void
}

export function Receipt(props: ReceiptProps) {
  const { details, orders, summary, total, customer, groupCompany, onCapture } = props
  const ref = useRef()
  const { tripStore} = useStores()
  const companyShowed = !groupCompany? DEFAULT_COMPANY : groupCompany

  useFocusEffect(
    useCallback(() => {
      capture()
    }, []),
  )

  function capture() {
    setTimeout(() => {
      // @ts-ignore
      ref?.current?.capture().then((uri) => {
        const formattedUri = uri.replace(/(\r\n|\n|\r)/gm, "")
        onCapture(`data:image/png;base64,${formattedUri}`)
      })
    }, 800)
  }

  return (
    <ScrollView>
      <ViewShot ref={ref} options={{ format: "jpg", quality: 1, result: "base64" }}>
        <View style={$container}>
          <Text
            text={`Color Code: ${tripStore?.trip?.colorcode}`}
            style={{ alignSelf: "flex-end" }}
          />

          <Image source={BannerImage} style={$banner} />
          <View style={$headerSection}>
            <Text text={companyShowed.name} style={$companyTitle} />
            <Text text={companyShowed.ssm} style={$companyAddress} />
            {companyShowed.address1 && <Text text={companyShowed.address1} style={$address} />}
            {companyShowed.address2 && <Text text={companyShowed.address2} style={$address} />}
            {companyShowed.address3 && <Text text={companyShowed.address3} style={$address} />}
            {companyShowed.address4 && <Text text={companyShowed.address4} style={$address} />}
          </View>
          {details.map((item) => (
            <View key={item.title} style={$detailsRow}>
              <Text text={item.title} style={$invoiceTitle} />
              <Text text={item.value} style={$invoiceValue} />
            </View>
          ))}

          <View style={$orderTitleContainer}>
            <Text text={"Customer"} style={$invoiceTitle} />
            <Text text={customer} style={$invoiceValue} />
          </View>

          <View style={$orderTitleContainer}>
            <Text text={"Product"} style={$productTitle} />
            <Text text={"Price (RM)"} style={$companyTitle} />
            <Text text={"Qty"} style={$companyTitle} />
            <Text text={"Subtotal"} style={$companyTitle} />
          </View>
          {orders.map((item) => (
            <View key={item.product_id} style={$orderDetailsContainer}>
              <Text text={item.name ?? item.product?.name} style={$productName} />
              <Text text={item.price?.toFixed(2).toString()} style={$price} />
              <Text text={item.quantity?.toString()} style={$price} />
              <Text text={item.totalprice?.toFixed(2).toString()} style={$price} />
            </View>
          ))}
          <View style={$divider} />
          <View style={$orderTitleContainer}>
            <Text text={"Total"} style={$total} />
            <Text text={total} style={$total} />
          </View>
          <Text text={"Paid Summary"} style={$summaryTitle} />
          {summary.map((item) => (
            <View key={item.title} style={$detailsRow}>
              <Text text={item.title} style={$summaryTitle2} />
              <Text text={item.value} style={$summaryDetail} />
            </View>
          ))}
        </View>
      </ViewShot>
      <View style={{ height: 200 }} />
    </ScrollView>
  )
}

const $container: ViewStyle = {
  backgroundColor: colors.palette.neutral100,
  paddingHorizontal: 20,
  paddingVertical: 20,
  flex: 1,
}

const $summaryTitle2: TextStyle = {
  fontFamily: typography.receipt.bold,
  color: colors.palette.neutral900,
  fontSize: 25,
}

const $summaryDetail: TextStyle = {
  fontFamily: typography.receipt.regular,
  color: colors.palette.neutral900,
  textAlign: "center",
  fontSize: 25,
}

const $companyTitle: TextStyle = {
  fontFamily: typography.receipt.bold,
  color: colors.palette.neutral900,
  flex: 0.6,
  textAlign: "center",
}

const $priceTitle: TextStyle = {
  fontFamily: typography.receipt.bold,
  color: colors.palette.neutral900,
  flex: 0.6,
  textAlign: "center",
  fontSize: 25,
}

const $total: TextStyle = {
  fontFamily: typography.receipt.bold,
  color: colors.palette.neutral900,
  textAlign: "center",
  fontSize: 25,
}
const $companyAddress: TextStyle = {
  fontFamily: typography.receipt.regular,
  color: colors.palette.neutral900,
  flex: 0.7,
  textAlign: "center",
  marginTop: 5,
}

const $address: TextStyle = {
  fontFamily: typography.receipt.regular,
  color: colors.palette.neutral900,
  textAlign: "center",
}

const $productTitle: TextStyle = {
  fontFamily: typography.receipt.bold,
  color: colors.palette.neutral900,
  flex: 1,
}

const $productName: TextStyle = {
  fontFamily: typography.receipt.regular,
  color: colors.palette.neutral900,
  flex: 1.2,
  fontSize: 25,
}

const $price: TextStyle = {
  fontFamily: typography.receipt.regular,
  color: colors.palette.neutral900,
  flex: 0.7,
  textAlign: "center",
  marginTop: 5,
  fontSize: 25,
}

const $headerSection: ViewStyle = {
  alignItems: "center",
  marginBottom: 25,
}
const $detailsRow: ViewStyle = {
  flexDirection: "row",
  justifyContent: "space-between",
}

const $invoiceValue: TextStyle = {
  fontFamily: typography.receipt.regular,
  color: colors.palette.neutral900,
  flex: 1.5,
  textAlign: "right",
}

const $invoiceTitle: TextStyle = {
  fontFamily: typography.receipt.regular,
  color: colors.palette.neutral900,
  flex: 1,
}

const $orderTitleContainer: ViewStyle = {
  flexDirection: "row",
  justifyContent: "space-between",
  marginTop: 10,
}
const $orderDetailsContainer: ViewStyle = {
  flexDirection: "row",
  justifyContent: "space-between",
  marginTop: 5,
}

const $divider: ViewStyle = {
  borderBottomWidth: 1,
  borderBottomColor: colors.palette.neutral900,
  borderStyle: "dashed",
  borderRadius: 1,
  marginVertical: 10,
}

const $summaryTitle: TextStyle = {
  textAlign: "center",
  marginVertical: 5,
  fontFamily: typography.receipt.bold,
}

const $banner: ImageStyle = {
  height: undefined,
  width: 100,
  aspectRatio: 1,
  alignSelf: "center",
  marginVertical: 5,
}
