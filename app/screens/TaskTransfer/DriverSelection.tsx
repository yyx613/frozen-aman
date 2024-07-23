import React, { FC, useEffect, useState } from "react"
import { ViewStyle, FlatList, View } from "react-native"
import { observer } from "mobx-react-lite"

import { AppStackScreenProps } from "app/navigators"
import { Header, ListItem, Loading, Screen, SearchBar } from "app/components"
import { colors, spacing } from "app/theme"
import { useStores } from "../../models"

interface DriverSelectionProps extends AppStackScreenProps<"DriverSelection"> {}

export const DriverSelectionScreen: FC<DriverSelectionProps> = observer(
  function DriverSelectionScreen(_props) {
    const { navigation } = _props
    const { taskTransferStore } = useStores()
    const [searchText, setSearchText] = useState("")

    useEffect(() => {
      ;(async function loadDriver() {
        await taskTransferStore.loadDriver()
      })()
    }, [])

    async function handleRefresh() {
      await taskTransferStore.loadDriver()
    }

    function handleGoBack() {
      navigation.goBack()
    }

    function handleSelectDriver(item) {
      taskTransferStore.updateSelectedDriver(item)
      navigation.push("CustomerSelection")
    }

    function selectedColor(id) {
      if (!taskTransferStore.selectedDriver) return colors.palette.neutral100
      if (id === taskTransferStore.selectedDriver.id) return colors.palette.primary400
      return colors.palette.neutral100
    }

    function handleSearchTextChange(text) {
      setSearchText(text)
    }

    return (
      <Screen>
        <Header title="Select Driver" leftIcon="back" onLeftPress={handleGoBack} />
        <SearchBar
          placeholder="Search Driver"
          onChangeText={(text) => {
            handleSearchTextChange(text)
          }}
          viewStyle={$searchBarView}
        />
        <View style={$space} />

        <FlatList
          refreshing={taskTransferStore.isLoading}
          onRefresh={handleRefresh}
          data={taskTransferStore.filterDriverByName(searchText).slice()}
          renderItem={(props) => (
            <ListItem
              onPress={() => handleSelectDriver(props.item)}
              text={props.item.name}
              style={{ ...$listView, backgroundColor: selectedColor(props.item.id) }}
            />
          )}
          keyExtractor={(item) => item.id.toString()}
        />
        {taskTransferStore.isLoading && <Loading preset="fullscreen" />}
      </Screen>
    )
  },
)

const $searchBarView: ViewStyle = {
  backgroundColor: colors.palette.neutral100,
}

const $listView: ViewStyle = {
  paddingHorizontal: 20,
  backgroundColor: colors.palette.neutral100,
}

const $space: ViewStyle = {
  marginTop: spacing.sm,
}
