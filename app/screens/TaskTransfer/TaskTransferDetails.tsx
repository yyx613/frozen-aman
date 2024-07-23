import React, { FC } from "react"
import { observer } from "mobx-react-lite"
import { TextStyle, View, ViewStyle } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { AppStackScreenProps } from "app/navigators"
import { Text, Screen, Header, ListItem, Button } from "app/components"
import { colors } from "app/theme"
import { useStores } from "../../models"

interface TaskTransferTaskDetailProps extends AppStackScreenProps<"TaskTransferDetails"> {}

export const TaskTransferTaskDetailsScreen: FC<TaskTransferTaskDetailProps> = observer(
  function StockTransferTaskDetailScreen(
    _props, // @demo remove-current-line
  ) {
    const { bottom } = useSafeAreaInsets()
    const { navigation, route } = _props
    const { id } = route.params || {}
    const { taskTransferStore } = useStores()
    const data = taskTransferStore.getTaskTransferedById(id) || {}
    const { task, todriver } = data || {}
    console.log("task", todriver, task, data)

    function handleGoBack() {
      navigation.goBack()
    }

    return (
      <>
        <Screen preset="fixed">
          <Header title="Task Transfer Details" leftIcon="back" onLeftPress={handleGoBack} />
          <ListItem
            disabled={true}
            text={`Task Transferred`}
            containerStyle={$transferToListContainer}
            RightComponent={<Text   weight={"semiBold"} style={$center}>{task?.customer?.company}</Text>}
          />
          <ListItem
            disabled={true}
            text={`Transfer To`}
            containerStyle={$transferToListContainer}
            RightComponent={<Text  weight={"semiBold"} style={$center}>{todriver?.name}</Text>}
          />
          <ListItem
            disabled={true}
            text={`Date`}
            containerStyle={$transferToListContainer}
            RightComponent={<Text  weight={"semiBold"} style={$center}>{task?.date}</Text>}
          />
        </Screen>
        <Button
          onPress={handleGoBack}
          preset={"filled"}
          text={"Done"}
          style={{ ...$cancelButton, bottom: bottom + 10 }}
        />
      </>
    )
  },
)

const $editText: TextStyle = {
  color: colors.palette.primary500,
}

const $listContainerView: ViewStyle = {
  backgroundColor: colors.palette.neutral100,
  paddingHorizontal: 20,
}

const $center: TextStyle = {
  alignSelf: "center",
}
const $transferToListContainer: ViewStyle = {
  backgroundColor: colors.palette.neutral100,
  paddingHorizontal: 20,
}

const $bottomButtonView: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
}

const $cancelButton: ViewStyle = {
  width: 300,
  borderRadius: 30,
  marginRight: 10,
  alignSelf: "center",
}
