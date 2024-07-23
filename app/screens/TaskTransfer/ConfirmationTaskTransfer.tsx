import React, { FC } from "react"
import { observer } from "mobx-react-lite"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { View, TouchableOpacity, ViewStyle, TextStyle, Dimensions } from "react-native"

import { AppStackScreenProps } from "app/navigators"
import { Screen, Header, Text, ListItem, Button } from "app/components"
import { colors } from "app/theme"
import { useStores } from "app/models"

const { width } = Dimensions.get("screen")

interface ConfirmationTaskTransferProps extends AppStackScreenProps<"ConfirmationTaskTransfer"> {}

export const ConfirmationTaskTransferScreen: FC<ConfirmationTaskTransferProps> = observer(
  function ConfirmationTaskTransferScreen(_props) {
    const { bottom } = useSafeAreaInsets()
    const { navigation } = _props
    const { taskTransferStore } = useStores()

    function handleGoBack() {
      navigation.goBack()
    }

    async function handleConfirm() {
      const response = await taskTransferStore.submitTaskTransfer()
      navigation.navigate("TaskTransferAcknowledgement", { response })
    }

    return (
      <>
        <Screen>
          <Header title="Task Transfer" leftIcon="back" onLeftPress={handleGoBack} />

          <View style={$titleSection}>
            <Text weight={"bold"}>Transfer Summary</Text>
            <TouchableOpacity onPress={handleGoBack}>
              <Text weight={"bold"} style={$editText}>
                Edit
              </Text>
            </TouchableOpacity>
          </View>

          {taskTransferStore.selectedTaskList.map((item) => (
            <>
              <ListItem
                key={item.id}
                text={item.customer.company}
                containerStyle={$listContainerView}
              />
              <View style={$divider} />
            </>
          ))}

          <ListItem
            disabled={true}
            LeftComponent={
              <Text size={"sm"} weight={"semiBold"} style={$center}>
                Transfer To:
              </Text>
            }
            RightComponent={
              <Text size={"sm"} weight={"bold"} style={{ ...$center, ...$editText }}>
                {taskTransferStore.selectedDriver?.name}
              </Text>
            }
            containerStyle={$transferToListContainer}
          />
        </Screen>

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
  },
)

const $titleSection: ViewStyle = {
  flexDirection: "row",
  justifyContent: "space-between",
  paddingHorizontal: 20,
  marginBottom: 10,
}
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

const $divider: ViewStyle = {
  borderBottomWidth: 0.8,
  width: width * 0.95,
  alignSelf: "center",
  borderBottomColor: colors.palette.secondary100,
}

const $listContainerView: ViewStyle = {
  backgroundColor: colors.palette.neutral100,
  paddingHorizontal: 20,
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
