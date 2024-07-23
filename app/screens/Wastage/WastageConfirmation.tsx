import React, { FC, useState } from "react"
import { observer } from "mobx-react-lite"
import { TextStyle, TouchableOpacity, View, ViewStyle, Dimensions, Alert } from "react-native"

import { AppStackScreenProps } from "app/navigators"
import { Text, Screen, Header, ListItem, Button, TextField } from "app/components"
import { colors } from "app/theme"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useStores } from "../../models"

interface WastageConfirmationProps extends AppStackScreenProps<"WastageConfirmation"> {}

const { width } = Dimensions.get("screen")

export const WastageConfirmationScreen: FC<WastageConfirmationProps> = observer(
  function WastageConfirmationScreen(
    _props, // @demo remove-current-line
  ) {
    const { bottom } = useSafeAreaInsets()
    const { navigation } = _props
    const { tripStore } = useStores()
    const [cashLeft, setCashLeft] = useState("")

    function handleGoBack() {
      navigation.goBack()
    }

    async function handleConfirm() {
      Alert.alert("End Trip Confirmation", "Please confirm all the details before end trip.", [
        {
          text: "Cancel",
          onPress: () => {},
          style: "cancel",
        },
        {
          text: "Confirm",
          onPress: async () => {
            await tripStore.endTrip({ cash: cashLeft ? Number(cashLeft) : 0 })
            tripStore.resetTrip()
            navigation.popToTop()
          },
        },
      ])
    }

    const handleTextFieldChange = (text) => {
      if (text) {
        return setCashLeft(text)
      }
      setCashLeft("")
    }

    return (
      <>
        <Screen preset="fixed">
          <Header title="Wastage Confirmation" leftIcon="back" onLeftPress={handleGoBack} />

          <View style={$titleSection}>
            <Text weight={"bold"}>Wastage Summary</Text>
            <TouchableOpacity onPress={handleGoBack}>
              <Text weight={"bold"} style={$editText}>
                Edit
              </Text>
            </TouchableOpacity>
          </View>
          {tripStore.wastage.map((item) => (
            <>
              <ListItem
                key={item.name}
                text={item.name}
                containerStyle={$listContainerView}
                RightComponent={<Text style={$center}>{`${item.cart} X`}</Text>}
              />
              <View style={$divider} />
            </>
          ))}
          <ListItem
            disabled={true}
            LeftComponent={
              <Text size={"sm"} weight={"semiBold"} style={$center}>
                Total:
              </Text>
            }
            RightComponent={
              <Text
                size={"sm"}
                weight={"bold"}
                style={$center}
                text={tripStore.getTotalWastage()?.toString()}
              />
            }
            containerStyle={$listContainerView}
          />

          <View style={$divider} />

          <TextField
            value={cashLeft}
            placeholder="0.00"
            label={"Cash left (RM):"}
            onChangeText={handleTextFieldChange}
            keyboardType="numeric"
            containerStyle={$textField}
            returnKeyType='done'
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

const $listContainerView: ViewStyle = {
  backgroundColor: colors.palette.neutral100,
  paddingHorizontal: 20,
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

const $textField: ViewStyle = {
  backgroundColor: colors.palette.neutral100,
  paddingHorizontal: 20,
  paddingVertical: 10,
}
