import React, { FC } from "react"
import { AppStackScreenProps } from "../../navigators"
import { observer } from "mobx-react-lite"
import { Button, Header, Screen, Text } from "../../components"
import LottieView from "lottie-react-native"
import { ImageStyle, ViewStyle, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useStores } from "app/models"

const SuccessLottie = require("../../../assets/lottie/success.json")
const ErrorLottie = require("../../../assets/lottie/error.json")

interface TaskTransferAcknowledgementProps
  extends AppStackScreenProps<"TaskTransferAcknowledgement"> {}

export const TaskTransferAcknowledgementScreen: FC<TaskTransferAcknowledgementProps> = observer(
  function TaskTransferAcknowledgementScreen(_props) {
    const { navigation, route } = _props
    const { response } = route.params
    const { bottom } = useSafeAreaInsets()
    const { taskTransferStore } = useStores()

    function handleDone() {
      taskTransferStore.reset()
      navigation.popToTop()
      navigation.push("TaskTransfer")
    }

    return (
      <>
        <Screen>
          <Header title={"Order Acknowledgement"} />
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
