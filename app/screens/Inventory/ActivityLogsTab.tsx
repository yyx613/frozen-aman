import React, { FC, useEffect, useState } from "react"
import { TouchableOpacity, TextStyle, ViewStyle, ImageStyle } from "react-native"
import DatePicker from "react-native-date-picker"
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs"
import moment from "moment"
import { observer } from "mobx-react-lite"

import { Header, Text, Icon, Loading } from "app/components"
import { ActivityLogsSectionList } from "./ActivityLogsSectionList"
import { AppStackScreenProps } from "app/navigators"
import { useStores } from "app/models"
import { colors } from "app/theme"

const Tab = createMaterialTopTabNavigator()


interface ActivityLogsTabProps extends AppStackScreenProps<"ActivityLogTab"> {}

export const ActivityLogsTab: FC<ActivityLogsTabProps> = observer(function ActivityLogsTab(_props) {
  const today = moment().toDate()
  const { navigation } = _props
  const { stockStore } = useStores()
  const [date, setDate] = useState(today)
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false)

  useEffect(() => {
    stockStore.loadStockTransaction(today).then( )
  }, [])

  function handleGoBack() {
    navigation.pop()
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
    await stockStore.loadStockTransaction(date)
  }

  async function handleRefresh() {
    await stockStore.loadStockTransaction(date)
  }

  return (
    <>
      <Header title="Stock Transaction" leftIcon="back" onLeftPress={handleGoBack} />
      <TouchableOpacity style={$dateSection} onPress={handleOpenDatePicker}>
        <Text text={moment(date).format("YYYY-MM-DD")} style={$dateTitle} size="md" weight="bold" />
        <Icon icon="arrowDown" style={$downIcon} />
      </TouchableOpacity>
      <Tab.Navigator>
        <Tab.Screen
          name="In"
          children={() => (
            <ActivityLogsSectionList
              data={stockStore.getStockInTransactions()}
              onRefresh={handleRefresh}
              isLoading={stockStore.isLoading}
            />
          )}
        />
        <Tab.Screen
          name="Out"
          children={() => (
            <ActivityLogsSectionList
              data={stockStore.getStockOutTransactions()}
              onRefresh={handleRefresh}
              isLoading={stockStore.isLoading}
            />
          )}
        />
      </Tab.Navigator>
      {stockStore.isLoading && <Loading preset="blurFullScreen" />}
      <DatePicker
        modal
        open={isDatePickerVisible}
        onCancel={handleCloseDatePicker}
        onConfirm={(date) => handleConfirmDate(date)}
        maximumDate={today}
        date={date}
        mode={"date"}
      />
    </>
  )
})

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
