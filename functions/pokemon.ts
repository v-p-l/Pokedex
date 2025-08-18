export function getPokemonId(url: string): number {
  const segments = url.split('/');
  const id = segments[segments.length - 2];
  return parseInt(id, 10);
}

export function getPokemonArtwork(id: number | string): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
}

export function formatWeight(weight?: number): string {
  if (!weight) {
    return '--';
  }
  return (weight / 10).toString().replace('.', ',') + ' kg';
}

export function formatSize(size?: number): string {
  if (!size) {
    return '--';
  }
  return (size / 10).toString().replace('.', ',') + ' m';
}

export function formatBio(bio?: string): string {
  if (!bio) {
    return 'Loading...';
  }
  return bio.replaceAll('\n', ' ');
}

type StatName = 'hp' | 'attack' | 'defense' | 'special-attack' | 'special-defense' | 'speed';

const statMap: Record<StatName, string> = {
  hp: 'HP',
  attack: 'ATK',
  defense: 'DEF',
  'special-attack': 'SATK',
  'special-defense': 'SDEF',
  speed: 'SPD',
};

export function statShortName(name?: string): string {
  if (!name) {
    return '--';
  }

  const key = name.toLowerCase() as StatName;

  if (key in statMap) {
    return statMap[key];
  }

  throw new Error(`Stat name invalide: "${name}"`);
}

export const basePokemonStats = [
  {
    base_stat: 1,
    stat: {
      name: 'hp',
    },
  },
  {
    base_stat: 1,
    stat: {
      name: 'attack',
    },
  },
  {
    base_stat: 1,
    stat: {
      name: 'defense',
    },
  },
  {
    base_stat: 1,
    stat: {
      name: 'special-attack',
    },
  },
  {
    base_stat: 1,
    stat: {
      name: 'special-defense',
    },
  },
  {
    base_stat: 1,
    stat: {
      name: 'speed',
    },
  },
];
