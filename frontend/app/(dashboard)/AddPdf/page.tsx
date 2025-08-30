import { Stack } from 'expo-router'
import React from 'react'
import { Text, View } from 'react-native'

const AddImageScreen = () => {
  return (
    <View>
      <Stack.Screen
        options={{
          headerShown: true,
          animation: "slide_from_right",
          headerStyle: {
            backgroundColor: "black",
          },
          headerTitleStyle: {
            color: "white",
            fontFamily: "Inter_500Medium",
            fontSize: 19,
            fontWeight: "500",
          },
          headerTintColor: "white",
          title: "PDF",
        }}
      />
      <Text>
        hello
      </Text>
    </View>
  )
}

export default AddImageScreen