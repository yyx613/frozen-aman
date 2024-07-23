import React, { FC, useEffect, useState } from "react"
import {
  Alert,
  ImageStyle,
  TextStyle,
  View,
  ViewStyle,
  RefreshControl,
  ScrollView,
  TouchableOpacity,
} from "react-native"
import { DemoTabScreenProps } from "../../navigators/DemoNavigator"
import { Card, Icon, IconButton, IconTypes, Text } from "../../components"
import { colors, spacing } from "../../theme"
import { DashboardSnapshotIn, useStores } from "../../models"
import { AppStackParamList } from "../../navigators"
import { observer } from "mobx-react-lite"
import moment from "moment"
import { SafeAreaView } from "react-native-safe-area-context"
import { version } from "../../../package.json"
import useAppState from "../../utils/useAppState"

export const HomeScreen: FC<DemoTabScreenProps<"Home">> = observer(function DemoCommunityScreen(
  _props,
) {
  const today = moment().toDate()
  const {
    authenticationStore: { logout, distributeAuthToken, user, checkSession },
    tripStore,
    dashboardStore,
  } = useStores()
  const { navigation } = _props
  const [dashboardData, setDashboardData] = useState<DashboardSnapshotIn>({})
  const [isRefreshing, setIsRefreshing] = useState(false)
  const appState = useAppState()


  useEffect(() => {
    if(appState){
      ;(async function preLoad() {
        const isValidSession = await checkSession()
        if (isValidSession) {
          distributeAuthToken()
          await tripStore.checkTrip()
          checkIsEndTripRequire()
          await loadDashBoard()
        }
      })()
    }
  }, [appState])


  async function onReresh() {
    setIsRefreshing(true)
    const isValidSession = await checkSession()
    if (isValidSession) {
      distributeAuthToken()
      await tripStore.checkTrip()
      checkIsEndTripRequire()
      await loadDashBoard()
    }
    setIsRefreshing(false)
  }

  async function loadDashBoard() {
    const response = await dashboardStore.fetchDashboard(today)
    if (response.kind === "ok") setDashboardData(response.dashboard)
  }

  function navigateTo(path: keyof AppStackParamList) {
    navigation.push(path)
  }

  function checkIsEndTripRequire() {
    // Check if the trip is over
    if (tripStore.trip === undefined) {
      return console.tron.log("CheckIsEndTripRequire - trip undefined")
    }

    // Check if trip is before today's date
    const tripCreatedDate = moment(tripStore.trip.created_at)
    if (moment(tripCreatedDate).isBefore(today, "day")) {
      Alert.alert(
        "End Trip Required",
        "Please end your previous trip before start a new trip today",
        [{ text: "OK", onPress: () => navigateTo("WastageSelection") }],
      )
    }
  }

  return (
    <SafeAreaView>
      <ScrollView
        contentContainerStyle={$screen}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onReresh} />}
      >
        <View style={$headerContainer}>
          <Text preset="bold" text={`Hello, ${user?.name}`}  style={$userName}/>
          <TouchableOpacity style={$logoutButton} onPress={logout}>
            <Icon icon="logout" color={colors.palette.primary500} size={25} />
            <Text style={{ fontSize: 10 }}>Logout</Text>
          </TouchableOpacity>
        </View>

        <View style={$cardRowContainer}>
          <Card
            style={[$card, $salesCard]}
            verticalAlignment={"center"}
            ContentComponent={
              <View style={$cardCenterView}>
                <Icon icon={"cart"} size={25} color={colors.palette.neutral100} style={$cardIcon} />
                <Text weight={"bold"} size={"lg"} style={$cardText}>
                  {dashboardData.sales}
                </Text>
              </View>
            }
            footer={"Sales (RM)"}
            footerStyle={$cardFooter}
            FooterTextProps={{ weight: "semiBold", size: "xs" }}
          />
          <Card
            style={[$card, $paymentCard]}
            verticalAlignment={"center"}
            ContentComponent={
              <View style={$cardCenterView}>
                <Icon
                  icon={"dollar"}
                  size={25}
                  color={colors.palette.neutral100}
                  style={$cardIcon}
                />
                <Text weight={"bold"} size={"lg"} style={$cardText}>
                  {dashboardData.cash}
                </Text>
              </View>
            }
            footer={"Payment Collected (RM)"}
            footerStyle={$cardFooter}
            FooterTextProps={{ weight: "semiBold", size: "xs" }}
          />
        </View>

        <View style={$cardRowContainer}>
          <Card
            style={[$card, $soldCard]}
            verticalAlignment={"center"}
            ContentComponent={
              <View style={$cardCenterView}>
                <Icon icon={"box"} size={25} color={colors.palette.neutral100} style={$cardIcon} />
                <Text weight={"bold"} size={"lg"} style={$cardText}>
                  {dashboardData.productsold?.total_quantity}
                </Text>
              </View>
            }
            footer={"Product Sold"}
            footerStyle={$cardFooter}
            FooterTextProps={{ weight: "semiBold", size: "xs" }}
          />
          <Card
            style={[$card, $creditCard]}
            verticalAlignment={"center"}
            ContentComponent={
              <View style={$cardCenterView}>
                <Icon icon={"cart"} size={25} color={colors.palette.neutral100} style={$cardIcon} />
                <Text weight={"bold"} size={"lg"} style={$cardText}>
                  {dashboardData.credit}
                </Text>
              </View>
            }
            footer="Credit Note (RM)"
            footerStyle={$cardFooter}
            FooterTextProps={{ weight: "semiBold", size: "xs" }}
          />
        </View>
        <View style={$cardRowContainer}>
          <IconButton
            icon={"taskTransfer" as IconTypes}
            iconColor={colors.tint}
            iconSize={35}
            style={$button}
            text="Task Transfer"
            onPress={() => navigateTo("TaskTransfer")}
          />

          <IconButton
            icon={"stock" as IconTypes}
            iconColor={colors.tint}
            iconSize={35}
            style={$button}
            text="Stock Transfer"
            onPress={() => navigateTo("StockTransferHistory")}
          />

          <IconButton
            icon={"credit" as IconTypes}
            iconColor={colors.tint}
            iconSize={35}
            style={$button}
            text="Credit Note"
            onPress={() => navigateTo("CreditCustomerList")}
          />

          <IconButton
            icon={"summary" as IconTypes}
            iconColor={colors.tint}
            iconSize={35}
            style={$button}
            text="End Trip Summary"
            onPress={() => navigateTo("EndTripSummary")}
          />
        </View>

        <IconButton
          icon={"delivery" as IconTypes}
          iconColor={colors.tint}
          iconSize={35}
          style={$button}
          text="Pending Orders"
          onPress={() => navigateTo("PendingOrder")}
        />

        <View style={{ marginTop: 50, alignSelf: "center" }}>
          <Text>{`v${version}`}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
})

