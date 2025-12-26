export async function fetchRegionDetail(regionDong) {
  const res = await apiClient.get(
    "/api/v1/utree-map/region-summary",
    { params: { regionDong } }
  );
  return res.data;
}
