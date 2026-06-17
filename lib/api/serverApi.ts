//lib>api>serverApi
import type { AxiosRequestConfig } from "axios";
import { cookies } from "next/headers";
import { api } from "./api";
import {
  fetchNotesRequest,
  fetchNoteByIdRequest,
  createNoteRequest,
  deleteNoteRequest,
  type FetchNotesParams,
} from "./clientApi";
import type { CreateNoteRequest } from "@/types/note";
import type { UpdateUserRequest } from "@/types/auth";
import type { User } from "@/types/user";
import { debugCookies, logAuthDebug } from "@/lib/utils/authDebug";

const mergeConfigs = async (
  config?: AxiosRequestConfig
): Promise<AxiosRequestConfig> => {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  const baseHeaders = cookieHeader ? { Cookie: cookieHeader } : undefined;

  logAuthDebug("serverApi:merge-configs", {
    incomingHeaders: Boolean(config?.headers),
    cookies: debugCookies(cookieHeader),
  });

  return {
    ...config,
    headers: {
      ...baseHeaders,
      ...(config?.headers ?? {}),
    },
  };
};

export const fetchNotesServer = async (params?: FetchNotesParams) =>
  fetchNotesRequest(params, await mergeConfigs());

export const fetchNoteByIdServer = async (id: string) =>
  fetchNoteByIdRequest(id, await mergeConfigs());

export const createNoteServer = async (payload: CreateNoteRequest) =>
  createNoteRequest(payload, await mergeConfigs());

export const deleteNoteServer = async (id: string) =>
  deleteNoteRequest(id, await mergeConfigs());

export const getSessionServer = async () =>
  api.get<{ success: boolean }>("/auth/session", await mergeConfigs());

export const getCurrentUserServer = async () => {
  try {
    const config = await mergeConfigs();
    logAuthDebug("serverApi:getCurrentUser:start", {});

    const timeoutPromise = new Promise<null>((resolve) => {
      setTimeout(() => {
        logAuthDebug("serverApi:getCurrentUser:timeout", {});
        resolve(null);
      }, 5000);
    });

    const requestPromise = api.get<User>("/users/me", config);

    const response = await Promise.race([requestPromise, timeoutPromise]);

    if (!response) {
      logAuthDebug("serverApi:getCurrentUser:timeout-reached", {});
      return null;
    }

    logAuthDebug("serverApi:getCurrentUser:success", {
      responseStatus: response.status,
      hasData: Boolean(response.data),
    });
    return response.data;
  } catch (error) {
    logAuthDebug("serverApi:getCurrentUser:error", {
      message: error instanceof Error ? error.message : "unknown-error",
    });
    return null;
  }
};

export const updateUserServer = async (payload: UpdateUserRequest) => {
  const response = await api.patch<User>(
    "/users/me",
    payload,
    await mergeConfigs()
  );

  return response.data;
};

export const checkServerSession = async () => {
  const cookieStore = await cookies();
  const res = await api.get("/auth/session", {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });

  return res;
};
