// src/data/mockTreeData.js

// 드롭다운 데이터
export const INITIAL_TREE_DATA = [
  '개잎갈나무',
  '느티나무',
  '단풍나무',
  '메타세쿼이아',
  '배롱나무',
  '벚나무',
  '산사나무',
  '소나무',
  '은행나무',
  '잎갈나무',
  '측백나무',
];

export const INITIAL_CONDITION_DATA = ['양호', '보통', '불량'];

export const mockTreeData = {
  // 1. 기본 식별 정보
  id: 'No.002',
  name: '느티나무',
  scientificName: 'Zelkova serrata',

  // 2. 요약 설명 (리스트 형태)
  summary: ['한국을 대표하는 낙엽성 교목', '수명: 수백 년', '크기: 높이 20~30m, 넓게 퍼지는 우산형 수관'],

  // 3. 사진 URL
  imageUrl: 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?q=80&w=2074&auto=format&fit=crop',

  // 4. 위치 정보
  address: '울산광역시 남구 무거동 울산대학교',
  coordinates: {
    lat: 35.5383603,
    lng: 129.2555418,
  },

  // 5. 탄소 흡수량 (카드 데이터)
  carbon: {
    amount: '25kg',
    description: '성목 기준 연간 약 20~30kg CO₂ 흡수',
    effect: '승용차 100~150km 주행량 절감 효과',
  },

  // 6. 상세 스펙 (4칸 그리드)
  specs: {
    dbh: '10cm', // 흉고직경
    height: '420cm', // 수고
    width: '200cm', // 수관폭
    rootHeight: '80cm', // 지하고
  },

  // 7. 메타 데이터
  updateDate: '2025/11/22(토)',

  // 8. 하단 탭 상세 내용
  details: {
    morphology: '잎: 작고 타원형이며 가장자리에 고운 톱니가 있습니다. 나무 껍질은 회백색이며 비늘처럼 벗겨집니다.', // 형태적 특징
    environment: '양지바른 곳을 좋아하며 토심이 깊고 비옥한 적윤지에서 잘 자랍니다. 내한성과 내공해성이 강합니다.', // 생육 환경
    usage: '가로수, 정자나무, 공원수, 녹음수 등으로 식재하며 목재는 결이 곱고 단단하여 가구재로 쓰입니다.', // 활용 용도
  },
};
