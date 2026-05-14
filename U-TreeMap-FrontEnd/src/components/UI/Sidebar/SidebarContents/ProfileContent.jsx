import { Link, useLocation } from 'react-router-dom';
import SidebarLayout from './SidebarLayout';
import PencilIcon from '../../../../assets/icons/pencil.svg';
import UserIcon from '../../../../assets/icons/user.svg';
import TreeIcon from '../../../../assets/icons/tree.svg';
import RightArrowIcon from '../../../../assets/icons/right_arrow.svg';
import XIcon from '../../../../assets/icons/x.svg';
import { ROUTES } from '../../../../routes/routePaths';

const profile = {
  name: '김땡땡나무',
  phone: '010-1234-5678',
  email: 'rkdus6541@gmail.com',
};

const menuItems = [
  { label: '내 정보', icon: PencilIcon, to: ROUTES.PROFILE_INFO },
  { label: '관리자 페이지', icon: UserIcon, to: ROUTES.ADMIN },
  { label: '자원봉사자 페이지', icon: UserIcon, to: ROUTES.VOLUNTEER },
  { label: '즐겨찾기한 나무', icon: TreeIcon, to: ROUTES.MY_TREES },
  { label: '로그아웃', icon: RightArrowIcon },
];

function ProfileAvatar({ size = 'large', showCamera = false }) {
  const avatarSize = size === 'large' ? 'h-[104px] w-[104px] rounded-[34px]' : 'h-[96px] w-[96px] rounded-[32px]';

  return (
    <div className="relative mx-auto w-fit">
      <div className={`relative bg-[#169500] ${avatarSize}`}>
        <span className="absolute left-[36%] top-[42%] h-2.5 w-2.5 rounded-full bg-white" />
        <span className="absolute right-[31%] top-[42%] h-2.5 w-2.5 rounded-full bg-white" />
        <span className="absolute left-1/2 top-[60%] h-[15px] w-[36px] -translate-x-1/2 rounded-b-full border-b-[5px] border-white" />
      </div>
      {showCamera && (
        <button
          type="button"
          aria-label="프로필 사진 변경"
          className="absolute -right-1 bottom-1 flex h-7 w-7 items-center justify-center rounded-[8px] bg-[#797979] shadow-sm"
        >
          <span className="relative block h-[14px] w-[17px] rounded-[3px] border-2 border-white">
            <span className="absolute left-1/2 top-1/2 h-[5px] w-[5px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white" />
            <span className="absolute -top-[5px] left-[3px] h-[4px] w-[8px] rounded-t-[2px] bg-white" />
          </span>
        </button>
      )}
    </div>
  );
}

function MenuRow({ item }) {
  const content = (
    <>
      <img src={item.icon} alt="" className="h-6 w-6 shrink-0" />
      <span className="ml-4 flex-1 text-[16px] font-semibold text-[#4B4B4B]">{item.label}</span>
      <img src={RightArrowIcon} alt="" className="h-5 w-5 shrink-0 opacity-70" />
    </>
  );

  if (item.to) {
    return (
      <Link
        to={item.to}
        className="flex h-[56px] w-full items-center rounded-[16px] bg-[#F5F5F8] px-4 text-left transition-colors hover:bg-[#ECECEF]"
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      type="button"
      className="flex h-[56px] w-full items-center rounded-[16px] bg-[#F5F5F8] px-4 text-left transition-colors hover:bg-[#ECECEF]"
    >
      {content}
    </button>
  );
}

function InfoField({ label, value }) {
  return (
    <label className="block">
      <span className="mb-3 block text-[16px] font-bold text-[#111111]">{label}</span>
      <span className="flex h-[50px] items-center rounded-[15px] bg-[#F5F5F8] px-4">
        <input
          value={value}
          readOnly
          className="min-w-0 flex-1 bg-transparent text-[16px] font-medium text-[#797979] outline-none"
        />
        <img src={XIcon} alt="" className="h-5 w-5 shrink-0 opacity-80" />
      </span>
    </label>
  );
}

export default function ProfileContent() {
  const { pathname } = useLocation();
  const isInfoView = pathname === ROUTES.PROFILE_INFO;
  const isEditView = pathname === ROUTES.PROFILE_EDIT;

  return (
    <SidebarLayout
      paddingStyles="px-[19px] pt-12.5 pb-1.5"
      headerContent={
        isEditView ? (
          <h1 className="mt-12 text-center text-[18px] font-bold text-[#2D2D2D]">내 정보 수정</h1>
        ) : null
      }
    >
      {isInfoView ? (
        <div className="px-[19px] pb-8 pt-9">
          <ProfileAvatar />
          <h1 className="mt-6 text-center text-[24px] font-extrabold text-[#111111]">{profile.name}</h1>
          <Link
            to={ROUTES.PROFILE_EDIT}
            className="mt-4 block text-center text-[12px] font-medium text-[#4B4B4B] hover:text-[#169500]"
          >
            내 정보 수정
          </Link>

          <dl className="mt-14 space-y-10">
            <div className="grid grid-cols-[86px_1fr] items-center">
              <dt className="text-[16px] font-bold text-[#797979]">이름</dt>
              <dd className="text-[16px] font-bold text-[#111111]">{profile.name}</dd>
            </div>
            <div className="grid grid-cols-[86px_1fr] items-center">
              <dt className="text-[16px] font-bold text-[#797979]">휴대폰번호</dt>
              <dd className="text-[16px] font-bold text-[#111111]">{profile.phone}</dd>
            </div>
            <div className="grid grid-cols-[86px_1fr] items-center">
              <dt className="text-[16px] font-bold text-[#797979]">이메일주소</dt>
              <dd className="break-all text-[16px] font-bold text-[#111111]">{profile.email}</dd>
            </div>
          </dl>
        </div>
      ) : isEditView ? (
        <div className="flex min-h-full flex-col px-[19px] pb-7 pt-9">
          <ProfileAvatar size="small" showCamera />

          <div className="mt-9 space-y-7">
            <InfoField label="이름" value={profile.name} />
            <InfoField label="휴대폰번호" value={profile.phone} />
            <InfoField label="이메일주소" value={profile.email} />
          </div>

          <button
            type="button"
            className="mt-auto h-[50px] w-full rounded-[15px] bg-[#169500] text-[15px] font-bold text-white transition-colors hover:bg-[#127D00]"
          >
            수정하기
          </button>
        </div>
      ) : (
        <div className="px-[19px] pb-8 pt-8">
          <ProfileAvatar />
          <h1 className="mt-6 text-center text-[20px] font-extrabold text-[#111111]">{profile.name}</h1>

          <div className="mt-8 space-y-4">
            {menuItems.map(item => (
              <MenuRow key={item.label} item={item} />
            ))}
          </div>
        </div>
      )}
    </SidebarLayout>
  );
}
