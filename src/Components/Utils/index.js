import axios from "axios";
import { apiUrl } from "./apiUrl";
const apiHeaders = {
  headers: {
    Accept: "application/json",
    Authorization: localStorage.getItem("AuthToken"),
  },
};

export function getOriginOnAirline(airline) {
  airline = `?airlineCode=${airline}`;
  return axios
    .get(apiUrl["getAirline"] + airline, apiHeaders)
    .then((resp) => resp)
    .catch((err) => err);
}

export function airlineSelect1(airline) {
  airline = `?airlineCode=${airline}`;
  return axios
    .get(apiUrl["getAirline1"] + airline)
    .then((resp) => resp)
    .catch((err) => err);
}
