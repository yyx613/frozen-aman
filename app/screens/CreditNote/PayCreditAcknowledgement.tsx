import React, { FC } from "react"
import { AppStackScreenProps } from "../../navigators"
import { observer } from "mobx-react-lite"
import { Button, Header, Screen, Text } from "../../components"
import LottieView from "lottie-react-native"
import { ImageStyle, View, ViewStyle } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

const SuccessLottie = require("../../../assets/lottie/success.json")
const ErrorLottie = require("../../../assets/lottie/error.json")

interface PayCreditAcknowledgementProps
  extends AppStackScreenProps<"PayCreditAcknowledgement"> {
}

export const PayCreditAcknowledgementScreen: FC<PayCreditAcknowledgementProps> = observer(
  function PayCreditAcknowledgementScreen(_props) {
    const { navigation, route } = _props
    const { response } = route.params
    const { bottom } = useSafeAreaInsets()

    function handleDone() {
      navigation.popToTop()
      navigation.push("CreditCustomerList")
    }

    return (
      <>
        <Screen>
          <Header title={"Pay Credit Acknowledgement"} />
          <View style={$view}>
            <LottieView
              source={response.kind === "ok" ? SuccessLottie : ErrorLottie}
              style={$lottie}
              autoPlay
              loop
            />
            <Text text={response.message} />
          </View>
        </Screen>

        <Button
          onPress={handleDone}
          preset={"filled"}
          text={"Done"}
          style={{ ...$cancelButton, bottom: bottom + 10 }}
        />
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

const $cancelButton: ViewStyle = {
  width: 300,
  borderRadius: 30,
  marginRight: 10,
  alignSelf: "center",
}
