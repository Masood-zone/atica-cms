import { apiClient } from "@/services/root";

// Fetch all classes
export const fetchClasses = async () => {
  const response = await apiClient.get("/classes");
  return response.data;
};

// Fetch class by id
export const fetchClass = async (id: number) => {
  const response = await apiClient.get(`/classes/${id}`);
  return response.data;
};

// Create a new class
export const createClass = async (data: {
  name: string;
  description: string;
  supervisorId: number;
}) => {
  const response = await apiClient.post("/classes", data);
  return response.data;
};

// Update class
export const updateClass = async (data: Class) => {
  const response = await apiClient.put(`/classes/${data.id}`, data);
  return response.data;
};

// Update only canteen price for a class
export const updateClassCanteenPrice = async (payload: {
  id: number;
  canteenPrice: number;
}) => {
  const response = await apiClient.patch(
    `/classes/${payload.id}/canteen-price`,
    { canteenPrice: payload.canteenPrice }
  );
  return response.data;
};
