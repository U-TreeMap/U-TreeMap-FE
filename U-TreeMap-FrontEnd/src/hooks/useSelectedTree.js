import { useEffect, useState } from "react";
import { useMapStore } from "../stores/UseMapStore"
import { fetchTreeDetail } from "../api/treeDetail";
import { adaptTreeDetail } from "../features/ui/adaptTreeDetail";

/**
 * 선택된 treeId → API 호출 → UI 모델 변환
 */
export function useSelectedTree() {
  const selectedTreeId = useMapStore((s) => s.selectedTreeId);

  const [tree, setTree] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!selectedTreeId) return;

    let cancelled = false;

    async function loadTree() {
      setLoading(true);
      setError(null);

      try {
        const apiData = await fetchTreeDetail(selectedTreeId);
        const uiModel = adaptTreeDetail(apiData);

        if (!cancelled) setTree(uiModel);
      } catch (e) {
        if (!cancelled) setError(e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadTree();

    return () => {
      cancelled = true;
    };
  }, [selectedTreeId]);

  return { tree, loading, error };
}
