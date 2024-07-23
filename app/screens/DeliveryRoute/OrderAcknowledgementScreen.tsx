import React, { FC } from "react"
import { AppStackScreenProps } from "../../navigators"
import { observer } from "mobx-react-lite"
import { Button, Header, Screen, Text } from "../../components"
import LottieView from "lottie-react-native"
import { ImageStyle, ViewStyle, View } from "react-native"
import { colors } from "../../theme"
import { useSafeAreaInsets } from "react-native-safe-area-context"

const SuccessLottie = require("../../../assets/lottie/success.json")
const ErrorLottie = require("../../../assets/lottie/error.json")
const PendingLottie = require("../../../assets/lottie/pending.json")

interface OrderAcknowledgementProps extends AppStackScreenProps<"OrderAcknowledgement"> {}

export const OrderAcknowledgementScreen: FC<OrderAcknowledgementProps> = observer(
  function OrderAcknowledgementScreen(_props) {
    const { navigation, route } = _props
    const { response } = route.params
    const { bottom } = useSafeAreaInsets()

    function handleGoBack() {
      navigation.popToTop()
    }

    function handlePrintReceipt() {
      navigation.push("OrderReceipt")
    }

    function renderIcon() {
      if (response.kind === "pending") return PendingLottie
      if (response.kind === "ok") return SuccessLottie
      return ErrorLottie
    }
    return (
      <>
        <Screen>
          <Header title={"Order Acknowledgement"} leftIcon={"back"} onLeftPress={handleGoBack} />
          <View style={$view}>
            <LottieView source={renderIcon()} style={$lottie} autoPlay loop />
            <Text text={response.message} />
          </View>
        </Screen>

        <View
          style={{
            ...$bottomButtonContainer,
            paddingBottom: bottom + 10,
          }}
        >
          <Button onPress={handleGoBack} preset={"filled"} text={"Cancel"} style={$cancelButton} />
          {(response.kind === "ok" || response.kind === "pending") && (
            <Button
              onPress={handlePrintReceipt}
              preset={"filled"}
              text={"Receipt"}
              style={$confirmButton}
            />
          )}
        </View>
      </>
    )
  },
)

const $lottie: ImageStyle = {
  width: 200,
  alignSelf: "center",
}

const $view: ViewStyle = {
  justifyContent: "center",
  alignItems: "center",
}

const $bottomButtonContainer: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  paddingTop: 20,
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