const $screen: ViewStyle = {
  marginHorizontal: spacing.md,
}

const $card: ViewStyle = {
  backgroundColor: colors.palette.purple,
  padding: 10,
  flex: 1,
  marginHorizontal: 10,
}

const $cardRowContainer: ViewStyle = {
  flexDirection: "row",
  flex: 1,
  marginTop: 20,
}

const $salesCard: ViewStyle = {
  backgroundColor: colors.palette.purple,
}

const $paymentCard: ViewStyle = {
  backgroundColor: colors.palette.mintGreen,
}

const $soldCard: ViewStyle = {
  backgroundColor: colors.palette.orange,
}

const $creditCard: ViewStyle = {
  backgroundColor: colors.palette.pink,
}

const $cardCenterView: ViewStyle = {
  flexDirection: "row",
  justifyContent: "center",
}

const $cardIcon: ImageStyle = {
  marginRight: 10,
}

const $cardText: TextStyle = {
  color: colors.palette.neutral100,
}

const $cardFooter: TextStyle = {
  alignSelf: "center",
  color: colors.palette.neutral100,
}

const $button: ViewStyle = {
  marginBottom: spacing.xs,
}

const $headerContainer: ViewStyle = {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  marginVertical: 20,
  marginHorizontal: 20,
}

const $logoutButton: ViewStyle = {
  alignItems: "center",
  justifyContent: "center",
  flex:1,
  alignItems: "flex-end",
}

const $userName: TextStyle = {
  fontSize: 18, flex: 2
}
