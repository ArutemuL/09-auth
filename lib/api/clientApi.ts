//lib>api>clientApi.ts

import type { AxiosRequestConfig } from "axios";
import { api } from "./api";
import type { Note, CreateNoteRequest } from "@/types/note";
import type { AuthCredentials, UpdateUserRequest } from "@/types/auth";
import type { User } from "@/types/user";

export interface FetchNotesParams {
  page?: number;
  perPage?: number;
  search?: string;
  tag?: string;
}

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

const buildNotesParams = ({
  page = 1,
  perPage = 12,
  search,
  tag,
}: FetchNotesParams = {}) => ({
  page,
  perPage,
  ...(search && search.trim() !== "" ? { search } : {}),
  ...(tag && tag !== "All" ? { tag } : {}),
});

export const fetchNotesRequest = async (
  params?: FetchNotesParams,
  config?: AxiosRequestConfig
) => {
  const response = await api.get<FetchNotesResponse>("/notes", {
    params: buildNotesParams(params),
    ...config,
  });

  return response.data;
};

export const fetchNotes = async (params?: FetchNotesParams) =>
  fetchNotesRequest(params);

export const fetchNoteByIdRequest = async (
  id: string,
  config?: AxiosRequestConfig
) => {
  const response = await api.get<Note>(`/notes/${id}`, {
    ...config,
  });

  return response.data;
};

export const fetchNoteById = async (id: string) => fetchNoteByIdRequest(id);

export const createNoteRequest = async (
  payload: CreateNoteRequest,
  config?: AxiosRequestConfig
) => {
  const response = await api.post<Note>("/notes", payload, {
    ...config,
  });

  return response.data;
};

export const createNote = async (payload: CreateNoteRequest) =>
  createNoteRequest(payload);

export const updateNoteRequest = async (
  id: string,
  payload: CreateNoteRequest,
  config?: AxiosRequestConfig
) => {
  const response = await api.patch<Note>(`/notes/${id}`, payload, {
    ...config,
  });

  return response.data;
};

export const updateNote = async (id: string, payload: CreateNoteRequest) =>
  updateNoteRequest(id, payload);

export const deleteNoteRequest = async (
  id: string,
  config?: AxiosRequestConfig
) => {
  const response = await api.delete<Note>(`/notes/${id}`, {
    ...config,
  });

  return response.data;
};

export const deleteNote = async (id: string) => deleteNoteRequest(id);

export const login = async (credentials: AuthCredentials) => {
  const response = await api.post<User>("/auth/login", credentials);

  return response.data;
};

export const register = async (credentials: AuthCredentials) => {
  const response = await api.post<User>("/auth/register", credentials);

  return response.data;
};

export const logout = async () => {
  await api.post("/auth/logout");
};

export const getSession = async () => {
  const response = await api.get<User | null>("/auth/session");

  if (!response.data) {
    return null;
  }

  return response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get<User>("/users/me");

  return response.data;
};

export const updateUser = async (payload: UpdateUserRequest) => {
  const response = await api.patch<User>("/users/me", payload);

  return response.data;
};
