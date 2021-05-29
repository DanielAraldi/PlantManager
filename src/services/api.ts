import axios from "axios";
import { PORT, URL } from "../../env";

export const api = axios.create({
  baseURL: `${URL}:${PORT}`,
});
