import React, { FC, useEffect, useState } from "react"
import {
  View,
  ViewStyle,
  TextStyle,
  TouchableOpacity,
  TextInput,
  Alert,
  FlatList,
} from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { AppStackScreenProps } from "app/navigators"
import { observer } from "mobx-react-lite"

import { colors, typography } from "app/theme"
import { Screen, Header, Text, Button, ListItem, BottomModal, Icon, Loading } from "app/components"
import { useStores } from "app/models"

interface DriverInfoInputProps extends AppStackScreenProps<"DriverInfoInput"> {}

export const DriverInfoInputScreen: FC<DriverInfoInputProps> = observer(
  function DriverInfoInputScreen(
    _props, // @demo remove-current-line
  ) {
    const { navigation } = _props
    const { bottom } = useSafeAreaInsets()
    const { tripStore } = useStores()
    const [isLorryModalVisible, setIsLorryModalVisible] = useState(false)
    const [isKelindanModalVisible, setIsKelindanModalVisible] = useState(false)
    const [searchLorryText, setSearchLorryText] = useState("")
    const [searchKelindanText, setSearchKelindanText] = useState("")

    useEffect(() => {
      tripStore.resetTripInputInfo()
      loadLorryKelindan().then()
    }, [tripStore.status])

    async function loadLorryKelindan() {
      await tripStore.loadKelindan()
      await tripStore.loadLorry()
    }

    function handleGoBack() {
      navigation.goBack()
    }

    function handleOpenLorryModal() {
      setIsLorryModalVisible(true)
    }

    function handleCloseLorryModal() {
      setIsLorryModalVisible(false)
    }
    function handleOpenKelindanModal() {
      setIsKelindanModalVisible(true)
    }

    function handleCloseKelindanModal() {
      setIsKelindanModalVisible(false)
    }

    async function handleLorryListRefresh() {
      await tripStore.loadLorry()
    }
    async function handleKelindanListRefresh() {
      await tripStore.loadKelindan()
    }

    function handleLorryTextChange(text) {
      setSearchLorryText(text)
    }

    function handleKelindanTextChange(text) {
      setSearchKelindanText(text)
    }

    function handleSelectLorry(item) {
      tripStore.updateSelectedLorry(item)
      handleCloseLorryModal()
    }

    function handleSelectKelindan(item) {
      tripStore.updateSelectedKelindan(item)
      handleCloseKelindanModal()
    }

    async function handleSubmit() {
      if (tripStore.selectedKelindan === null || tripStore.selectedLorry === null) {
        return Alert.alert("Please select all required filed.")
      }
      await tripStore.startTrip()
      navigation.popToTop()
    }
    return (
      <>
        <Screen>
          <Header title="Driver Info" leftIcon="back" onLeftPress={handleGoBack} />

          <View style={$inputContainer}>
            <Text>Lorry</Text>

            <ListItem
              text={tripStore.selectedLorry ? tripStore.selectedLorry.lorryno : "Select.."}
              style={$dropDownContainer}
              rightIcon="down"
              rightIconColor={colors.palette.primary500}
              height={40}
              onPress={handleOpenLorryModal}
            />
          </View>
          <View style={$inputContainer}>
            <Text>Kelindan</Text>
            <ListItem
              text={tripStore.selectedKelindan ? tripStore.selectedKelindan.name : "Select..."}
              style={$dropDownContainer}
              rightIcon="down"
              rightIconColor={colors.palette.primary500}
              height={40}
              onPress={handleOpenKelindanModal}
            />
          </View>
        </Screen>
        <Button
          onPress={handleSubmit}
          preset={"filled"}
          text={"Confirm"}
          style={[$button, { bottom: bottom + 10 }]}
        />

        <BottomModal isVisible={isLorryModalVisible} onCancel={handleCloseLorryModal}>
          <TouchableOpacity style={$searchContainer}>
            <Icon icon="search" size={20} />
            <TextInput
              placeholder="Search"
              style={$textInput}
              onChangeText={handleLorryTextChange}
              placeholderTextColor={colors.text}
            />
          </TouchableOpacity>
          <FlatList
            refreshing={tripStore.isLoading}
            onRefresh={handleLorryListRefresh}
            data={tripStore.filterLorryByName(searchLorryText)}
            renderItem={({ item }) => (
              <ListItem
                key={item.id}
                text={item.lorryno}
                textStyle={$listText}
                height={40}
                bottomSeparator
                style={$listView}
                onPress={() => handleSelectLorry(item)}
              />
            )}
          />
        </BottomModal>

        <BottomModal isVisible={isKelindanModalVisible} onCancel={handleCloseKelindanModal}>
          <TouchableOpacity style={$searchContainer}>
            <Icon icon="search" size={20} />
            <TextInput
              placeholder="Search"
              style={$textInput}
              onChangeText={handleKelindanTextChange}
              placeholderTextColor={colors.text}
            />
          </TouchableOpacity>

          <FlatList
            refreshing={tripStore.isLoading}
            onRefresh={handleKelindanListRefresh}
            data={tripStore.filterKelindanByName(searchKelindanText)}
            renderItem={({ item }) => (
              <ListItem
                key={item.id}
                text={item.name}
                textStyle={$listText}
                height={40}
                bottomSeparator
                style={$listView}
                onPress={() => handleSelectKelindan(item)}
              />
            )}
          />
        </BottomModal>
        {tripStore.isLoading && <Loading preset={"fullscreen"} />}
      </>
    )
  },
)
const $inputContainer: ViewStyle = {
  paddingHorizontal: 20,
  backgroundColor: colors.palette.neutral100,
  paddingVertical: 10,
}
const $button: ViewStyle = {
  borderRadius: 30,
  width: 300,
  position: "absolute",
  alignSelf: "center",
}
const $dropDownContainer: ViewStyle = {
  backgroundColor: colors.palette.secondary100,
  borderRadius: 10,
  padding: 5,
  paddingHorizontal: 5,
  marginTop: 20,
}

const $searchContainer: ViewStyle = {
  backgroundColor: colors.palette.secondary100,
  borderRadius: 10,
  padding: 10,
  marginHorizontal: 20,
  marginTop: 20,
  flexDirection: "row",
  alignItems: "center",
}

const $textInput: TextStyle = {
  fontFamily: typography.primary.normal,
  fontSize: 14,
  height: 30,
  flex: 1,
  textAlignVertical: "center",
  paddingVertical: 0,
  paddingHorizontal: 0,
  marginHorizontal: 5,
  color: colors.text
}

const $listText: TextStyle = {
  fontSize: 14,
}

const $listView: ViewStyle = {
  paddingHorizontal: 20,
}
