import MockAdapter from "axios-mock-adapter";
import api from "../config/client";

export const axiosMock = new MockAdapter(api);