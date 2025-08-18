import { Card } from '@/components/Card';
import { PokemonSpec } from '@/components/pokemon/PokemonSpec';
import { PokemonStat } from '@/components/pokemon/PokemonStat';
import { PokemonType } from '@/components/pokemon/PokemonType';
import { RootView } from '@/components/RootView';
import { Row } from '@/components/Row';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { MAX_POKEMON } from '@/constants/Pokemon';
import {
  basePokemonStats,
  formatBio,
  formatSize,
  formatWeight,
  getPokemonArtwork,
  statShortName,
} from '@/functions/pokemon';
import { useFetchQuery } from '@/hooks/useFetchQuery';
import { useThemeColors } from '@/hooks/useThemeColors';
import { router, useLocalSearchParams } from 'expo-router';
import { useRef, useState } from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import PagerView from 'react-native-pager-view';

export default function Pokemon() {
  const params = useLocalSearchParams() as { id: string };
  const [id, setId] = useState(parseInt(params.id, 10));
  const pager = useRef<PagerView>(null);
  const offset = useRef(0);

  const colors = useThemeColors();
  const { data: pokemon } = useFetchQuery('/pokemon/[id]', { id });
  const mainType = pokemon?.types?.[0].type.name;
  const colorType = mainType ? Colors.type[mainType] : colors.tint;

  /* 
    "position" is our position on the carrousel:
      - 0: previous view
      - 1: current view
      - 2: next view
    "offset" calcul the difference between previous position and current position on the carrousel 
      - -1
      - 0
      - 1
  */

  const onPageSelected = (e: { nativeEvent: { position: number } }) => {
    offset.current = e.nativeEvent.position - 1;
  };

  const onPageScrollStateChanged = (e: { nativeEvent: { pageScrollState: string } }) => {
    if (e.nativeEvent.pageScrollState !== 'idle') return;

    if (offset.current !== 0) {
      let newId;

      if (id === 1 && offset.current === -1) newId = MAX_POKEMON;
      else if (id === MAX_POKEMON && offset.current === 1) newId = 1;
      else newId = id + offset.current;

      setId(newId);
      offset.current = 0;

      pager.current?.setPageWithoutAnimation(1);
    }
  };

  return (
    <RootView backgroundColor={colorType} style={{ flex: 1, padding: 4 }}>
      <PagerView
        ref={pager}
        initialPage={1}
        style={{ flex: 1 }}
        onPageSelected={onPageSelected}
        onPageScrollStateChanged={onPageScrollStateChanged}
      >
        <PokemonView id={id === 1 ? MAX_POKEMON : id - 1} key={id === 1 ? MAX_POKEMON : id - 1} />
        <PokemonView id={id} key={id} />
        <PokemonView id={id === MAX_POKEMON ? 1 : id + 1} key={id === MAX_POKEMON ? 1 : id + 1} />
      </PagerView>
    </RootView>
  );
}

function PokemonView({ id }: { id: number }) {
  const colors = useThemeColors();

  const { data: pokemon } = useFetchQuery('/pokemon/[id]', { id: id });
  const { data: species } = useFetchQuery('/pokemon-species/[id]', { id: id });

  const mainType = pokemon?.types?.[0].type.name;
  const colorType = mainType ? Colors.type[mainType] : colors.tint;
  const types = pokemon?.types ?? [];
  const bio = species?.flavor_text_entries?.find(
    ({ language, version }) => language.name === 'en' && version.name === 'firered',
  )?.flavor_text;

  const stats = pokemon?.stats ?? basePokemonStats;

  return (
    <View style={{ flex: 1 }}>
      <Row style={styles.header}>
        <Pressable onPress={router.back}>
          <Image
            source={require('@/assets/images/icon-arrow-back.png')}
            style={{
              width: 32,
              height: 32,
            }}
          />
        </Pressable>
        <ThemedText
          variant="headline"
          color="grayWhite"
          style={{ flex: 1, textTransform: 'capitalize' }}
        >
          {pokemon?.name || '--'}
        </ThemedText>
        <ThemedText variant="subtitle2" color="grayWhite">
          #{id.toString().padStart(3, '0')}
        </ThemedText>
        <Image
          source={require('@/assets/images/background-pokeball.png')}
          style={styles.pokeballImage}
        />
      </Row>
      <View style={styles.pokemonImageContainer}>
        <Row style={{ justifyContent: 'space-between' }}>
          <Image
            source={require('@/assets/images/icon-chevron-left.png')}
            style={{
              width: 24,
              height: 24,
            }}
          />
          <Image
            source={require('@/assets/images/icon-chevron-right.png')}
            style={{
              width: 24,
              height: 24,
            }}
          />
        </Row>
        <Image
          source={{
            uri: getPokemonArtwork(id),
          }}
          style={styles.pokemonImage}
        />
      </View>
      <Card style={styles.body}>
        <Row style={{ justifyContent: 'center', gap: 16 }}>
          {types.length === 0 && <PokemonType name="--" />}
          {types.map((type) => (
            <PokemonType name={type?.type.name} key={type?.type.name} />
          ))}
        </Row>
        <View style={{ gap: 16 }}>
          <ThemedText variant="subtitle1" style={{ alignSelf: 'center', color: colorType }}>
            About
          </ThemedText>
          <Row>
            <PokemonSpec
              attributeName={'Weight'}
              value={formatWeight(pokemon?.weight)}
              icon={require('@/assets/images/icon-weight.png')}
              style={{ borderStyle: 'solid', borderRightWidth: 1, borderColor: colors.grayLight }}
            />
            <PokemonSpec
              attributeName={'Size'}
              value={formatSize(pokemon?.height)}
              icon={require('@/assets/images/icon-straighten.png')}
              style={{ borderStyle: 'solid', borderRightWidth: 1, borderColor: colors.grayLight }}
            />
            <PokemonSpec
              attributeName={'Moves'}
              value={pokemon?.moves
                .slice(0, 2)
                .map((move) => move.move.name)
                .join('\n')}
            />
          </Row>
          <View style={{ height: 60, justifyContent: 'center', alignItems: 'center' }}>
            <ThemedText>{formatBio(bio)}</ThemedText>
          </View>
        </View>
        <View style={{ gap: 16 }}>
          <ThemedText variant="subtitle1" style={{ alignSelf: 'center', color: colorType }}>
            Base stats
          </ThemedText>
          <View>
            {stats.map((stat) => (
              <PokemonStat
                name={statShortName(stat.stat.name)}
                value={stat.base_stat}
                color={colorType}
                key={`${id}-${stat.stat.name}`}
              />
            ))}
          </View>
        </View>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 24,
    gap: 8,
    alignItems: 'center',
  },
  pokeballImage: {
    width: 208,
    height: 208,
    position: 'absolute',
    top: 0,
    right: 0,
  },
  pokemonImageContainer: {
    height: 144,
    justifyContent: 'flex-end',
    paddingVertical: 16,
    paddingHorizontal: 20,
    position: 'relative',
  },
  pokemonImage: {
    width: 200,
    height: 200,
    position: 'absolute',
    top: 0,
    left: 100,
    zIndex: 1,
  },
  body: {
    paddingTop: 56,
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 16,
  },
});
