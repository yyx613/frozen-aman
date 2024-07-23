import React, { FC, useEffect, useState } from "react"
import { View, ViewStyle, Alert, ScrollView } from "react-native"
import { AppStackScreenProps } from "../../navigators"
import { observer } from "mobx-react-lite"
import { Button, Header, Loading, ProductCard, QuantityModal, Screen, Text } from "../../components"
import { colors } from "../../theme"
import { algorithm } from "app/utils"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useStores } from "../../models"

const IceCubeImage = require("../../../assets/images/bread.png")

interface WastageSelectionProps extends AppStackScreenProps<"WastageSelection"> {}

export type ProductDetailsProps = {
  product_id: number
  name: string
  quantity: number
  cart?: number
}

export const WastageSelectionScreen: FC<WastageSelectionProps> = observer(
  function WastageSelectionScreen(
    _props, // @demo remove-current-line
  ) {
    const { bottom } = useSafeAreaInsets()
    const { navigation } = _props
    const { stockStore, tripStore } = useStores()
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [productStocks, setProductStocks] = useState({})
    const [selectedProduct, setSelectedProduct] = useState<ProductDetailsProps>({
      name: "",
      cart: 0,
      quantity: 0,
      product_id: 0,
    })

    useEffect(() => {
      ;(async () => {
        await handleLoadStocks()
      })()
    }, [])

    async function handleLoadStocks() {
      const response = await stockStore.loadStocks()
      if (response.kind === "pendingOrderError") {
        Alert.alert(
          "Pending Orders Subimssion",
          "Please submit all your pending orders before end trip.",
          [{ text: "OK", onPress: () => navigation.push("PendingOrder") }],
        )
      }
    }

    function handleCloseModal() {
      setIsModalVisible(false)
    }

    function handleSelectProduct(product) {
      const productCart = tripStore.wastage.find((item) => item.name === product.name)
      setIsModalVisible(true)
      setSelectedProduct({
        ...product,
        cart: productCart?.cart ?? 0,
      })
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
      const { quantity, cart, product_id } = selectedProduct
      tripStore.updateWastageCart(selectedProduct)
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
      navigation.push("WastageConfirmation")
    }

    return (
      <>
        <View style={{ flex: 1 }}>
          <Header title={"Select Wastage"} leftIcon={"back"} onLeftPress={handleBack} />
          <ScrollView showsVerticalScrollIndicator={false}>
            {algorithm.toMatrix(stockStore.stocks, 2).map((row) => (
              <View key={row.key} style={$productListContainer}>
                {row.value.map((product) => (
                  <ProductCard
                    key={product.product_id}
                    image={IceCubeImage}
                    tittle={product.name}
                    subtitle={`${productStocks[product.product_id] ?? product.quantity} unit`}
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
            remaining={getRemainingStocks()}
          />
          {!!stockStore.isLoading && <Loading preset={"fullscreen"} />}
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
              text="Wastage"
              style={{ color: colors.palette.neutral100, ...props.style }}
              weight={"bold"}
            />
          )}
          RightAccessory={(props) => (
            <Text
              style={{ color: colors.palette.neutral100, ...props.style }}
              weight={"bold"}
            >{`${tripStore.getTotalWastage()} items`}</Text>
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
  height: 10,
  borderRadius: 30,
  justifyContent: "space-around",
  width: 300,
  alignSelf: "center",
}
