
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity, FlatList, SafeAreaView, Alert } from 'react-native';
import CurrencyInput from 'react-native-currency-input';
import { mask, unMask } from 'remask'
import { Icon } from 'react-native-elements'

import XLSX from 'xlsx'
import * as FileSystem from 'expo-file-system';
import { Camera } from "expo-camera";
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';
import * as SQLite from 'expo-sqlite'

const db = SQLite.openDatabase("sqlteste")

const HomeScreen = (props) => {

  const [dados, setDados] = useState([
    {
      ID: "00101", valgli: "0", horgli: "00:00", datgli: "01/01/2020", obsgli: ""
    }
  ])

  const [valgli, setValgli] = useState(0.00);
  const [curdat, setCurDat] = useState("");
  const [curhor, setCurHor] = useState("");
  const [observ, setObserv] = useState("");

  const styles = StyleSheet.create({
    container: {
      height: "100%",
      backgroundColor: "#002947",
      width: "100%",
      paddingTop: 40,
      paddingLeft: 15,
      paddingRight: 15
    },
    btlogo: {
      width: "80%",
      marginLeft: "10%"

    },
    logo: {
      width: "100%",
      height: 85
    },
    divisoria: {
      width: "100%",
      marginTop: 5,
      marginBottom: 5,
      borderBottomColor: "#ff812e",
      borderWidth: 2
    },
    linha: {
      width: "100%",
      flexDirection: "row",
      marginLeft: "5%"
    },
    coluna: {
      width: "30%",
    },
    padtex: {
      width: "100%",
      textAlign: "center",
      color: "#FFFFFF",
      fontWeight: "bold"
    },
    inputStyle: {
      backgroundColor: "#FFFFFF",
      borderRadius: 5,
      borderWidth: 1,
      borderBottomColor: "#ff812e",
      borderLeftColor: "#ff812e",
      height: 35,
      lineHeight: 35,
      textAlign: "center",
      fontSize: 12,
      marginLeft: 5
    },
    btGravar: {
      backgroundColor: "#ff812e",
      borderRadius: 20,
      width: 80,

    },
    linhaList: {
      width: "100%",
      height: 45,
      backgroundColor: "#D1D1D1",
      //backgroundColor:"#EDE4E4",
      borderRadius: 5,
      marginTop: 5,
      paddingLeft: 15,
      opacity: 0.8,
      flexDirection: "row",
    },
    ValGli: {
      height: 45,
      lineHeight: 45,
      fontWeight: "bold",
      fontSize: 30,
      paddingRight: 10,
      borderRightColor: "#002947",
      borderRightWidth: 1,
      width: 75,
      textAlign: "center"
    },
    DatGli: {
      height: 45,
      lineHeight: 45,
      fontWeight: "bold",
      fontSize: 20,
      paddingRight: 10,
      borderRightColor: "#002947",
      color: "#002947",
      borderRightWidth: 1,
      width: 220,
      textAlign: "left",
      paddingLeft: 10
    },
    localIco: {
      height: 45,
      width: 30,
      marginLeft: 10,
      justifyContent: "center"
    },
    txtBt:
      { height: 40, color: "#002e48", width: "100%", lineHeight: 40, fontWeight: "bold", textAlign: "center" }


  })

  const cData = (dat, sepa = "-") => {
    // converte de YYYY-MM-DD para DD/MM/YYYY
    let arraux = dat.split(sepa)
    let sepnew = "/"
    let ret = dat;
    if (sepa === "/") {
      sepnew = "-"
    }
    ret = arraux[2] + sepnew + arraux[1] + sepnew + arraux[0];
    return ret
  }

  const iconedevapp = require("./../assets/logobranco.png");
  const deleteall = () => {
    db.transaction((tx) => {
      tx.executeSql(
        'delete FROM glic ',
        [],
        (tx, results) => {
          console.log("deletou")
          searchUser()
        },
      );
    });

  }


  const searchUser = () => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT *  FROM glic order by datetime(datgli || ' ' || horgli || ':00') desc",
        [],
        (tx, results) => {
          var len = results.rows.length;

          if (len > 0) {

            setDados(results.rows._array);

          } else {

            setDados([
              {
                ID: "00101", valgli: "0", horgli: "00:00", datgli: "2020-01-01", obsgli: ""
              }
            ])
          }
        },
      );
    });
  };

  const createTable = () => {
    db.transaction((tx) => {
      tx.executeSql("CREATE TABLE IF NOT EXISTS glic (ID	INTEGER NOT NULL,valgli	INTEGER NOT NULL,horgli	TEXT,datgli	TEXT NOT NULL,obsgli	INTEGER, PRIMARY KEY(ID AUTOINCREMENT))", [], () => { }, error => { Alert.alert("ERRO", "Erro ao criar lista") }
      )
    }
    )
  }

  const insertItem = async () => {
    if (valgli == "" || valgli == "0") {
      Alert.alert("ERRO", "Valor de glicemia inválido");
      return
    }
    if (curdat == "") {
      Alert.alert("ERRO", "Preencha o campo data");
      return
    }
    if (curhor == "") {
      Alert.alert("ERRO", "Preencha o campo Hora");
      return
    }

    let newdat = cData(curdat, "/");


    db.transaction(function (tx) {
      tx.executeSql(
        'INSERT INTO glic (valgli,horgli,datgli ,obsgli) VALUES (?,?,?,?)',
        [valgli, curhor, newdat, observ],
        (tx, results) => {

          if (results.rowsAffected > 0) {
            getCurrentDate()
          } else alert('Registration Failed');
        },
      );
    });

  }

  const getCurrentDate = () => {
    var dd = new Date();
    var date = dd.getDate();
    var month = dd.getMonth() + 1;
    var year = dd.getFullYear();
    var hour = dd.getHours();
    var min = dd.getMinutes();
    if (date < 10) {
      date = "0" + date;
    }
    if (month < 10) {
      month = "0" + month;
    }
    if (hour < 10) {
      hour = "0" + hour;
    }
    if (min < 10) {
      min = "0" + min;
    }

    //Alert.alert(date + '-' + month + '-' + year);
    // You can turn it in to your desired format
    setCurDat(date + "/" + month + "/" + year);
    setCurHor(hour + ":" + min);
    setValgli(0)
    setObserv("")

    createTable()
    searchUser()
  }

  const maskDat = ev => {
    var digitado = ev.nativeEvent.text;

    setCurDat(mask(unMask(digitado), ['99/99/9999']));
  };
  const maskHor = ev => {
    var digitado = ev.nativeEvent.text;

    setCurHor(mask(unMask(digitado), ['99:99']));
  };
  const viewObs = (obsgli) => {
    Alert.alert("OBS", obsgli)
  }
  const renderItem = ({ item }) => {
    let corgli = { color: "#002947" }
    if (item.valgli < 70 || item.valgli > 120) {
      corgli = { color: "#6B000A" }
    }

    let icoobs;
    if (item.obsgli != "") {
      icoobs = (<TouchableOpacity onPress={() => { viewObs(item.obsgli) }} style={styles.localIco}>
        <Icon
          name='alert-circle-outline'
          type='ionicon'
          color='#517fa4'
          size={30}
        />
      </TouchableOpacity>)
    }

    return (<View style={styles.linhaList}>
      <Text style={[styles.ValGli, corgli]}>{item.valgli}</Text>
      <Text style={[styles.DatGli]}>{cData(item.datgli)} - {item.horgli}</Text>
      {icoobs}
    </View>)
  };

  const compartilharExcel = async (data) => {


    let dadosex = [];
    //console.log(data.length)
    for(i=0;  i<data.length;i++){
      //console.log(data[i])
      let linhaex = {
        Data: cData(data[i].datgli,'-') + " " + data[i].horgli,
        Glicemia:data[i].valgli,
        Obs: data[i].obsgli
        
      }

      dadosex[i] = linhaex;
    }
    

    var ws = XLSX.utils.json_to_sheet(dadosex);
//
    let dd = new Date()
    let mili = dd.getMilliseconds()
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Prova");
//
    const wbout = XLSX.write(wb, { type: 'base64', bookType: "xlsx" });
    console.log(FileSystem.documentDirectory)
    let fileUri = FileSystem.documentDirectory + "glic_" + mili + ".xlsx";
//
    const { status } = await Camera.requestCameraPermissionsAsync();
    const { teste } = await MediaLibrary.requestPermissionsAsync();
    console.log(status)
    console.log(teste)
    if (status === "granted") {
      await FileSystem.writeAsStringAsync(fileUri, wbout, {
        encoding: FileSystem.EncodingType.Base64
      });
      const asset = await MediaLibrary.createAssetAsync(fileUri)
      await MediaLibrary.createAlbumAsync("Download", asset, false)
//
      await Sharing.shareAsync(fileUri, {
        mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        dialogTitle: 'MyWater data',
        UTI: 'com.microsoft.excel.xlsx'
      });
    }

  }
  useEffect(() => {
    getCurrentDate()
  }, [])

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.btlogo} >
        <Image source={iconedevapp} style={styles.logo} resizeMode="stretch" /></TouchableOpacity>
      <View style={styles.divisoria}></View>

      <View style={styles.linha}>
        <View style={styles.coluna}>
          <Text style={[styles.padtex]}>Glicemia</Text>
        </View>
        <View style={styles.coluna}>
          <Text style={[styles.padtex]}>Data</Text>
        </View>
        <View style={styles.coluna}>
          <Text style={[styles.padtex]}>Hora</Text>
        </View>
      </View>
      <View style={styles.linha}>
        <View style={styles.coluna}>
          <CurrencyInput
            value={valgli}
            onChangeValue={setValgli}
            prefix=""
            delimiter="."
            separator=""
            precision={0}
            style={styles.inputStyle}
            blurOnSubmit={false}
          />
        </View>
        <View style={styles.coluna}>
          <TextInput
            value={curdat}
            onChange={maskDat}
            style={[styles.inputStyle]}
            blurOnSubmit={false}
          />
        </View>
        <View style={styles.coluna}>
          <TextInput
            value={curhor}
            onChange={maskHor}
            style={[styles.inputStyle]}
            blurOnSubmit={false}

          />
        </View>
      </View>
      <View style={styles.linha}>
        <View style={[styles.coluna, { width: "90%", textAlign: "left", marginTop: 5 }]}>
          <TextInput
            style={styles.inputStyle}
            value={observ}
            onChangeText={setObserv}
            blurOnSubmit={false}
            placeholder='Observações'
          />
        </View>
      </View>
      <View style={[{ alignItems: "center", justifyContent: "center", alignContent: "center", marginTop: 15 }]}>
        <TouchableOpacity style={styles.btGravar} onPress={() => { insertItem() }}>
          <Text style={styles.txtBt}>Gravar</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.divisoria}></View>
      <View style={{ height: 500 }}>
        <FlatList
          data={dados}
          renderItem={renderItem}
          keyExtractor={item => item.ID}
          scrollEnabled={true}
          style={{ height: 460 }} />

        <TouchableOpacity onPress={() => { compartilharExcel(dados) }} style={[styles.btGravar, { width: "100%", height: 40, marginTop: 10, borderRadius: 5 }]}>
          <Text style={styles.txtBt}>Enviar resultados</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;