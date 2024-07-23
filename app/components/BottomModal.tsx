import React, { ReactNode } from "react"
import { TextStyle, TouchableOpacity, useWindowDimensions, View, ViewStyle } from "react-native"
import Modal from 'react-native-modal';
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { Text } from "./Text"
import { colors } from "../theme"

export interface BottomModalProps {
  preset?: 'fullScreen' | 'mini',
  isVisible: boolean,
  children: ReactNode,
  testID?: string,
  avoidKeyboard?: boolean,
  onCancel: () => void,
  onConfirm?: () => void,
  onModalHide?: ()=> void,
}
export function BottomModal(props: BottomModalProps){
  const {
    preset ='fullScreen',
    isVisible,
    testID,
    onCancel,
    onConfirm,
    onModalHide,
    avoidKeyboard= true,
    children,
    ...modalOptions
  }= props
  const { height } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  function renderButton(){
    return (
      <>
        <View style={$divider} />
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' , paddingHorizontal: 10}}>
          <TouchableOpacity onPress={onCancel} 	testID={`${testID}-cancel`}>
            <Text size={'md'} weight={'semiBold'} style={$cancelText}>Cancel</Text>
          </TouchableOpacity>
          {onConfirm && (
            <TouchableOpacity onPress={onConfirm} testID={`${testID}-confirm`}>
              <Text size={'md'} weight={'semiBold'} style={$confirmTex}>Confirm</Text>
            </TouchableOpacity>
          )}
        </View>
      </>
    );
  }

  return(
    <Modal
      avoidKeyboard={avoidKeyboard}
      isVisible={isVisible}
      animationIn={'slideInUp'}
      animationOut={'slideOutDown'}
      onBackdropPress={onCancel}
      onModalHide={onModalHide}
      style={$modalContainer}
      {...modalOptions}
    >
      {preset==='fullScreen' && (
        <View style={{ height: insets.top, backgroundColor: 'transparent' }} />
      )}
      <View
        style={{
          ...$container,
          flex: preset==='fullScreen' ? 1 : 0,
          paddingBottom: insets.bottom,
          maxHeight: height - insets.top,
        }}
      >
        <View style={{ flex: preset==='fullScreen' ? 1 : 0 }}>{children}</View>
        {renderButton()}
      </View>
    </Modal>
  )

}

const $modalContainer: ViewStyle={
  margin: 0,
  justifyContent: 'flex-end',
}

const $container : ViewStyle={
  flex: 1,
  backgroundColor: colors.palette.neutral100,
  borderTopLeftRadius: 10,
  borderTopRightRadius: 10,
  overflow: 'hidden',
}

const $divider: ViewStyle={
  borderTopWidth: 1,
  borderTopColor: colors.border,
}


const $cancelText: TextStyle={
  fontSize: 15,
}

const $confirmTex: TextStyle={
  fontSize: 15,
  color: colors.palette.primary500,
}
