import React, { FC, useState, useEffect } from "react"
import { FlatList, View, ViewStyle } from "react-native"
import { Observer, observer } from "mobx-react-lite"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { AppStackScreenProps } from "app/navigators"
import { Button, Header, ListItem, Screen, SearchBar, Toggle, Loading } from "app/components"
import { colors, spacing } from "app/theme"
import { useStores } from "../../models"

interface CustomerSelectionProps extends AppStackScreenProps<"CustomerSelection"> {}

export const CustomerSelectionScreen: FC<CustomerSelectionProps> = observer(
  function CustomerSelectionScreen(_props) {
    const { navigation } = _props
    const { bottom } = useSafeAreaInsets()
    const { taskStore, taskTransferStore } = useStores()

    const [searchText, setSearchText] = useState<any>("")

    function handleGoBack() {
      navigation.goBack()
    }

    function handleTaskTransfer() {
      navigation.push("ConfirmationTaskTransfer")
    }

    async function handleRefresh() {
      await taskStore.loadTask()
    }

    return (
      <>
        <Screen>
          <Header title="Select Customer" leftIcon="back" onLeftPress={handleGoBack} />

          <SearchBar
            placeholder="Search Customer"
            onChangeText={setSearchText}
            viewStyle={$searchBarView}
          />

          <View style={$space} />

          <FlatList
            refreshing={taskStore.isLoading}
            onRefresh={handleRefresh}
            data={taskStore.filterTaskByName(searchText).slice()}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <Observer>
                {() => (
                  <ListItem
                    onPress={() => taskTransferStore.updateSelectedTask(item)}
                    text={item.customer.company}
                    style={$listView}
                    RightComponent={
                      <Toggle
                        value={taskTransferStore.getSelectedTaskList(item.id)}
                        containerStyle={$listRight}
                        onValueChange={() => taskTransferStore.updateSelectedTask(item)}
                      />
                    }
                  />
                )}
              </Observer>
            )}
            ListFooterComponent={<View style={{ height: bottom + 300 }} />}
          />
          {taskStore.isLoading && <Loading preset="fullscreen" />}
        </Screen>
        <Button
          onPress={handleTaskTransfer}
          preset={"filled"}
          text={"Task Transfer"}
          style={[$bottomButton, { bottom: bottom + 5 }]}
        />
      </>
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

const $listRight: ViewStyle = {
  alignSelf: "center",
}

const $bottomButton: ViewStyle = {
  borderRadius: 30,
  width: 300,
  position: "absolute",
  alignSelf: "center",
}
