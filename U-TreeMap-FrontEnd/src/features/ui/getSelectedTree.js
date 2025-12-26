import { useMapStore } from "../../stores/UseMapStore";
import { adaptTreeDetail } from "./adaptTreeDetail";
import { fetchTreeDetail } from "../../api/treeDetail";



export async function getSelectedTree() {
    const selectedTreeId = useMapStore(
        (state) => state.selectedTreeId
    );
    if (!selectedTreeId) {
        console.log("ERR: zustand에 treeId가 없슈")
        return null;}

    const data = await fetchTreeDetail(selectedTreeId);
    return adaptTreeDetail(data);
}
