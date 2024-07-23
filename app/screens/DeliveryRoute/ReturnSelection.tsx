import React, { FC, useState } from "react"
import { Alert, View, ViewStyle, ScrollView } from "react-native"
import { AppStackScreenProps } from "../../navigators"
import { observer } from "mobx-react-lite"
import { Button, Header, ProductCard, QuantityModal, Text } from "../../components"
import { colors } from "../../theme"
import { ProductDetailsProps } from "./constant"
import { toMatrix } from "./utils"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useStores } from "../../models"

const IceCubeImage = require("../../../assets/images/bread.png")

interface ReturnSelectionProps extends AppStackScreenProps<"ReturnSelection"> {}

export const ReturnSelectionScreen: FC<ReturnSelectionProps> = observer(
  function ReturnSelectionScreen(
    _props, // @demo remove-current-line
  ) {
    const { bottom } = useSafeAreaInsets()
    const { navigation } = _props
    const {
      stockStore,
      orderStore: { updateReturnCart, returnCart, getReturnTotalPrice, getReturnTotalItem, selectedTask },
    } = useStores()
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [productStocks, setProductStocks] = useState({})
    const [selectedProduct, setSelectedProduct] = useState<ProductDetailsProps>({
      name: "",
      price: 0,
      cart: 0,
      quantity: 0,
      product_id: 0,
    })
    const totalPrice = getReturnTotalPrice().toFixed(2)

    function getProductPrice(id) {
      return selectedTask?.customer?.product.find((item) => item.id === id)?.price
    }

    function handleCloseModal() {
      setIsModalVisible(false)
    }

    function handleSelectProduct(product) {
      const productCart = returnCart.find((item) => item.name === product.name)
      setIsModalVisible(true)
      setSelectedProduct({
        ...product,
        cart: productCart?.cart ?? 0,
        price: getProductPrice(product.product_id),
      })
    }

    function handleAdd() {
      const { cart, quantity } = selectedProduct
      // if (cart < quantity) {
        setSelectedProduct({ ...selectedProduct, cart: cart + 1 })
      // }
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
      const { quantity, cart, product_id } = selectedProduct
      updateReturnCart(selectedProduct)
      setProductStocks({ ...productStocks, [product_id]: quantity - cart })
      setIsModalVisible(false)
    }

    function getRemainingStocks() {
      const { cart, quantity } = selectedProduct
      const remaining = quantity - cart
      return remaining?.toString()
    }

    function handleBack() {
      navigation.goBack()
    }

    function handleConfirm() {
      if (returnCart.length === 0) return Alert.alert("Cart is empty.")
      navigation.push("ReturnConfirmation")
    }

    return (
      <>
        <View style={{ flex: 1 }}>
          <Header title={"Select Return Products"} leftIcon={"back"} onLeftPress={handleBack} />

          <ScrollView showsVerticalScrollIndicator={false}>
            {toMatrix(stockStore.stocks, 2).map((row) => (
              <View key={row.key} style={$productListContainer}>
                {row.value.map((product) => (
                  <ProductCard
                    key={product.product_id}
                    image={IceCubeImage}
                    tittle={product.name}
                    subtitle={`RM ${getProductPrice(product.product_id)}`}
                    // value={`${productStocks[product.product_id] ?? product.quantity} unit`}
                    onPress={() => handleSelectProduct(product)}
                  />
                ))}
              </View>
            ))}
            <View style={{ height: bottom + 100 }} />
          </ScrollView>

          <QuantityModal
            isVisble={isModalVisible}
            title={selectedProduct.name}
            onCancel={handleCloseModal}
            onMinus={handleMinus}
            onAdd={handleAdd}
            onChangeText={handleProductQuantityChange}
            onConfirm={handleAddToBasket}
            quantity={selectedProduct.cart?.toString()}
            // remaining={getRemainingStocks()}
          />
        </View>
        <Button
          preset={"filled"}
          onPress={handleConfirm}
          style={{
            ...$button,
            bottom: bottom + 10,
          }}
          LeftAccessory={(props) => (
            <Text
              style={{ color: colors.palette.neutral100, ...props.style }}
              weight={"bold"}
            >{`Basket ${getReturnTotalItem()} items`}</Text>
          )}
          RightAccessory={(props) => (
            <Text
              style={{ color: colors.palette.neutral100, ...props.style }}
              weight={"bold"}
            >{`RM ${totalPrice}`}</Text>
          )}
        />
      </>
    )
  },
)

const $productListContainer: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  padding: 20,
}

const $button: ViewStyle = {
  borderRadius: 30,
  justifyContent: "space-around",
  width: 300,
  alignSelf: "center",
}
