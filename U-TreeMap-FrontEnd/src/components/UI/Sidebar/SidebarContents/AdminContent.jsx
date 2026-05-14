import { Link, useLocation } from 'react-router-dom';
import WhiteLeftArrow from '../../../../assets/icons/white_left_arrow.svg';
import RightArrowIcon from '../../../../assets/icons/right_arrow.svg';
import PageIcon from '../../../../assets/icons/page.svg';
import LocationIcon from '../../../../assets/icons/location.svg';
import PencilIcon from '../../../../assets/icons/pencil.svg';
import { ROUTES } from '../../../../routes/routePaths';

const adminActions = [
  { label: '자원 봉사자 초대 큐알 생성', iconType: 'grid', to: ROUTES.ADMIN_VOLUNTEER_INVITE },
  { label: '나무 정보 수정 요청 승인', iconType: 'check', to: ROUTES.ADMIN_TREE_EDIT_REQUESTS },
  { label: '나무 정보 상세', icon: PageIcon },
];

const teamRequests = ['팀 1', '팀 2', '팀 3', '팀 4', '팀 5'];
const editRequests = [
  { id: 'request-1', name: '은행나무 12345' },
  { id: 'request-2', name: '은행나무 12345' },
  { id: 'request-3', name: '은행나무 12345' },
  { id: 'request-4', name: '은행나무 12345' },
  { id: 'request-5', name: '은행나무 12345' },
];

const requestDetail = {
  coordinate: '(35.5383603, 129.2555418)',
  treeName: '느티나무',
  breastHeight: '10',
  height: '420',
  crownWidth: '200',
  branchHeight: '80',
};

const inviteUrl = 'http://www.dfdfdfdf.com';
const qrCells = [
  '111111100101101111111',
  '100000101011101000001',
  '101110101110101011101',
  '101110100101001011101',
  '101110101011101011101',
  '100000101010101000001',
  '111111101010101111111',
  '000000001101000000000',
  '101011111001111010110',
  '010100011110001101001',
  '111011101001101111010',
  '001101001111010001100',
  '110101110010111010111',
  '011110001101001111001',
  '101001111011100010110',
  '000000001001111001010',
  '111111101110101011011',
  '100000100011001101000',
  '101110101101111010111',
  '100000101010001100100',
  '111111101111010011111',
];

function ActionIcon({ item }) {
  if (item.icon) {
    return <img src={item.icon} alt="" className="h-6 w-6 shrink-0" />;
  }

  if (item.iconType === 'grid') {
    return (
      <span className="grid h-6 w-6 shrink-0 grid-cols-2 gap-[3px] p-[3px]">
        <span className="rounded-[2px] border-2 border-[#797979]" />
        <span className="rounded-[2px] border-2 border-[#797979]" />
        <span className="rounded-[2px] border-2 border-[#797979]" />
        <span className="rounded-[2px] border-2 border-[#797979]" />
      </span>
    );
  }

  return (
    <span className="relative h-6 w-6 shrink-0 rounded-full bg-[#797979]">
      <span className="absolute left-[7px] top-[6px] h-[7px] w-[12px] rotate-[-45deg] border-b-[3px] border-l-[3px] border-white" />
    </span>
  );
}

