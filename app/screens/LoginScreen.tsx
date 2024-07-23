import { observer } from "mobx-react-lite"
import React, { FC, useEffect, useMemo, useRef, useState } from "react"
import { Image, ImageStyle, TextInput, TextStyle, View, ViewStyle } from "react-native"
import { Button, Icon, Screen, Text, TextField, TextFieldAccessoryProps } from "../components"
import { useStores } from "../models"
import { AppStackScreenProps } from "../navigators"
import { colors, spacing } from "../theme"

const HomeBg = require("assets/images/home-bg.png")

interface LoginScreenProps extends AppStackScreenProps<"Login"> {}

export const LoginScreen: FC<LoginScreenProps> = observer(function LoginScreen(_props) {
  const authPasswordInput = useRef<TextInput>()
  const [isAuthPasswordHidden, setIsAuthPasswordHidden] = useState(true)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [attemptsCount, setAttemptsCount] = useState(0)
  const {
    authenticationStore: {
      validationError,
      username,
      password,
      setUsername,
      setPassword,
      login,
    },
  } = useStores()

  useEffect(() => {
    // Here is where you could fetch credentials from keychain or storage
    // and pre-fill the form fields.
  }, [])

  const error = isSubmitted ? validationError : ""

  async function handleLogin() {
    setIsSubmitted(true)
    setAttemptsCount(attemptsCount + 1)

    if (validationError) return


    // Make a request to your server to get an authentication token.
    // If successful, reset the fields and set the token.
    await login()
    setIsSubmitted(false)

    // We'll mock this with a fake token.
  }

  const PasswordRightAccessory = useMemo(
    () =>
      function PasswordRightAccessory(props: TextFieldAccessoryProps) {
        return (
          <Icon
            icon={isAuthPasswordHidden ? "view" : "hidden"}
            color={colors.palette.neutral800}
            containerStyle={props.style}
            size={20}
            onPress={() => setIsAuthPasswordHidden(!isAuthPasswordHidden)}
          />
        )
      },
    [isAuthPasswordHidden],
  )

  return (
    <Screen preset="auto" contentContainerStyle={$screenContentContainer}>
      <Image source={HomeBg} style={$homeBg} />
      <View style={$container}>
        <Text testID="login-heading" tx="loginScreen.signIn" preset="subheading" style={$signIn} />
        <Text text="Please login to use the platform" preset="formLabel" style={$enterDetails} />
        {attemptsCount > 2 && <Text tx="loginScreen.hint" size="sm" weight="light" style={$hint} />}

        <TextField
          value={username}
          onChangeText={setUsername}
          containerStyle={$textField}
          inputWrapperStyle={$textInput}
          autoCapitalize="none"
          autoCorrect={false}
          placeholder="Username"
          onSubmitEditing={() => authPasswordInput.current?.focus()}
          LeftAccessory={(props) => (
            <Icon icon="user" style={props.style} size={25} color={colors.palette.secondary300} />
          )}
        />

        <TextField
          ref={authPasswordInput}
          value={password}
          onChangeText={setPassword}
          containerStyle={$textField}
          inputWrapperStyle={$textInput}
          autoCapitalize="none"
          autoComplete="password"
          autoCorrect={false}
          secureTextEntry={isAuthPasswordHidden}
          placeholder="Password"
          helper={error}
          status={error ? "error" : undefined}
          LeftAccessory={(props) => (
            <Icon
              icon="password"
              style={props.style}
              size={25}
              color={colors.palette.secondary300}
            />
          )}
          RightAccessory={PasswordRightAccessory}
        />

        <Button
          testID="login-button"
          text={"Sign in"}
          style={$tapButton}
          preset="filled"
          onPress={handleLogin}
        />
      </View>
    </Screen>
  )
})

const $screenContentContainer: ViewStyle = {
  flex: 1,
}

const $signIn: TextStyle = {
  marginBottom: spacing.sm,
  color: colors.palette.neutral100,
  textAlign: "center",
}

const $enterDetails: TextStyle = {
  marginBottom: spacing.lg,
  textAlign: "center",
  color: colors.palette.neutral100,
}

const $hint: TextStyle = {
  color: colors.tint,
  marginBottom: spacing.md,
}

const $textField: ViewStyle = {
  marginBottom: spacing.lg,
  alignItems: "center",
  justifyContent: "center",
  borderRadius: 20,
}

const $textInput: ViewStyle = {
  paddingVertical: spacing.xxs,
  paddingHorizontal: spacing.sm,
  borderRadius: 30,
}

const $tapButton: ViewStyle = {
  marginTop: spacing.xs,
  borderRadius: 30,
}

const $homeBg: ImageStyle = {
  position: "absolute",
  width: "100%",
  height: "100%",
  resizeMode: "cover",
}

const $container: ViewStyle = {
  paddingVertical: spacing.xxl,
  paddingHorizontal: spacing.lg,
  justifyContent: "center",
  flex: 1,
}

// @demo remove-file
