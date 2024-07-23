import React, { FC } from "react"
import { AppStackScreenProps } from "app/navigators"
import { observer } from "mobx-react-lite"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { Image, ImageStyle, View, ViewStyle } from "react-native"

import { Button, Header, Icon, ListItem, Screen, Text } from "app/components"
import { colors } from "app/theme"
import { useStores } from "app/models"

const UserImage = require("../../../assets/images/user.png")

interface CustomerDetailsProps extends AppStackScreenProps<"CustomerDetails"> {}

export const CustomerDetailsScreen: FC<CustomerDetailsProps> = observer(
  function CustomerDetailsScreen(
    _props, // @demo remove-current-line
  ) {
    const { bottom } = useSafeAreaInsets()
    const { navigation, route } = _props
    const { customerId } = route.params
    const { creditNotesStore } = useStores()
    const { address, company, id, paymentterm, phone, credit, code } =
      creditNotesStore.getSelectedCustomerDetails(customerId)

    function handleGoBack() {
      navigation.goBack()
    }

    function handleViewHistory() {
      navigation.push("CreditCustomerHistory", { customerId: id })
    }

    function handlePayCredit() {
      navigation.push("PayCredit", { customerId: id, credit })
    }

    return (
      <>
        <Screen preset={"fixed"} contentContainerStyle={$centerView}>
          <Header title={"Customer Info"} leftIcon={"back"} onLeftPress={handleGoBack} />

          <Image source={UserImage} style={$userImage} />
          <Text preset={"subheading"} weight={"bold"}>
            {company}
          </Text>

          <View style={$listContainer}>
            <ListItem leftIcon={"id"} text={!!code ? code : "-"} />
            <ListItem leftIcon={"map"} text={!!address ? address : "-"} />
            <ListItem leftIcon={"phone"} text={!!phone ? phone : "-"} />
            <ListItem
              leftIcon={"note"}
              text={!!credit ? `RM ${credit.toFixed(2).toString()}` : "RM 0"}
            />
          </View>
        </Screen>
        <View style={[$buttonContainer, { bottom: bottom + 10 }]}>
          <Button
            onPress={handlePayCredit}
            preset={"filled"}
            text={"Pay Credit"}
            style={$button}
            LeftAccessory={(props) => <Icon icon="credit" size={20} style={$buttonIcon} />}
          />
          <Button
            onPress={handleViewHistory}
            preset={"filled"}
            text={"View History"}
            style={$button}
            LeftAccessory={(props) => <Icon icon="history" size={20} style={$buttonIcon} />}
          />
        </View>
      </>
    )
  },
)

const $centerView: ViewStyle = {
  alignItems: "center",
}

const $userImage: ImageStyle = {
  width: 80,
  height: 80,
  marginVertical: 20,
  tintColor: colors.palette.primary500,
}

const $listContainer: ViewStyle = {
  backgroundColor: colors.palette.neutral100,
  borderRadius: 10,
  paddingHorizontal: 20,
  width: 300,
  marginTop: 20,
}

const $button: ViewStyle = {
  borderRadius: 30,
  width: 150,
  alignSelf: "center",
  marginHorizontal: 10,
}

const $buttonContainer: ViewStyle = {
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
}

const $buttonIcon: ImageStyle = {
  tintColor: colors.palette.neutral100,
  marginRight: 5,
}
