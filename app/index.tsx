import { Card } from '@/components/Card';
import { PokemonCard } from '@/components/pokemon/PokemonCard';
import { RootView } from '@/components/RootView';
import { Row } from '@/components/Row';
import { SearchBar } from '@/components/SearchBar';
import { SortButton } from '@/components/SortButton';
import { ThemedText } from '@/components/ThemedText';
import { getPokemonId } from '@/functions/pokemon';
import { useInfiniteFetchQuery } from '@/hooks/useFetchQuery';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useState } from 'react';
import { ActivityIndicator, FlatList, Image, StyleSheet, View } from 'react-native';

export default function Index() {
  const colors = useThemeColors();

  const { data, isFetching, fetchNextPage } = useInfiniteFetchQuery('/pokemon?limit=21');
  const pokemons =
    data?.pages.flatMap((page) =>
      page.results.map((result) => ({ name: result.name, id: getPokemonId(result.url) })),
    ) ?? [];

  const [sortKey, setSortKey] = useState<'id' | 'name'>('id');

  const [search, setSearch] = useState('');
  const filteredPokemons = [
    ...(search
      ? pokemons.filter(
          (pokemon) =>
            pokemon.name.includes(search.toLowerCase()) || pokemon.id.toString() === search,
        )
      : pokemons),
  ].sort((a, b) => (a[sortKey] < b[sortKey] ? -1 : 1));

  return (
    <RootView backgroundColor={colors.tint} style={{ flex: 1, padding: 4 }}>
      <View style={styles.header}>
        <Row gap={16}>
          <Image source={require('@/assets/images/pokeball.png')} style={styles.logo} />
          <ThemedText variant="headline" color="grayWhite">
            Pokédex
          </ThemedText>
        </Row>
        <Row gap={16}>
          <SearchBar value={search} onChange={setSearch} />
          <SortButton value={sortKey} onChange={setSortKey} />
        </Row>
      </View>
      <View style={{ flex: 1 }}>
        <Card style={styles.listContainer}>
          <FlatList
            data={filteredPokemons}
            numColumns={3}
            contentContainerStyle={[styles.gridGap]}
            ListFooterComponent={isFetching ? <ActivityIndicator color={colors.tint} /> : null}
            onEndReached={search ? undefined : () => fetchNextPage()}
            columnWrapperStyle={styles.gridGap}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <PokemonCard
                id={item.id}
                name={item.name}
                style={{
                  flex: 1 / 3,
                }}
              />
            )}
          />
        </Card>
      </View>
    </RootView>
  );
}
const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 24,
    gap: 8,
  },
  logo: {
    width: 24,
    height: 24,
  },
  listContainer: {
    flex: 1,
    paddingTop: 24,
    paddingHorizontal: 12,
  },
  gridGap: {
    gap: 8,
  },
});
