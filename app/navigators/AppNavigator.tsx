/**
 * The app navigator (formerly "AppNavigator" and "MainNavigator") is used for the primary
 * navigation flows of your app.
 * Generally speaking, it will contain an auth flow (registration, login, forgot password)
 * and a "main" flow which the user will use once logged in.
 */
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
  NavigatorScreenParams, // @demo remove-current-line
} from "@react-navigation/native"
import { createNativeStackNavigator, NativeStackScreenProps } from "@react-navigation/native-stack"
import { observer } from "mobx-react-lite"
import React from "react"
import { useColorScheme } from "react-native"
import * as Screens from "app/screens"
import Config from "../config"
import { useStores } from "../models" // @demo remove-current-line
import { DemoNavigator, DemoTabParamList } from "./DemoNavigator" // @demo remove-current-line
import { navigationRef, useBackButtonHandler } from "./navigationUtilities"
import { colors } from "app/theme"
import { MainNavigator, MainTabParamList } from "./MainNavigator"

/**
 * This type allows TypeScript to know what routes are defined in this navigator
 * as well as what properties (if any) they might take when navigating to them.
 *
 * If no params are allowed, pass through `undefined`. Generally speaking, we
 * recommend using your MobX-State-Tree store(s) to keep application state
 * rather than passing state through navigation params.
 *
 * For more information, see this documentation:
 *   https://reactnavigation.org/docs/params/
 *   https://reactnavigation.org/docs/typescript#type-checking-the-navigator
 *   https://reactnavigation.org/docs/typescript/#organizing-types
 */
export type AppStackParamList = {
  Welcome: undefined
  Login: undefined // @demo remove-current-line
  Demo: NavigatorScreenParams<DemoTabParamList> // @demo remove-current-line
  // 🔥 Your screens go here
  // IGNITE_GENERATOR_ANCHOR_APP_STACK_PARAM_LIST
  ProductSelection: undefined
  OrderConfirmation: undefined
  OrderAcknowledgement: { response: { kind: string; message: string } }
  OrderReceipt: undefined
  WastageSelection: undefined
  WastageConfirmation: undefined
  CustomerInfo: { taskId: number }
  Main: NavigatorScreenParams<MainTabParamList>
  TaskTransfer: undefined
  DriverSelection: undefined
  CustomerSelection: undefined
  ConfirmationTaskTransfer: undefined
  TaskTransferDetails: { id: number }
  TaskTransferAcknowledgement: { response: { kind: string; message: string } }
  Inventory: undefined
  StockTransfer: undefined
  StockTransferConfirmation: undefined
  StockTransferAcknowledgement: { response: { kind: string; message: string } }
  StockTransferTaskDetails: { id: number; type: string; status: number }
  ActivityLogTab: undefined
  StockTransferHistory: undefined
  StockTransferHistoryTab: undefined
  InventoryHistory: undefined
  CreditCustomerList: undefined
  CustomerDetails: { customerId: string }
  PayCredit: { customerId: number; credit: number }
  PayCreditAcknowledgement: { response: { kind: string; message: string } }
  CreditCustomerHistory: { customerId: number }
  DriverInfoInput: undefined
  InvoicePreview: { invoiceId: number; customerId: number; amount: number }
  InvoiceReceipt: { amount: number }
  EndTripSummary: undefined
  PendingOrder: undefined
  ReturnSelection: undefined,
  ReturnConfirmation: undefined,
  ReturnAcknowledgement: { response: { kind: string; message: string } },
  ReturnReceipt: undefined
}

/**
 * This is a list of all the route names that will exit the app if the back button
 * is pressed while in that screen. Only affects Android.
 */
const exitRoutes = Config.exitRoutes

export type AppStackScreenProps<T extends keyof AppStackParamList> = NativeStackScreenProps<
  AppStackParamList,
  T
>

// Documentation: https://reactnavigation.org/docs/stack-navigator/
const Stack = createNativeStackNavigator<AppStackParamList>()

