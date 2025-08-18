import { Colors } from '@/constants/Colors';
import { MAX_POKEMON } from '@/constants/Pokemon';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

const endpoint = 'https://pokeapi.co/api/v2';

type API = {
  '/pokemon?limit=21': {
    count: number;
    next: string;
    results: { name: string; url: string }[];
  };
  '/pokemon/[id]': {
    id: number;
    name: string;
    url: string;
    weight: number;
    height: number;
    moves: { move: { name: string } }[];
    stats: {
      base_stat: number;
      stat: {
        name: string;
      };
    }[];
    types: {
      type: {
        name: keyof (typeof Colors)['type'];
      };
    }[];
  };
  '/pokemon-species/[id]': {
    flavor_text_entries: {
      flavor_text: string;
      language: {
        name: string;
      };
      version: {
        name: string;
      };
    }[];
  };
};

export function useFetchQuery<T extends keyof API>(
  path: T,
  params?: Record<string, string | number>,
) {
  const localUrl =
    endpoint +
    Object.entries(params ?? {}).reduce<string>(
      (acc, [key, value]) => acc.replaceAll(`[${key}]`, String(value)),
      path,
    );
  return useQuery({
    queryKey: [localUrl],
    queryFn: async () => {
      return fetch(localUrl, {
        headers: {
          Accept: 'application/json',
        },
      }).then((res) => res.json() as Promise<API[T]>);
    },
  });
}

export function useInfiniteFetchQuery<T extends keyof API>(path: T) {
  return useInfiniteQuery({
    queryKey: [path],
    initialPageParam: endpoint + path,
    queryFn: async ({ pageParam }) => {
      return fetch(pageParam, {
        headers: {
          Accept: 'application/json',
        },
      }).then((res) => res.json() as Promise<API[T]>);
    },
    getNextPageParam: (lastPage) => {
      if (!('next' in lastPage)) return null;

      // lastPage.next = "https://pokeapi.co/api/v2/pokemon?offset=X&limit=Y"
      const url = new URL(lastPage.next);
      const offset = parseInt(url.searchParams.get('offset') ?? '0', 10);
      let limit = parseInt(url.searchParams.get('limit') ?? '21', 10);

      if (offset >= MAX_POKEMON) {
        return null;
      }

      if (offset + limit > MAX_POKEMON) {
        limit = MAX_POKEMON - offset;
        url.searchParams.set('limit', limit.toString());
        return url.toString();
      }

      return lastPage.next;
    },
  });
}
