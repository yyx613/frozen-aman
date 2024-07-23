import React, { FC, useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import {
  Alert,
  TextInput,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
  ScrollView,
  FlatList,
} from "react-native"

import { AppStackScreenProps } from "app/navigators"
import { BottomModal, Button, Header, Icon, ListItem, ProductCard, Text } from "app/components"
import { QuantityModal } from "app/components/organisms"

import { colors, typography } from "app/theme"
import { algorithm } from "app/utils/algorithm"
import { ProductDetailsProps } from "app/constants"
import { useStores } from "../../models"

const IceCubeImage = require("../../../assets/images/bread.png")

interface StockTransferProps extends AppStackScreenProps<"StockTransfer"> {}

export const StockTransferScreen: FC<StockTransferProps> = observer(function StockTransferScreen(
  _props, // @demo remove-current-line
) {
  const { bottom } = useSafeAreaInsets()
  const { navigation } = _props
  const {
    stockStore: { cart, updateStockCart, selectedDriver, updateSelectedDriver, loadStocks, stocks },
    driverStore,
  } = useStores()
  const [isDriverModalVisible, setIsDriverModalVisible] = useState(false)
  const [isQuantityModalVisible, setIsQuantityModalVisible] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<ProductDetailsProps>({
    name: "",
    price: 0,
    quantity: 0,
    cart: 0,
    product_id: 0,
  })
  const [productStocks, setProductStocks] = useState({})
  const [searchText, setSearchText] = useState("")

  useEffect(() => {
    ;(async () => {
      await driverStore.loadDrivers()
    })()
  }, [])

  function handleProductPress(product) {
    const productCart = cart.find((item) => item.product_id === product.product_id)
    setIsQuantityModalVisible(true)
    setSelectedProduct({ ...product, cart: productCart?.cart ?? 0 })
  }

  function handleGoBack() {
    navigation.goBack()
  }

  function handleCloseDriverModal() {
    setIsDriverModalVisible(false)
  }

  function handleAdd() {
    const { cart, quantity } = selectedProduct
    if (cart < quantity) {
      setSelectedProduct({ ...selectedProduct, cart: cart + 1 })
    }
  }

  function handleMinus() {
    const { cart } = selectedProduct
    if (cart > 0) {
      setSelectedProduct({ ...selectedProduct, cart: cart - 1 })
    }
  }

  function handleProductQuantityChange(text) {
    let cart
    if (!text || selectedProduct.quantity < parseInt(text)) {
      cart = 0
    } else {
      cart = parseInt(text)
    }
    setSelectedProduct({ ...selectedProduct, cart })
  }

  function handleAddToBasket() {
    // eslint-disable-next-line camelcase
    const { quantity, cart, product_id } = selectedProduct
    updateStockCart(selectedProduct)
    // eslint-disable-next-line camelcase
    setProductStocks({ ...productStocks, [product_id]: quantity - cart })
    setIsQuantityModalVisible(false)
  }

  function getRemainingStocks(): string {
    const { cart, quantity } = selectedProduct
    const remaining = quantity - cart
    return remaining?.toString()
  }

  function handleCloseQuantityModal() {
    setIsQuantityModalVisible(false)
  }

  function handleOpenDriverModal() {
    setIsDriverModalVisible(true)
  }

  function handleSelectDriver(item) {
    setIsDriverModalVisible(false)
    updateSelectedDriver(item)
  }

  function getTotalItem() {
    return cart.reduce((total, product) => total + product.cart, 0)
  }

  function handleSearchTextChange(text) {
    setSearchText(text)
  }

  async function handleRefresh() {
    await driverStore.loadDrivers()
  }

  function handleConfirm() {
    if (!selectedDriver) {
      return Alert.alert("Please select driver")
    }
    if (cart.length === 0) {
      return Alert.alert("Please add item to the cart")
    }
    navigation.push("StockTransferConfirmation")
  }

  return (
    <>
      <View style={{ flex: 1 }}>
        <Header title="Stock Transfer" leftIcon="back" onLeftPress={handleGoBack} />
        <ListItem
          text={selectedDriver ? selectedDriver.name : "Select Driver"}
          style={$dropDownContainer}
          rightIcon="down"
          rightIconColor={colors.palette.primary500}
          leftIcon="deliveryStatus"
          leftIconColor={colors.palette.primary500}
          iconSize={20}
          height={40}
          onPress={handleOpenDriverModal}
        />
        <ScrollView showsVerticalScrollIndicator={false}>
          {algorithm?.toMatrix(stocks, 2).map((row) => (
            <View style={$rowView} key={row.key}>
              {row.value.map((product) => (
                <ProductCard
                  key={product.product_id}
                  image={IceCubeImage}
                  tittle={product.name}
                  subtitle={`${productStocks[product.product_id] ?? product.quantity} unit`}
                  onPress={() => handleProductPress(product)}
                />
              ))}
            </View>
          ))}
          <View style={{ height: bottom + 100 }} />
        </ScrollView>

        <BottomModal isVisible={isDriverModalVisible} onCancel={handleCloseDriverModal}>
          <TouchableOpacity style={$searchContainer}>
            <Icon icon="search" size={20} />
            <TextInput
              placeholder="Search"
              style={$textInput}
              onChangeText={handleSearchTextChange}
              placeholderTextColor={colors.text}
            />
          </TouchableOpacity>

          <FlatList
            refreshing={driverStore.isLoading}
            onRefresh={handleRefresh}
            data={driverStore.filterDriverByName(searchText)}
            renderItem={({ item }) => (
              <ListItem
                key={item.driver_id}
                text={item.name}
                textStyle={$listText}
                height={40}
                bottomSeparator
                style={$listView}
                onPress={() => handleSelectDriver(item)}
              />
            )}
          />
        </BottomModal>

        <QuantityModal
          isVisble={isQuantityModalVisible}
          quantity={selectedProduct.cart?.toString()}
          title={selectedProduct.name}
          onAdd={() => handleAdd()}
          onMinus={() => handleMinus()}
          onChangeText={(text) => handleProductQuantityChange(text)}
          onConfirm={() => handleAddToBasket()}
          onCancel={() => handleCloseQuantityModal()}
          remaining={getRemainingStocks()}
        />
      </View>

      <Button
        onPress={handleConfirm}
        preset={"filled"}
        style={{ ...$addToBasketButton, bottom }}
        LeftAccessory={(props) => (
          <Text style={{ ...$buttonText, ...props.style }} weight={"bold"}>
            Transfer Stocks
          </Text>
        )}
        RightAccessory={(props) => (
          <Text
            style={{ ...$buttonText, ...props.style }}
            weight={"bold"}
          >{`${getTotalItem()} Items`}</Text>
        )}
      />
    </>
  )
})

const $dropDownContainer: ViewStyle = {
  backgroundColor: colors.palette.neutral100,
  borderRadius: 10,
  padding: 5,
  paddingHorizontal: 10,
  marginHorizontal: 20,
}
const $rowView: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  padding: 20,
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

const $addToBasketButton: ViewStyle = {
  borderRadius: 30,
  justifyContent: "space-around",
  width: 300,
  alignSelf: "center",
}

const $buttonText: TextStyle = {
  color: colors.palette.neutral100,
}