const AppStack = observer(function AppStack() {
  // @demo remove-block-start
  const {
    authenticationStore: { isAuthenticated },
  } = useStores()

  // @demo remove-block-end
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false, navigationBarColor: colors.background }}
      initialRouteName={isAuthenticated ? "Main" : "Login"} // @demo remove-current-line
    >
      {/* @demo remove-block-start */}
      {isAuthenticated ? (
        <>
          {/* @demo remove-block-end */}
          {/* <Stack.Screen name="Welcome" component={Screens.WelcomeScreen} /> */}
          {/* @demo remove-block-start */}
          <Stack.Screen name="Main" component={MainNavigator} />
          <Stack.Screen name={"ProductSelection"} component={Screens.ProductSelectionScreen} />
          <Stack.Screen name={"DriverInfoInput"} component={Screens.DriverInfoInputScreen} />
          <Stack.Screen name={"OrderConfirmation"} component={Screens.OrderConfirmationScreen} />
          <Stack.Screen
            name={"OrderAcknowledgement"}
            component={Screens.OrderAcknowledgementScreen}
          />
          <Stack.Screen name={"OrderReceipt"} component={Screens.OrderReceiptScreen} />
          <Stack.Screen name={"Demo"} component={DemoNavigator} />
          <Stack.Screen name={"TaskTransfer"} component={Screens.TaskList} />
          <Stack.Screen name={"DriverSelection"} component={Screens.DriverSelectionScreen} />
          <Stack.Screen name={"CustomerSelection"} component={Screens.CustomerSelectionScreen} />
          <Stack.Screen
            name={"TaskTransferAcknowledgement"}
            component={Screens.TaskTransferAcknowledgementScreen}
          />
          <Stack.Screen
            name={"TaskTransferDetails"}
            component={Screens.TaskTransferTaskDetailsScreen}
          />
          <Stack.Screen
            name={"ConfirmationTaskTransfer"}
            component={Screens.ConfirmationTaskTransferScreen}
          />
          <Stack.Screen name={"WastageSelection"} component={Screens.WastageSelectionScreen} />
          <Stack.Screen
            name={"WastageConfirmation"}
            component={Screens.WastageConfirmationScreen}
          />
          <Stack.Screen name={"CustomerInfo"} component={Screens.CustomerInfoScreen} />
          <Stack.Screen name={"Inventory"} component={Screens.InventoryScreen} />
          <Stack.Screen name={"StockTransferHistory"} component={Screens.StockTransferHistoryTab} />
          <Stack.Screen name={"StockTransfer"} component={Screens.StockTransferScreen} />
          <Stack.Screen
            name={"StockTransferConfirmation"}
            component={Screens.StockTransferConfirmationScreen}
          />
          <Stack.Screen
            name={"StockTransferAcknowledgement"}
            component={Screens.StockTransferAcknowledgementScreen}
          />
          <Stack.Screen
            name={"StockTransferTaskDetails"}
            component={Screens.StockTransferTaskDetailScreen}
          />
          <Stack.Screen name={"ActivityLogTab"} component={Screens.ActivityLogsTab} />
          <Stack.Screen name={"InventoryHistory"} component={Screens.InventoryHistoryScreen} />
          <Stack.Screen name={"CreditCustomerList"} component={Screens.CreditCustomerListScreen} />
          <Stack.Screen
            name={"CreditCustomerHistory"}
            component={Screens.CreditCustomerHistoryScreen}
          />
          <Stack.Screen name={"CustomerDetails"} component={Screens.CustomerDetailsScreen} />
          <Stack.Screen name={"PayCredit"} component={Screens.PayCreditScreen} />
          <Stack.Screen
            name={"PayCreditAcknowledgement"}
            component={Screens.PayCreditAcknowledgementScreen}
          />
          <Stack.Screen name={"InvoicePreview"} component={Screens.InvoicePreviewScreen} />
          <Stack.Screen name={"InvoiceReceipt"} component={Screens.InvoiceReceiptScreen} />
          <Stack.Screen name={"EndTripSummary"} component={Screens.EndTripSummaryScreen} />
          <Stack.Screen name={"PendingOrder"} component={Screens.PendingOrder} />
          <Stack.Screen name={"ReturnSelection"} component={Screens.ReturnSelectionScreen} />
          <Stack.Screen name={"ReturnConfirmation"} component={Screens.ReturnConfirmationScreen} />
          <Stack.Screen name={"ReturnAcknowledgement"} component={Screens.ReturnAcknowledgementScreen} />
          <Stack.Screen name={"ReturnReceipt"} component={Screens.ReturnReceiptScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="Login" component={Screens.LoginScreen} />
        </>
      )}
      {/* @demo remove-block-end */}
      {/** 🔥 Your screens go here */}
      {/* IGNITE_GENERATOR_ANCHOR_APP_STACK_SCREENS */}
    </Stack.Navigator>
  )
})

export interface NavigationProps
  extends Partial<React.ComponentProps<typeof NavigationContainer>> {}

export const AppNavigator = observer(function AppNavigator(props: NavigationProps) {
  const colorScheme = useColorScheme()

  useBackButtonHandler((routeName) => exitRoutes.includes(routeName))

  return (
    <NavigationContainer ref={navigationRef} theme={DefaultTheme} {...props}>
      <AppStack />
    </NavigationContainer>
  )
})
