import React, { FC, useEffect, useRef, useState } from "react"
import { View, TextStyle, ViewStyle, TouchableOpacity, ImageStyle, ScrollView } from "react-native"
import { AppStackScreenProps } from "app/navigators"
import { observer } from "mobx-react-lite"
import { Screen, Header, Text, ListItem, Icon, Button, Loading } from "app/components"
import { colors } from "app/theme"
import { useStores } from "app/models"
import moment from "moment"
import DatePicker from "react-native-date-picker"
import LottieView from "lottie-react-native"
import ViewShot from "react-native-view-shot"
import Share from "react-native-share"
import { useSafeAreaInsets } from "react-native-safe-area-context"

const EmptyJSON = require("../../../assets/lottie/empty.json")

interface EndTripSummaryProps extends AppStackScreenProps<"EndTripSummary"> {}

export const EndTripSummaryScreen: FC<EndTripSummaryProps> = observer(function EndTripSummaryScreen(
  _props,
) {
  const today = moment().toDate()
  const { bottom } = useSafeAreaInsets()
  const { navigation } = _props
  const ref = useRef()
  const { dashboardStore } = useStores()
  const [date, setDate] = useState(today)
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false)
  const isEmptyRecord = dashboardStore.dashboard?.trip?.length === 0

  useEffect(() => {
    ;(async () => {
      const response = await dashboardStore.fetchDashboard(today)
      if (response.kind !== "ok") {
      }
    })()
  }, [])

  function handleGoBack() {
    navigation.goBack()
  }

  function handleOpenDatePicker() {
    setIsDatePickerVisible(true)
  }

  function handleCloseDatePicker() {
    setIsDatePickerVisible(false)
  }

  async function handleConfirmDate(date) {
    setDate(date)
    handleCloseDatePicker()
    await dashboardStore.fetchDashboard(date)
  }

  async function capture() {
    let url = ""
    // @ts-ignore
    await ref?.current?.capture().then((uri) => {
      const formattedUri = uri.replace(/(\r\n|\n|\r)/gm, "")
      url = `data:image/png;base64,${formattedUri}`
    })
    return url
  }

  async function handleShare() {
    const receiptBase64 = await capture()
    if (!receiptBase64) return
    Share.open({ url: receiptBase64 })
      .then(() => {
        console.log("share success")
      })
      .catch((err) => {
        console.log("err share", err)
      })
  }

  function renderScreen() {
    if (isEmptyRecord)
      return (
        <View style={$emptyConatiner}>
          <LottieView source={EmptyJSON} autoPlay={true} style={$emptyView} loop={true} />
          <Text text="No Record" />
        </View>
      )
    return (
      <ScrollView>
        <ViewShot
          ref={ref}
          options={{ format: "jpg", quality: 1, result: "base64" }}
          style={$viewShot}
        >
          {/* Summary */}
          <View style={$container}>
            <View style={$row}>
              <View style={$section}>
                <Text text={"Total Sales"} weight={"semiBold"} style={$title} />
                <Text text={`RM ${dashboardStore.getSales()}`} />
              </View>

              <View style={$section}>
                <Text text={"Cash Collected"} weight={"semiBold"} style={$title} />
                <Text text={`RM ${dashboardStore.getCash()}`} />
              </View>
            </View>

            <View style={$row}>
              <View style={$section}>
                <Text text={"Credit Note"} weight={"semiBold"} style={$title} />
                <Text text={`RM ${dashboardStore.getCredit()}`} />
              </View>

              <View style={$section}>
                <Text text={"Total Prodcut Sold"} weight={"semiBold"} style={$title} />
                <Text text={`${dashboardStore.getTotalProductSold()}`} />
              </View>
            </View>
          </View>
          {/* Proudct Details */}
          {dashboardStore.getProductSoldDetails()?.length !== 0 && (
            <>
              <Text text="Products" weight="semiBold" style={$heading} />

              <View style={$container}>
                {dashboardStore.getProductSoldDetails()?.map((item, index) => (
                  <>
                    <ListItem
                      LeftComponent={<ItemBox quantity={item.quantity} />}
                      text={item.name}
                      containerStyle={$cartItemView}
                      height={30}
                    />
                    {dashboardStore.getProductSoldDetails().length - 1 !== index && (
                      <View style={$divider} />
                    )}
                  </>
                ))}
              </View>
            </>
          )}
          {/* Trip Info */}
          <Text text="Trip Info" weight="semiBold" style={$heading} />
          <View style={$container}>
            {dashboardStore.dashboard?.trip?.map((item) => (
              <>
                <View style={$row}>
                  <View style={$section}>
                    <Text text={"Driver"} weight={"semiBold"} style={$title} />
                    <Text text={item.driver_name} />
                  </View>

                  <View style={$section}>
                    <Text text={"Kelindan"} weight={"semiBold"} style={$title} />
                    <Text text={item.kelindan_name} />
                  </View>
                </View>

                <Text text={"Lorry No"} weight={"semiBold"} style={$title} />
                <Text text={item.lorryno} />
              </>
            ))}
          </View>
        </ViewShot>
      </ScrollView>
    )
  }

  return (
    <>
      <Screen preset="scroll">
        <Header title={"End Trip Summary"} leftIcon="back" onLeftPress={handleGoBack} />

        {/* <TouchableOpacity style={$dateSection} onPress={handleOpenDatePicker}>
          <Text
            text={moment(date).format("YYYY-MM-DD")}
            style={$dateTitle}
            size="md"
            weight="bold"
          />
          <Icon icon="arrowDown" style={$downIcon} />
        </TouchableOpacity> */}
        {renderScreen()}

        <DatePicker
          modal
          open={isDatePickerVisible}
          onCancel={handleCloseDatePicker}
          onConfirm={(date) => handleConfirmDate(date)}
          maximumDate={today}
          date={date}
          mode={"date"}
        />
      </Screen>

      {!isEmptyRecord && (
        <Button
          onPress={handleShare}
          preset={"filled"}
          text={"Print"}
          style={{ ...$button, bottom: bottom + 10 }}
        />
      )}

      {dashboardStore.isLoading && <Loading preset="fullscreen" />}
    </>
  )
})

