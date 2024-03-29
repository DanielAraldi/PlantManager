import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/core";

import { EnvironmentButton } from "../components/EnvironmentButton";
import { Header } from "../components/Header";
import { Loading } from "../components/Loading";
import { PlantCardPrimary } from "../components/PlantCardPrimary";

import { PlantProps } from "../libs/storage";

import { api } from "../services/api";

import colors from "../styles/colors";
import fonts from "../styles/fonts";

interface EnvironmentProps {
  key: string;
  title: string;
}

export function PlantSelect() {
  const [environments, setEnvironments] = useState<EnvironmentProps[]>([]);
  const [plants, setPlants] = useState<PlantProps[]>([]);
  const [filteredPlants, setFilteredPlants] = useState<PlantProps[]>([]);
  const [environmentSelected, setEnvironmentSelected] = useState("all");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(true);
  const [serverError, setServerError] = useState(false);

  const navigation = useNavigation();

  const handleEnvironmentSelected = (key: string) => {
    setEnvironmentSelected(key);

    if (key === "all") return setFilteredPlants(plants);

    const filtered = plants.filter(({ environments }) =>
      environments.includes(key)
    );

    setFilteredPlants(filtered);
  };

  const fetchPlants = () => {
    api
      .get(`plants?_sort=name&_order=asc&_page=${page}&_limit=${8}`)
      .then((response) => {
        const { data } = response;
        if (page > 1) {
          setPlants((oldData) => [...oldData, ...data]);
          setFilteredPlants((oldData) => [...oldData, ...data]);
        } else {
          setPlants(data);
          setFilteredPlants(data);
        }
      })
      .catch(() => {
        setLoading(false);
        setLoadingMore(false);
        setServerError(true);
      })
      .finally(() => {
        setLoading(false);
        setLoadingMore(false);
      });
  };

  const handleFetchMore = (distance: number) => {
    if (distance < 1) return;

    setLoadingMore(true);
    setPage((oldPage) => oldPage + 1);
    fetchPlants();
  };

  const handlePlantSelect = (plant: PlantProps) =>
    navigation.navigate("PlantSave", { plant });

  useEffect(() => {
    api
      .get("plants_environments?_sort=title&_order=asc")
      .then((response) => {
        const { data } = response;
        setEnvironments([
          {
            key: "all",
            title: "Todos",
          },
          ...data,
        ]);
      })
      .catch(() => {
        setLoading(false);
        setLoadingMore(false);
        setServerError(true);
      });
  }, []);

  useEffect(() => {
    fetchPlants();
  }, []);

  if (loading) return <Loading load />;
  if (serverError) return <Loading load={false} serverError />;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Header />
        <Text style={styles.title}>Em qual ambiente</Text>
        <Text style={styles.subtitle}>você quer colocar sua planta?</Text>
      </View>
      <View>
        <FlatList
          data={environments}
          keyExtractor={(item) => String(item.key)}
          renderItem={({ item }) => (
            <EnvironmentButton
              title={item.title}
              active={item.key === environmentSelected}
              onPress={() => handleEnvironmentSelected(item.key)}
            />
          )}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.environmentList}
        />
      </View>
      <View style={styles.plants}>
        <FlatList
          data={filteredPlants}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <PlantCardPrimary
              data={item}
              onPress={() => handlePlantSelect(item)}
            />
          )}
          showsVerticalScrollIndicator={false}
          numColumns={2}
          onEndReachedThreshold={0.1}
          onEndReached={({ distanceFromEnd }) =>
            handleFetchMore(distanceFromEnd)
          }
          ListFooterComponent={
            loadingMore ? <ActivityIndicator color={colors.green} /> : <></>
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  header: {
    paddingHorizontal: 30,
  },

  title: {
    fontSize: 17,
    color: colors.heading,
    fontFamily: fonts.heading,
    lineHeight: 20,
    marginTop: 15,
  },

  subtitle: {
    fontFamily: fonts.text,
    fontSize: 17,
    lineHeight: 20,
    color: colors.heading,
  },

  environmentList: {
    height: 40,
    justifyContent: "center",
    paddingBottom: 5,
    paddingRight: 64,
    marginHorizontal: 32,
    marginVertical: 32,
  },

  plants: {
    flex: 1,
    paddingHorizontal: 32,
    justifyContent: "center",
  },
});
