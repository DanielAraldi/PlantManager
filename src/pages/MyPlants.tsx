import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, Image, Alert } from "react-native";
import { formatDistance } from "date-fns/esm";
import { pt } from "date-fns/esm/locale";
import { FlatList } from "react-native-gesture-handler";

import { Load } from "../components/Load";
import { Header } from "../components/Header";
import { PlantCardSecondary } from "../components/PlantCardSecondary";

import { loadPlant, PlantProps, removePlant } from "../libs/storage";

import waterdrop from "../assets/waterdrop.png";

import colors from "../styles/colors";
import fonts from "../styles/fonts";

export function MyPlants() {
  const [myPlants, setMyPlants] = useState<PlantProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [nextWatered, setNextWatered] = useState<string>();

  const handleRemove = ({ name, id }: PlantProps) => {
    Alert.alert("Remover", `Deseja remover a ${name}?`, [
      {
        text: "Não 🙏",
        style: "cancel",
      },
      {
        text: "Sim 😢",
        onPress: async () => {
          try {
            await removePlant(id);
            setMyPlants((oldData) => oldData.filter((item) => item.id !== id));
          } catch (error) {
            console.error(error);
            Alert.alert("Não foi possível remover! 😢");
          }
        },
      },
    ]);
  };

  useEffect(() => {
    const loadStorageData = async () => {
      const plantsStoraged = await loadPlant();
      if (plantsStoraged.length === 0) {
        setMyPlants(plantsStoraged);
        setLoading(false);
        return;
      }

      const nextTime = formatDistance(
        new Date(plantsStoraged[0].dateTimeNotification).getTime(),
        new Date().getTime(),
        { locale: pt } // Hour pt-BR
      );

      setNextWatered(
        `Não esqueça de regar a ${plantsStoraged[0].name} à ${nextTime}.`
      );
      setMyPlants(plantsStoraged);
      setLoading(false);
    };

    loadStorageData();
  }, []);

  if (loading) return <Load />;

  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.spotlight}>
        <Image style={styles.spotlightImage} source={waterdrop} />
        <Text style={styles.spotlightText}>
          {nextWatered
            ? nextWatered
            : "Você não tem nenhuma plantinha para regar. 🌱"}
        </Text>
      </View>
      <View style={styles.plants}>
        <Text style={styles.plantsTitle}>Próximas regadas</Text>
        <FlatList
          data={myPlants}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <PlantCardSecondary
              data={item}
              handleRemove={() => handleRemove(item)}
            />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 30,
    paddingTop: 50,
    backgroundColor: colors.background,
  },

  spotlight: {
    backgroundColor: colors.blue_light,
    paddingHorizontal: 20,
    borderRadius: 20,
    height: 110,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  spotlightImage: {
    width: 60,
    height: 60,
  },

  spotlightText: {
    flex: 1,
    color: colors.blue,
    paddingHorizontal: 20,
  },

  plants: {
    flex: 1,
    width: "100%",
  },

  plantsTitle: {
    fontSize: 24,
    fontFamily: fonts.heading,
    color: colors.heading,
    marginVertical: 20,
  },
});
