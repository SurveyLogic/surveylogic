import {useQuery} from '@tanstack/react-query';
import axios from 'axios';
import {COOKIE_LAW_COUNTRIES} from './cookie-law-countries';

const endpoint = 'https://freegeoip.app/json';

interface Response {
  userIsFromEu: boolean;
}

interface Props {
  enabled: boolean;
}
export function useUserIsFromEu({enabled}: Props) {
  return useQuery([endpoint], () => checkIfFromEu(), {
    staleTime: Infinity,
    enabled,
  });
}

function checkIfFromEu(): Promise<Response> {
  return axios
    .get(endpoint)
    .then(response => {
      const userIsFromEu = COOKIE_LAW_COUNTRIES.includes(
        response.data.country_code
      );
      return {userIsFromEu};
    })
    .catch(() => {
      return {userIsFromEu: true};
    });
}
