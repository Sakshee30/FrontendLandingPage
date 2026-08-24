import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from "axios";

export interface ApiResponse<T = any> {
  data?: T;
  message?: string;
  status?: number;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public code?: string,
    public originalError?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export interface RequestConfig extends AxiosRequestConfig {
  retry?: number;
  retryDelay?: number;
}

export const apiClient: AxiosInstance = axios.create({
  baseURL: (import.meta.env.VITE_API_BASE_URL ?? "") + "/api/v1",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 30000,
});

async function retryRequest(
  error: AxiosError,
  config: RequestConfig,
  retryCount: number,
): Promise<any> {
  const { retry = 0, retryDelay = 1000 } = config;

  if (retryCount < retry) {
    await new Promise((resolve) =>
      setTimeout(resolve, retryDelay * Math.pow(2, retryCount)),
    );
    return apiClient(config);
  }

  return Promise.reject(error);
}

apiClient.interceptors.request.use(
  (config) => {
    (config as any).metadata = { startTime: new Date() };
    const token = localStorage.getItem("accessToken");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(
      new ApiError(
        "Request configuration failed",
        undefined,
        "REQUEST_ERROR",
        error,
      ),
    );
  },
);

apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    const metadata = (response.config as any).metadata;
    if (metadata?.startTime) {
      const duration = new Date().getTime() - metadata.startTime.getTime();
      console.debug(
        `API Request: ${response.config.method?.toUpperCase()} ${response.config.url} - ${duration}ms`,
      );
    }
    if (response.data?.data && response.data?.meta) {
      return { ...response.data.data, ...response.data.meta };
    }
    return response.data?.data ?? response.data;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as RequestConfig;
    const retryCount = (originalRequest as any).retryCount || 0;
    if (retryCount < (originalRequest.retry || 0)) {
      (originalRequest as any).retryCount = retryCount + 1;
      return retryRequest(error, originalRequest, retryCount);
    }
    if (error.response) {
      const status = error.response.status;
      const data = error.response.data as any;

      switch (status) {
        case 401:
          localStorage.removeItem("accessToken");
          if (
            typeof window !== "undefined" &&
            !window.location.pathname.includes("/login")
          ) {
            window.location.href = "/login";
          }
          throw new ApiError(
            "Session expired. Please login again.",
            status,
            "UNAUTHORIZED",
            error,
          );

        case 403:
          throw new ApiError(
            data?.message || data?.error || "You do not have permission to perform this action",
            status,
            "FORBIDDEN",
            error,
          );

        case 404:
          throw new ApiError("Resource not found", status, "NOT_FOUND", error);

        case 422:
          const validationErrors = data?.errors || data?.message;
          throw new ApiError(
            typeof validationErrors === "string"
              ? validationErrors
              : "Validation failed",
            status,
            "VALIDATION_ERROR",
            error,
          );

        case 429:
          throw new ApiError(
            "Too many requests. Please try again later.",
            status,
            "RATE_LIMITED",
            error,
          );

        case 500:
        case 502:
        case 503:
        case 504:
          throw new ApiError(
            data?.message || data?.error || "Server error. Please try again later.",
            status,
            "SERVER_ERROR",
            error,
          );

        default:
          const message =
            data?.message ||
            data?.error ||
            `Request failed with status ${status}`;
          throw new ApiError(message, status, "REQUEST_FAILED", error);
      }
    } else if (error.request) {
      throw new ApiError(
        "Network error. Please check your connection.",
        undefined,
        "NETWORK_ERROR",
        error,
      );
    } else {
      throw new ApiError(
        error.message || "An unexpected error occurred",
        undefined,
        "UNKNOWN_ERROR",
        error,
      );
    }
  },
);

export async function get<T = any>(
  url: string,
  config?: RequestConfig,
): Promise<T> {
  return apiClient.get(url, config) as Promise<T>;
}

export async function post<T = any>(
  url: string,
  data?: any,
  config?: RequestConfig,
): Promise<T> {
  return apiClient.post(url, data, config) as Promise<T>;
}

export async function put<T = any>(
  url: string,
  data?: any,
  config?: RequestConfig,
): Promise<T> {
  return apiClient.put(url, data, config) as Promise<T>;
}

export async function patch<T = any>(
  url: string,
  data?: any,
  config?: RequestConfig,
): Promise<T> {
  return apiClient.patch(url, data, config) as Promise<T>;
}

export async function del<T = any>(
  url: string,
  config?: RequestConfig,
): Promise<T> {
  return apiClient.delete(url, config) as Promise<T>;
}