function AdminActionRow({ item }) {
  const content = (
    <>
      <ActionIcon item={item} />
      <span className="ml-5 flex-1 text-[16px] font-bold text-[#111111]">{item.label}</span>
      <img src={RightArrowIcon} alt="" className="h-5 w-5 shrink-0 opacity-70" />
    </>
  );

  if (item.to) {
    return (
      <Link
        to={item.to}
        className="flex h-[58px] w-full items-center rounded-[17px] bg-[#F5F5F8] px-5 text-left transition-colors hover:bg-[#ECECEF]"
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      type="button"
      className="flex h-[58px] w-full items-center rounded-[17px] bg-[#F5F5F8] px-5 text-left transition-colors hover:bg-[#ECECEF]"
    >
      {content}
    </button>
  );
}

function AdminSubHeader({ title, backTo }) {
  return (
    <header className="relative flex h-[80px] shrink-0 items-center justify-center bg-[#169500] px-6">
      <Link
        to={backTo}
        aria-label="이전 페이지로 돌아가기"
        className="absolute left-4 flex h-11 w-11 items-center justify-center rounded-full transition-colors hover:bg-white/10"
      >
        <img src={WhiteLeftArrow} alt="" className="h-6 w-6" />
      </Link>
      <h1 className="text-[18px] font-bold text-white">{title}</h1>
    </header>
  );
}

function LocationLine() {
  return (
    <div className="flex items-center justify-center gap-1 text-[14px] font-bold text-[#4B4B4B]">
      <img src={LocationIcon} alt="" className="h-5 w-5 opacity-80" />
      <span>울산광역시 남구 무거동 울산대학교</span>
    </div>
  );
}

function QrPattern() {
  return (
    <div className="grid h-[170px] w-[170px] grid-cols-[repeat(21,minmax(0,1fr))] gap-0 bg-white p-1">
      {qrCells.join('').split('').map((cell, index) => (
        <span key={`${cell}-${index}`} className={cell === '1' ? 'bg-black' : 'bg-white'} />
      ))}
    </div>
  );
}

function VolunteerInviteContent() {
  return (
    <div className="flex h-full flex-col bg-white">
      <AdminSubHeader title="자원봉사자 초대 QR" backTo={ROUTES.ADMIN} />

      <main className="px-5 pt-16">
        <div className="mb-5">
          <LocationLine />
        </div>

        <div className="mx-auto flex h-[286px] w-[286px] items-center justify-center rounded-[36px] bg-[#F5F5F8]">
          <QrPattern />
        </div>

        <div className="mt-5 flex h-[48px] items-center rounded-[14px] bg-[#F5F5F8] px-4">
          <span className="min-w-0 flex-1 truncate text-[14px] font-semibold text-[#111111]">{inviteUrl}</span>
          <button
            type="button"
            aria-label="초대 URL 복사"
            className="relative ml-3 h-6 w-6 shrink-0 text-[#797979]"
          >
            <span className="absolute left-[7px] top-[4px] h-[15px] w-[11px] rounded-[1px] border-2 border-current bg-[#F5F5F8]" />
            <span className="absolute left-[4px] top-[1px] h-[15px] w-[11px] rounded-[1px] border-2 border-current bg-[#F5F5F8]" />
          </button>
        </div>
      </main>
    </div>
  );
}

function TreeEditRequestTeamsContent() {
  return (
    <div className="flex h-full flex-col bg-white">
      <AdminSubHeader title="나무 수정 요청" backTo={ROUTES.ADMIN} />
      <main className="px-5 pt-10">
        <LocationLine />
        <div className="mt-7 grid grid-cols-2 gap-x-4 gap-y-5">
          {teamRequests.map((team, index) => (
            <Link
              key={team}
              to={`${ROUTES.ADMIN_TREE_EDIT_REQUESTS}/team-${index + 1}`}
              className="flex h-[100px] items-center rounded-[22px] bg-[#F5F5F8] px-5 transition-colors hover:bg-[#ECECEF]"
            >
              <span className="flex-1 text-[16px] font-bold text-[#111111]">{team}</span>
              <img src={RightArrowIcon} alt="" className="h-5 w-5 opacity-70" />
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}

function TreeEditRequestListContent({ teamId }) {
  return (
    <div className="flex h-full flex-col bg-white">
      <AdminSubHeader title="나무 수정 요청" backTo={ROUTES.ADMIN_TREE_EDIT_REQUESTS} />
      <main className="px-5 pt-10">
        <LocationLine />
        <div className="mt-7 space-y-4">
          {editRequests.map(request => (
            <Link
              key={request.id}
              to={`${ROUTES.ADMIN_TREE_EDIT_REQUESTS}/${teamId}/${request.id}`}
              className="flex h-[56px] items-center rounded-[15px] bg-[#F5F5F8] px-4 transition-colors hover:bg-[#ECECEF]"
            >
              <img src={PencilIcon} alt="" className="h-6 w-6 shrink-0" />
              <span className="ml-5 flex-1 text-[15px] font-bold text-[#111111]">{request.name}</span>
              <img src={RightArrowIcon} alt="" className="h-5 w-5 opacity-70" />
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}

function ReviewField({ label, value, unit }) {
  return (
    <label className="block">
      <span className="mb-2 block text-[14px] font-bold text-[#797979]">{label}</span>
      <span className="flex h-[54px] items-center rounded-[14px] bg-[#F5F5F8] px-4">
        <input value={value} readOnly className="min-w-0 flex-1 bg-transparent text-[15px] font-semibold outline-none" />
        {unit && <span className="ml-3 text-[14px] font-semibold text-[#797979]">{unit}</span>}
      </span>
    </label>
  );
}

function MapPreview() {
  return (
    <div className="relative h-[170px] overflow-hidden rounded-[2px] bg-[#EEF0F2]">
      <div className="absolute left-[-24px] top-7 h-8 w-[380px] rotate-[-13deg] bg-white" />
      <div className="absolute left-8 top-[-30px] h-[240px] w-8 rotate-[-14deg] bg-white" />
      <div className="absolute left-[132px] top-[82px] h-7 w-7 rounded-full bg-[#169500]" />
      <span className="absolute bottom-6 left-5 text-[10px] font-bold text-[#F28C1B]">11호관커피숍</span>
    </div>
  );
}

function TreeEditRequestDetailContent({ teamId }) {
  return (
    <div className="flex h-full flex-col bg-white">
      <AdminSubHeader title="나무 수정 요청" backTo={`${ROUTES.ADMIN_TREE_EDIT_REQUESTS}/${teamId}`} />
      <main className="flex-1 overflow-y-auto px-5 pb-7 pt-9 scrollbar-hide">
        <section>
          <h2 className="mb-4 text-[16px] font-bold text-[#111111]">좌표 등록을 해주세요</h2>
          <Link
            to={`${ROUTES.ADMIN_TREE_EDIT_REQUESTS}/${teamId}`}
            className="mb-4 flex h-[54px] items-center rounded-[14px] bg-[#F5F5F8] px-4"
          >
            <span className="flex-1 text-[15px] font-bold text-[#111111]">{requestDetail.coordinate}</span>
            <img src={RightArrowIcon} alt="" className="h-5 w-5 opacity-70" />
          </Link>
          <MapPreview />
        </section>

        <section className="mt-10">
          <h2 className="mb-4 text-[16px] font-bold text-[#111111]">나무 이름을 입력해주세요</h2>
          <Link
            to={`${ROUTES.ADMIN_TREE_EDIT_REQUESTS}/${teamId}`}
            className="flex h-[54px] items-center rounded-[14px] bg-[#F5F5F8] px-4"
          >
            <span className="flex-1 text-[15px] font-semibold text-[#111111]">{requestDetail.treeName}</span>
            <img src={RightArrowIcon} alt="" className="h-5 w-5 opacity-70" />
          </Link>
        </section>

        <section className="mt-10">
          <h2 className="mb-4 text-[16px] font-bold text-[#111111]">나무 정보를 입력해주세요</h2>
          <div className="space-y-4">
            <ReviewField label="흉고직경" value={requestDetail.breastHeight} unit="cm" />
            <ReviewField label="수고" value={requestDetail.height} unit="cm" />
            <ReviewField label="수관폭" value={requestDetail.crownWidth} unit="cm" />
            <ReviewField label="지하고" value={requestDetail.branchHeight} unit="cm" />
          </div>
        </section>

        <div className="mt-8 grid grid-cols-2 gap-3">
          <button type="button" className="h-[48px] rounded-[14px] bg-[#F5F5F8] text-[15px] font-bold text-[#797979]">
            반려하기
          </button>
          <button type="button" className="h-[48px] rounded-[14px] bg-[#169500] text-[15px] font-bold text-white">
            승인하기
          </button>
        </div>
      </main>
    </div>
  );
}

export default function AdminContent() {
  const { pathname } = useLocation();
  const treeEditPath = pathname.replace(`${ROUTES.ADMIN_TREE_EDIT_REQUESTS}/`, '');
  const treeEditSegments = treeEditPath === pathname ? [] : treeEditPath.split('/').filter(Boolean);

  if (pathname === ROUTES.ADMIN_VOLUNTEER_INVITE) {
    return <VolunteerInviteContent />;
  }

  if (pathname === ROUTES.ADMIN_TREE_EDIT_REQUESTS) {
    return <TreeEditRequestTeamsContent />;
  }

  if (treeEditSegments.length === 1) {
    return <TreeEditRequestListContent teamId={treeEditSegments[0]} />;
  }

  if (treeEditSegments.length >= 2) {
    return <TreeEditRequestDetailContent teamId={treeEditSegments[0]} />;
  }

  return (
    <div className="flex h-full flex-col bg-white">
      <header className="relative flex h-[92px] shrink-0 items-center justify-center bg-[#169500] px-6">
        <Link
          to={ROUTES.PROFILE}
          aria-label="프로필 페이지로 돌아가기"
          className="absolute left-6 flex h-11 w-11 items-center justify-center rounded-full transition-colors hover:bg-white/10"
        >
          <img src={WhiteLeftArrow} alt="" className="h-6 w-6" />
        </Link>
        <h1 className="text-[20px] font-bold text-white">관리자 페이지</h1>
      </header>

      <section className="grid grid-cols-2 px-8 pb-8 pt-16 text-center">
        <div>
          <p className="text-[17px] font-bold text-[#111111]">신규 나무 요청</p>
          <p className="mt-2 text-[36px] font-extrabold leading-none text-[#169500]">
            10<span className="ml-1 align-middle text-[16px] font-medium text-[#4B4B4B]">건</span>
          </p>
        </div>
        <div>
          <p className="text-[17px] font-bold text-[#111111]">나무 정보 수정 요청</p>
          <p className="mt-2 text-[36px] font-extrabold leading-none text-[#169500]">
            05<span className="ml-1 align-middle text-[16px] font-medium text-[#4B4B4B]">건</span>
          </p>
        </div>
      </section>

      <main className="mt-32 px-6">
        <p className="mb-5 text-right text-[17px] font-bold tracking-[0.18em] text-[#797979]">2026.01.19</p>
        <div className="space-y-5">
          {adminActions.map(item => (
            <AdminActionRow key={item.label} item={item} />
          ))}
        </div>
      </main>
    </div>
  );
}
