const TREE_COLOR_PALETTE = [
  "rgba(27, 94, 32, 0.75)",   // 0: 개잎갈나무 (Manchurian fir)
  "rgba(76, 175, 80, 0.75)", // 1: 느티나무 (Zelkova)
  "rgba(102, 187, 106, 0.75)", // 2: 단풍나무 (Maple)
  "rgba(0, 105, 92, 0.75)",  // 3: 메타세쿼이아 (Dawn redwood)
  "rgba(216, 27, 96, 0.65)", // 4: 배롱나무 (Crape myrtle)
  "rgba(244, 143, 177, 0.65)", // 5: 벚나무 (Cherry tree)
  "rgba(141, 110, 99, 0.7)", // 6: 산사나무 (Hawthorn)
  "rgba(46, 125, 50, 0.75)", // 7: 소나무 (Pine)
  "rgba(255, 235, 59, 0.7)", // 8: 은행나무 (Ginkgo)
  "rgba(67, 160, 71, 0.75)", // 9: 잎갈나무 (Larch)
  "rgba(38, 166, 154, 0.75)", // 10: 측백나무 (Oriental arborvitae)
];

export function getTreeColor(TREE_SPECIES) {
    if(TREE_SPECIES<=10){console.log("!ERR : 등록된 수종 범위를 벗어나는 값 입니다."); return("rgba(0,0,0,1)")}
    else{ return(TREE_COLOR_PALETTE[TREE_SPECIES]);}
}