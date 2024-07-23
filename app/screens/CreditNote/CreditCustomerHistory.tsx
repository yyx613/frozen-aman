import React, { FC, useEffect } from "react"
import { ViewStyle, SectionList, View, TextStyle } from "react-native"

import { AppStackScreenProps } from "app/navigators"
import { observer } from "mobx-react-lite"
import { Header, Screen, Text, ListItem, Icon } from "app/components"
import { colors } from "app/theme"
import { useStores } from "app/models"
import { sortListByDateTime } from "../../utils/sorting"

interface CreditCustomerHistoryProps extends AppStackScreenProps<"CreditCustomerHistory"> {}

export const CreditCustomerHistoryScreen: FC<CreditCustomerHistoryProps> = observer(
  function CreditCustomerHistoryScreen(
    _props, // @demo remove-current-line
  ) {
    const { route, navigation } = _props
    const { customerId } = route.params
    const {
      creditNotesStore: { loadHistory, getHistory },
    } = useStores()

    const sortedList = sortListByDateTime({list: getHistory()?.slice(), dateName: 'date' }).reverse()

    useEffect(() => {
      ;(async function load() {
        await loadHistory(customerId)
      })()
    }, [])
    function handleBack() {
      navigation.goBack()
    }

    function handleSelectItem({ id, type: paymentType, amount }) {
      if (paymentType === "Payment") return
      navigation.push("InvoicePreview", { invoiceId: id, customerId, amount })
    }

    const renderItem = (props) => {
      const { id, type, amount, name } = props.item
      return (
        <ListItem
          disabled={type === "Payment"}
          onPress={() => handleSelectItem({ id, type, amount })}
          text={name !== "" ? name : "Payment"}
          containerStyle={$container}
          RightComponent={
            <View style={$rightItem}>
              <Text text={amount} style={$amountText} />
              {type !== "Payment" && <Icon icon={"next"} size={20} />}
            </View>
          }
          iconSize={12}
        />
      )
    }

    const renderSectionHeader = (props) => {
      const { section } = props
      return (
        <Text weight="bold" style={$sectionHeader}>
          {section.date}
        </Text>
      )
    }

    return (
      <>
        <Header title="Company A" leftIcon="back" onLeftPress={handleBack} />

        <SectionList
          sections={sortedList}
          renderItem={(props) => renderItem(props)}
          renderSectionHeader={(props) => renderSectionHeader(props)}
          keyExtractor={(index)=> index.toString()}
        />
        <View style={{ height: 20 }} />
      </>
    )
  },
)

const $container: ViewStyle = {
  paddingHorizontal: 20,
  backgroundColor: colors.palette.neutral100,
}

const $sectionHeader: ViewStyle = {
  paddingHorizontal: 20,
  paddingVertical: 10,
}

const $rightItem: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  alignSelf: "center",
}

const $amountText: TextStyle = {
  marginRight: 5,
}
