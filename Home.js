import React, { useState, useEffect } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  Image,
  View,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  TextInput,
  Button,
} from "react-native";
import {
  MFPaymentRequest,
  MFCustomerAddress,
  MFExecutePaymentRequest,
  MFCardInfo,
  Response,
  MFSendPaymentRequest,
  MFLanguage,
  MFNotificationOption,
  MFPaymentype,
  MFMobileCountryCodeISO,
  MFCurrencyISO,
  MFPaymentStatusRequest,
  MFKeyType,
  MFInitiatePayment,
  MFSupplier,
} from "myfatoorah-reactnative";
//import { hide } from 'expo/build/launch/SplashScreen';

const instructions = Platform.select({
  ios: "Press Cmd+R to reload,\n" + "Cmd+D or shake for dev menu",
  android:
    "Double tap R on your keyboard to reload,\n" +
    "Shake or press menu button for dev menu",
});
export default function Home({ navigation }) {
  //region USES_TATE HOOLKS
  const [loading, setLoading] = useState(false);
  const [recurringId, setRecurringId] = useState("");
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [invoiceValue, setInvoiceValue] = useState("5");
  const [cardNumber, setCardNumber] = useState("5123450000000008");
  const [cardHolderName, setCardHolderName] = useState("John Smith");
  const [month, setMonth] = useState("05");
  const [year, setYear] = useState("21");
  const [cvv, setCVV] = useState("100");
  const [isDirectPayment, setIsDirectPayment] = useState(false);
  //endregion

  //region USE_EFFECT HOOKS
  useEffect(() => {
    initiatePayments();
  }, []);
  //endregion

  //region HANDLERS
  const onExecutePaymentButtonClickHandler = () => {
    if (paymentMethods[selectedIndex].IsDirectPayment) {
      executePayment();
    } else {
      executePayment();
    }
  };

  const onExecuteDirectPaymentButtonClickHandler = () => {
    executeDirectPayment();
  };

  //endregion

  //region render
  return (
    <View style={styles.container}>
      {loading && (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color="balck" />
        </View>
      )}
      <View style={[styles.welcome, { marginBottom: 0, flexDirection: "row" }]}>
        <Text
          style={[
            styles.instructions,
            { fontWeight: "800", fontSize: 15, width: "100%" },
          ]}
        >
          Please Enter Payment Amount:
        </Text>
      </View>

      <View style={{ margin: 10, marginTop: 0, flexDirection: "row" }}>
        <TextInput
          style={[
            {
              height: 40,
              width: "100%",
              textAlign: "center",
              fontSize: 15,
              fontWeight: "500",
            },
            styles.normalTextInputStyle,
          ]}
          placeholder="Invoice value"
          onChangeText={(text) => setInvoiceValue(text)}
          defaultValue={"5"}
          keyboardType="decimal-pad"
        />
      </View>

      <View style={[styles.welcome, { marginBottom: 0, flexDirection: "row" }]}>
        <Text
          style={[
            styles.instructions,
            { fontWeight: "800", fontSize: 15, width: "100%" },
          ]}
        >
          Please Select Payment Method:
        </Text>
      </View>

      {paymentMethodsList()}

      {creditCardView()}

      {payButton()}
    </View>
  );
  //endregion

  //region RENDER METHODS
  function payButton() {
    return selectedIndex == -1 ? (
      <TouchableOpacity
        disabled
        style={[styles.disabledButtonStyle, { width: "70%" }]}
        onPress={onExecutePaymentButtonClickHandler}
        underlayColor="#fff"
      >
        <Text style={[styles.buttonText, { fontSize: 18, fontWeight: "500" }]}>
          Pay
        </Text>
      </TouchableOpacity>
    ) : (
      <TouchableOpacity
        style={[styles.buttonStyle, { width: "70%" }]}
        onPress={onExecutePaymentButtonClickHandler}
        underlayColor="#fff"
      >
        <Text style={[styles.buttonText, { fontSize: 18, fontWeight: "500" }]}>
          Pay
        </Text>
      </TouchableOpacity>
    );
  }
  function creditCardView() {
    return (
      isDirectPayment && (
        <View
          style={{
            margin: 0,
            marginTop: 0,
            flexDirection: "column",
            padding: 10,
            justifyContent: "space-evenly",
            width: "100%",
          }}
        >
          <TextInput
            style={[
              { height: 40, width: "100%", padding: 5 },
              styles.textInputStyle,
            ]}
            placeholder="Card number"
            onChangeText={(text) => setCardNumber(text)}
            defaultValue={cardNumber}
            keyboardType="number-pad"
          />
          <TextInput
            style={[
              { height: 40, width: "100%", padding: 5 },
              styles.textInputStyle,
            ]}
            placeholder="Card holder name"
            onChangeText={(text) => setCardHolderName(text)}
            defaultValue={cardHolderName}
            keyboardType="default"
          />

          <View style={{ flexDirection: "row" }}>
            <TextInput
              style={[{ height: 40, width: "50%" }, styles.textInputStyle]}
              placeholder="Month"
              onChangeText={(text) => setMonth(text)}
              defaultValue={month}
              keyboardType="number-pad"
            />
            <TextInput
              style={[{ height: 40, width: "50%" }, styles.textInputStyle]}
              placeholder="Year"
              onChangeText={(text) => setYear(text)}
              defaultValue={year}
              keyboardType="number-pad"
            />
          </View>
          <TextInput
            style={[{ height: 40, width: "100%" }, styles.textInputStyle]}
            placeholder="CVV"
            onChangeText={(text) => setCVV(text)}
            defaultValue={cvv}
            keyboardType="number-pad"
          />
        </View>
      )
    );
  }
  function paymentMethodsList() {
    return (
      <View style={styles.welcome}>
        <FlatList
          horizontal
          data={paymentMethods}
          style={styles.flatList}
          contentContainerStyle={{ justifyContent: "center" }}
          renderItem={({ item: rowData, index: row }) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  setSelectedIndex(row);
                  if (rowData.IsDirectPayment) {
                    setIsDirectPayment(true);
                  } else {
                    setIsDirectPayment(false);
                  }
                }}
                style={{ padding: 10 }} // adjust the styles to suit your needs
              >
                <View style={styles.container}>
                  {selectedIndex == row ? (
                    <Image
                      style={[
                        BackdropStyles.image,
                        {
                          borderColor: "black",
                          borderWidth: 3,
                          borderRadius: 5,
                        },
                      ]}
                      source={{ uri: rowData.ImageUrl }}
                    />
                  ) : (
                    <Image
                      style={BackdropStyles.image}
                      source={{ uri: rowData.ImageUrl }}
                    />
                  )}

                  <Text style={styles.welcome}>{rowData.PaymentMethodEn}</Text>
                </View>
              </TouchableOpacity>
            );
          }}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    );
  }
  //endregion

  //region HELPER METHODS
  function showLoading() {
    setLoading(true);
  }
  function hideLoading() {
    setLoading(false);
  }

  function executeResquestJson() {
    const request = new MFExecutePaymentRequest(
      parseFloat(invoiceValue),
      paymentMethods[selectedIndex].PaymentMethodId
    );
    request.customerEmail = "a@b.com"; // must be email
    request.customerMobile = "";
    request.customerCivilId = "";
    const address = new MFCustomerAddress("ddd", "sss", "sss", "sss", "sss");
    request.customerAddress = address;
    request.customerReference = "";
    request.language = "en";
    request.mobileCountryCode = MFMobileCountryCodeISO.KUWAIT;
    request.displayCurrencyIso = MFCurrencyISO.KUWAIT_KWD;
    // var productList = []
    // var product = new MFProduct("ABC", 1.887, 1)
    // productList.push(product)
    // request.invoiceItems = productList
    return request;
  }

  function initiatePayments() {
    const initiateRequest = new MFInitiatePayment(50, MFCurrencyISO.KUWAIT_KWD);
    MFPaymentRequest.sharedInstance.initiatePayment(
      initiateRequest,
      MFLanguage.ENGLISH,
      (response) => {
        if (response.getError()) {
          alert("error: " + response.getError().error);
        } else {
          setPaymentMethods(response.getPaymentMethods());
        }
      }
    );
  }

  function executePayment() {
    const request = executeResquestJson();
    showLoading();
    MFPaymentRequest.sharedInstance.executePayment(
      navigation,
      request,
      MFLanguage.ENGLISH,
      (response) => {
        hideLoading();
        if (response.getError()) {
          alert("error: " + response.getError().error);
        } else {
          const bodyString = response.getBodyString();
          const invoiceId = response.getInvoiceId();
          const paymentStatusResponse = response.getBodyJson().Data;
          alert(
            "success with Invoice Id: " +
              invoiceId +
              ", Invoice status: " +
              paymentStatusResponse.InvoiceStatus
          );
          console.log(response);
        }
      }
    );
  }

  function getPaymentStatus() {
    const paymentStatusRequest = new MFPaymentStatusRequest(
      "111111",
      MFKeyType.PAYMENTID
    );
    MFPaymentRequest.sharedInstance.getPaymentStatus(
      paymentStatusRequest,
      MFLanguage.ENGLISH,
      (response) => {
        if (response.getError()) {
          <View>
            <Text>"error: " {+response.getError().error}</Text>
          </View>;
        } else {
          response.getBodyString();
          const paymentStatusResponse =
            response.getBodyJson().getPaymentStatusResponse;
          const invoiceId = paymentStatusResponse.InvoiceId;
          <View>
            <Text>
                {`success with Invoice Id: ` +
                    invoiceId +
                    `, Invoice status:`  +
                    paymentStatusResponse.InvoiceStatus}
            </Text>
          </View>;
        }
        console.log(response);
      }
    );
  }
  //endregion 4508750015741019
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    alignItems: "center",
    backgroundColor: "#F5FCFF",
    padding: 0,
  },
  welcome: {
    fontSize: 20,
    textAlign: "center",
    margin: 10,
  },
  instructions: {
    alignSelf: "stretch",
    textAlign: "left",
    color: "#333333",
    marginBottom: 5,
  },
  loading: {
    margin: 10,
    opacity: 1,
    backgroundColor: null,
  },
  flatList: {
    height: 110,
    flexGrow: 0,
  },
  disabledButtonStyle: {
    marginRight: 40,
    marginLeft: 40,
    marginTop: 10,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: "lightgray",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#fff",
  },
  buttonStyle: {
    marginRight: 40,
    marginLeft: 40,
    marginTop: 10,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: "#1E6738",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#fff",
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    paddingLeft: 10,
    paddingRight: 10,
  },
  textInputStyle: {
    borderColor: "lightgray",
    borderBottomWidth: 1,
    borderRadius: 5,
  },
  normalTextInputStyle: {
    borderColor: "lightgray",
    borderWidth: 1,
    borderRadius: 5,
  },
});
const BackdropStyles = {
  container: {
    flex: 1,
  },
  image: {
    width: 50,
    height: 50,
    resizeMode: "contain",
  },
};
