import React, { FC } from "react"
import { observer } from "mobx-react-lite"

import { AppStackScreenProps } from "app/navigators"
import { Header, Screen } from "../../components"
import { TabBar } from "../DeliveryRoute/components/TabBar"
import { Text, View } from "react-native"

interface InventoryHistoryProps extends AppStackScreenProps<"InventoryHistory"> {}

export const InventoryHistoryScreen: FC<InventoryHistoryProps> = observer(
  function InventoryHistoryScreen(_props) {
    const { navigation } = _props

    function handleGoBack() {
      navigation.pop()
      console.log("handleGoBack")
    }

    return (
      <Screen preset="fixed">
        <Header title="Stock Transfer" leftIcon="back" onLeftPress={handleGoBack} />
        <TabBar
          onTabChange={(index) => {
            console.log(index)
          }}
        />
      </Screen>
    )
  },
)
