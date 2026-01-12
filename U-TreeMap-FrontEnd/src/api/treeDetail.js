import { apiClient } from "../lib/apiClient";

export async function fetchTreeDetail(treeId) {
  const res = await apiClient.get(
    `/api/v1/utree-map/trees/${treeId}`
  );
  return res.data;
}
