import React, { FC, useEffect, useState } from "react"
import { Dimensions, FlatList, TextStyle, TouchableOpacity, View, ViewStyle } from "react-native"
import { AppStackScreenProps } from "app/navigators"
import { observer } from "mobx-react-lite"

import { Header, Icon, Screen, SearchBar, Tag, Text } from "app/components"
import { colors } from "app/theme"
import { useStores } from "../../models"

const { width } = Dimensions.get("screen")

interface CreditCustomerListProps extends AppStackScreenProps<"CreditCustomerList"> {}

export const CreditCustomerListScreen: FC<CreditCustomerListProps> = observer(
  function CreditCustomerListScreen(_props) {
    const { navigation } = _props
    const {
      creditNotesStore: { loadCustomers, isLoading, filterCustomerByName , getTotalCreditNote},
      productStore,
    } = useStores()

    const [searchText, setSearchText] = useState("")

    useEffect(() => {
      ;(async function load() {
        await loadCustomers()
        await productStore.loadProducts()
      })()
    }, [])

    async function handleRefresh() {
      await loadCustomers()
    }

    function handleGoBack() {
      navigation.goBack()
    }

    function handleSelectItem(customerId) {
      navigation.push("CustomerDetails", { customerId })
    }

    function handleTextChange(text) {
      setSearchText(text)
    }

    function renderCredit(credit) {
      if (credit === 0) return null
      return (
        <Tag
          title={credit.toFixed(2)}
          colorScheme={credit > 0 ? "error" : "warning"}
          TextProps={{ size: "xxs" }}
          style={$tag}
        />
      )
    }

    function renderItem(props) {
      const { item } = props
      return (
        <>
          <TouchableOpacity
            onPress={() => handleSelectItem(item.id)}
            key={item.id}
            style={$listItemView}
          >
            <View style={$companyName}>
              <Text size={"sm"} weight={"semiBold"} numberOfLines={1}>
                {item.company}
              </Text>
              {/* <Text size={"xxs"}>{item.paymentterm}</Text> */}
            </View>
            <View style={$tagIconContainer}>
              {renderCredit(item.credit)}
              <Icon icon="next" size={15} color={colors.palette.primary500} />
            </View>
          </TouchableOpacity>
        </>
      )
    }
    return (
      <Screen>
        <Header title={"Customer List"} leftIcon="back" onLeftPress={handleGoBack} />
        <SearchBar
          placeholder="Search Customer"
          onChangeText={(text) => {
            handleTextChange(text)
          }}
          viewStyle={{ marginBottom: 20 }}
        />
        <View style={$titleView}>
          <Text text="Company" weight="semiBold" style={$title} size="xs" />
          <Text text="Credit Note (RM)" weight="semiBold" style={$title} size="xs" />
        </View>
        <View style={$titleView}>
          <Text text="Total: " weight="semiBold" style={$title} size="xs" />
          <Text text={getTotalCreditNote()?.toFixed(2).toString()} weight="semiBold" style={$title} size="xs" />
        </View>

        <FlatList
          refreshing={isLoading}
          onRefresh={handleRefresh}
          data={filterCustomerByName(searchText)}
          renderItem={(props) => renderItem(props)}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={$listContainer}
          style={$flatList}
        />
      </Screen>
    )
  },
)

const $titleView: ViewStyle = {
  flexDirection: "row",
  paddingHorizontal: 20,
  justifyContent: "space-between",
  marginBottom: 20,
}

const $title: TextStyle = {
  color: colors.palette.secondary300,
}

const $flatList: ViewStyle = {
  height: "100%",
}

const $listItemView: ViewStyle = {
  flexDirection: "row",
  borderRadius: 10,
  backgroundColor: colors.palette.neutral100,
  width: width * 0.9,
  padding: 10,
  alignItems: "center",
  justifyContent: "space-between",
  marginVertical: 8,
  height: 55,
}

const $tagIconContainer: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
}

const $listContainer: ViewStyle = {
  paddingHorizontal: 20,
}

const $tag: ViewStyle = {
  borderRadius: 8,
  minWidth: 30,
}

const $companyName: ViewStyle = {
  flex: 1,
  paddingRight: 5,
}
