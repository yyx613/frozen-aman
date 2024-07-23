import React, { FC, useEffect } from "react"
import LottieView from "lottie-react-native"
import { observer, Observer } from "mobx-react-lite"
import {
  Dimensions,
  FlatList,
  View,
  ViewStyle,
  Alert,
  ImageStyle,
  TouchableOpacity,
} from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { Button, Header, Loading, Screen, Text } from "../../components"
import { colors } from "../../theme"
import { AppStackScreenProps } from "app/navigators"
import { useStores } from "../../models"

const EmptyJSON = require("../../../assets/lottie/empty.json")

interface TaskListProps extends AppStackScreenProps<"TaskTransfer"> {}
const { width } = Dimensions.get("screen")

export const TaskList: FC<TaskListProps> = observer(function TaskList(_props) {
  const { navigation } = _props
  const { taskStore, taskTransferStore, orderStore, tripStore } = useStores()
  const { bottom } = useSafeAreaInsets()
  const isLoading = taskTransferStore.isLoading || orderStore.isLoading || taskStore.isLoading

  useEffect(() => {
    ;(async function loadTask() {
      await loadTaskTransferredList()
      await handlePendingOrder()
      if (tripStore.status) {
        await taskStore.loadTask()
      }
    })()
  }, [])

  async function handlePendingOrder() {
    if (orderStore.pendingOrders.length !== 0) {
      const response = await orderStore.submitPendingTask()
      if (response.kind !== "ok") {
        Alert.alert(
          "Pending Orders Subimssion",
          "Please submit all your pending orders before task transfer.",
          [{ text: "OK", onPress: () => navigation.push("PendingOrder") }],
        )
      }
      console.log("response", response)
    }
  }

  function handleGoBack() {
    navigation.goBack()
  }

  function handleTaskTransfer() {
    if (tripStore.status) return navigation.push("DriverSelection")
    Alert.alert("Please start a trip first before task transfer.")
  }

  async function loadTaskTransferredList() {
    await taskTransferStore.loadTaskTransferredList()
  }

  function handleItemPress(id) {
    navigation.push("TaskTransferDetails", { id })
  }

  function renderEmpty() {
    if (taskTransferStore.taskTransferredList.length === 0)
      return <LottieView source={EmptyJSON} autoPlay={true} style={$emptyView} loop={true} />
    return <View style={$footer} />
  }

  function renderItem(props) {
    const { item } = props
    return (
      <Observer>
        {() => (
          <TouchableOpacity style={$listItemView} onPress={() => handleItemPress(item.id)}>
            <View style={{ flex: 3 }}>
              <Text size={"xxs"}>{item.task?.customer.code}</Text>
              <Text size={"sm"} weight={"semiBold"} numberOfLines={1}>
                {item.task?.customer.company}
              </Text>
              <Text size={"xxs"}>{item.task?.customer.phone}</Text>
            </View>
          </TouchableOpacity>
        )}
      </Observer>
    )
  }

  return (
    <>
      <Screen safeAreaEdges={["bottom"]}>
        <Header
          title="Task Transfered"
          safeAreaEdges={["top"]}
          leftIcon="back"
          onLeftPress={handleGoBack}
        />
        <FlatList
          refreshing={taskTransferStore.isLoading}
          onRefresh={loadTaskTransferredList}
          data={taskTransferStore.taskTransferredList}
          renderItem={(props) => renderItem(props)}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={$listContainer}
          ListFooterComponent={renderEmpty()}
        />
      </Screen>

      <Button
        onPress={handleTaskTransfer}
        preset={"filled"}
        text={"Transfer Task"}
        style={{ ...$bottomButton, bottom: bottom + 5 }}
      />
      {isLoading && <Loading preset="blurFullScreen" />}
    </>
  )
})

const $listContainer: ViewStyle = {
  marginHorizontal: 20,
  alignItems: "center",
}

const $bottomButton: ViewStyle = {
  borderRadius: 30,
  width: 300,
  position: "absolute",
  alignSelf: "center",
}

const $listItemView: ViewStyle = {
  flexDirection: "row",
  borderRadius: 10,
  backgroundColor: colors.palette.neutral100,
  width: width * 0.85,
  padding: 10,
  alignItems: "center",
  justifyContent: "space-between",
  marginVertical: 5,
}
const $footer: ViewStyle = {
  height: 250,
}

const $emptyView: ImageStyle = {
  width: "70%",
  alignSelf: "center",
  flex: 2,
}
