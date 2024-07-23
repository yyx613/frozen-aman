import React, { FC, useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import { Dimensions, Image, ImageStyle, TextStyle, View, ViewStyle, Alert } from "react-native"
import * as Progress from "react-native-progress"
import Moment from "moment"

import { Button, Loading, Screen, SearchBar, Text } from "../../components"
import { colors } from "../../theme"
import { useStores } from "app/models"
import { dateTime } from "app/utils"
import { MainTabScreenProps } from "app/navigators"

import { TaskList } from "./components/TaskList"
import { useIsConnected } from "react-native-offline"

const TruckImage = require("../../../assets/images/truck.png")

const { width } = Dimensions.get("window")

export const DeliveryRouteScreen: FC<MainTabScreenProps<"Delivery">> = observer(
  function DemoCommunityScreen(_props) {
    const { navigation } = _props
    const isConnected = useIsConnected()
    const { tripStore, taskStore, stockStore, orderStore } = useStores()
    const todayDate = Moment().format(dateTime.DATE_TIME_DISPLAY)
    const [searchText, setSearchText] = useState("")
    const isLoading = tripStore.isLoading || taskStore.isLoading || stockStore.isLoading

    useEffect(() => {
      ;(async () => {
        if (tripStore.status) {
          await taskStore.loadTask()
          await handleLoadStocks()
        }
      })()
    }, [tripStore.status])

    useEffect(() => {
      orderStore.reset()
    }, [])

    async function handleLoadStocks() {
      const response = await stockStore.loadStocks()
      if (response.kind === "pendingOrderError") {
        Alert.alert(
          "Pending Orders Subimssion",
          "Please submit all your pending orders before create new order.",
          [{ text: "OK", onPress: () => navigation.push("PendingOrder") }],
        )
      }
    }

    function handleTrip() {
      if (tripStore.status) {
        return navigation.push("WastageSelection")
      }
      navigation.push("DriverInfoInput")
    }

    function handleSelectCustomer(taskId) {
      navigation.push("CustomerInfo", { taskId })
    }

    function handleSearchTextChange(text) {
      setSearchText(text)
    }

    function renderDeliveryProgress() {
      return (taskStore.getDeliveryProgress() * 100).toFixed(0)
    }

    async function handleRefresh() {
      if (!!isConnected) {
        await taskStore.loadTask()
        await handleLoadStocks()
      }
    }

    return (
      <>
        <Screen preset={"fixed"} safeAreaEdges={["top"]} contentContainerStyle={$centerView}>
          <Text text={todayDate} size={"lg"} weight={"semiBold"} style={$dateTitle} />

          {tripStore.status ? (
            <>
              <SearchBar
                viewStyle={$searchBar}
                onChangeText={(text) => handleSearchTextChange(text)}
              />
              <View style={$progressView}>
                <Text size={"xs"} style={$centeredText}>
                  {renderDeliveryProgress()} %
                </Text>
                <Progress.Bar
                  width={width * 0.8}
                  borderWidth={undefined}
                  progress={taskStore.getDeliveryProgress()}
                  color={colors.palette.primary500}
                  unfilledColor={colors.palette.secondary300}
                />
              </View>

              <TaskList
                list={taskStore.filterTaskByName(searchText).slice()}
                onItemPress={handleSelectCustomer}
                onRefresh={handleRefresh}
                isLoading={taskStore.isLoading}
              />
            </>
          ) : (
            <>
              <Image source={TruckImage} style={$lorryImage} />
              <Text preset="formHelper" text="Click on Start Trip to get your task today." />
            </>
          )}
        </Screen>
        <Button
          onPress={handleTrip}
          preset={"filled"}
          text={tripStore.status ? "End Trip" : "Start Trip"}
          style={$button}
        />
        {isLoading && <Loading preset={"fullscreen"} />}
      </>
    )
  },
)

const $progressView: ViewStyle = {
  marginHorizontal: 20,
  width: width * 0.9,
  justifyContent: "center",
  padding: 10,
  borderRadius: 10,
  marginBottom: 20,
  alignItems: "center",
}

const $lorryImage: ImageStyle = {
  width: "50%",
  height: undefined,
  aspectRatio: 1.1,
  marginBottom: 10,
  alignSelf: "center",
  alignItems: "center",
  marginTop: 200,
}

const $centeredText: TextStyle = {
  textAlign: "center",
}

const $button: ViewStyle = {
  borderRadius: 30,
  width: 300,
  position: "absolute",
  bottom: 5,
  alignSelf: "center",
}

const $centerView: ViewStyle = {
  alignItems: "center",
}

const $dateTitle: TextStyle = {
  textAlign: "center",
  marginBottom: 10,
}

const $searchBar = {
  backgroundColor: colors.palette.neutral100,
}