const ItemBox = ({ quantity }) => (
  <View style={$itemBox}>
    <Text size={"xxs"}>{`${quantity} X`}</Text>
  </View>
)

const $dateTitle: TextStyle = {
  color: colors.palette.primary500,
  textAlign: "center",
  marginVertical: 10,
}

const $downIcon: ImageStyle = {
  width: 25,
  height: 25,
  tintColor: colors.palette.primary500,
}

const $dateSection: ViewStyle = {
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
}
const $container: ViewStyle = {
  backgroundColor: colors.palette.neutral100,
  borderRadius: 10,
  paddingHorizontal: 20,
  paddingVertical: 10,
  marginHorizontal: 20,
}

const $title: TextStyle = {
  color: colors.palette.primary600,
  marginTop: 5,
  textAlign: "left",
}

const $section: ViewStyle = {
  flex: 1,
}

const $row: ViewStyle = {
  flexDirection: "row",
  justifyContent: "space-between",
}

const $heading: TextStyle = {
  paddingHorizontal: 20,
  marginVertical: 10,
  color: colors.palette.primary500,
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

const $button: ViewStyle = {
  borderRadius: 30,
  width: 300,
  alignSelf: "center",
}

const $divider: ViewStyle = {
  borderBottomWidth: 1,
  borderBottomColor: colors.palette.secondary100,
  marginVertical: 5,
}

const $emptyView: ImageStyle = {
  width: "50%",
  alignSelf: "center",
}

const $emptyConatiner: ViewStyle = {
  justifyContent: "center",
  alignItems: "center",
}

const $viewShot: ViewStyle = {
  backgroundColor: colors.background,
  paddingVertical: 20,
}
