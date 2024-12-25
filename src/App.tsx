import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./Sample.css";

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];
type Holiday = {
  year?: number; // 특정 연도를 지정하지 않으면 매년 반복되는 공휴일로 간주
  month: number;
  day: number;
  name: string;
};
const holidays: Holiday[] = [
  { month: 1, day: 1, name: "New Year's Day" }, // 매년 1월 1일
  { month: 7, day: 4, name: "Independence Day" }, // 매년 7월 4일
  { month: 12, day: 25, name: "Christmas Day" }, // 매년 12월 25일
];

// 임시 공휴일 설정 (특정 연도에만 적용되는 날짜)
const temporaryHolidays: Holiday[] = [
  { year: 2024, month: 5, day: 1, name: "Labour Day (2024)" },
  { year: 2024, month: 10, day: 9, name: "National Holiday (2024)" },
];

function App() {
  const [date, setDate] = useState<Value>(new Date());
  console.log(date);

  // 한국 시간으로 변환한 날짜를 'YYYY-MM-DD' 형식으로 반환하는 함수
  const convertToKST = (date: Date): Date => {
    const offset = 9 * 60; // 한국 시간대 (UTC +9)
    const localTime = new Date(date.getTime() + offset * 60 * 1000); // KST로 변환
    return localTime;
  };

  const isHoliday = (date: Date): boolean => {
    const kstDate = convertToKST(date); // 한국 시간으로 변환
    const month = kstDate.getMonth() + 1; // 0-based에서 1-based로 조정
    const day = kstDate.getDate();
    const year = kstDate.getFullYear();
    // 매년 반복되는 공휴일을 체크
    const recurringHoliday = holidays.some(
      (holiday) => holiday.month === month && holiday.day === day
    );

    // 임시 공휴일을 체크 (특정 연도에만 적용)
    const temporaryHoliday = temporaryHolidays.some(
      (holiday) =>
        holiday.year === year && holiday.month === month && holiday.day === day
    );

    return recurringHoliday || temporaryHoliday;
  };

  // 공휴일 날짜에 클래스를 추가하는 함수
  const tileClassName = ({ date }: { date: Date }): string | null => {
    const kstDate = convertToKST(date); // 한국 시간으로 변환
    const dayOfWeek = kstDate.getDay(); // 0 = 일요일, 6 = 토요일
    if (isHoliday(date)) {
      return "holiday"; // 공휴일
    }

    if (dayOfWeek === 0) {
      return "sunday"; // 일요일
    }

    if (dayOfWeek === 6) {
      return "saturday"; // 토요일
    }

    return null; // 다른 날짜는 추가 클래스 없음
  };

  const tileContent = ({
    date,
    view,
  }: {
    date: Date;
    view: string;
  }): JSX.Element | null => {
    if (view === "month") {
      // 월 뷰에서 날짜만 표시하고 "일" 없이 커스터마이즈된 텍스트를 반환
      const day = date.getDate();
      return <div className='custom-text'>{day}</div>;
    }
    return null; // 다른 뷰에서는 기본 콘텐츠 유지
  };
  const formatMonthYear = (_: string | undefined, date: Date): string => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // 월은 0부터 시작하므로 +1 필요
    return `${year}.${month}`;
  };
  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // 월은 0부터 시작하므로 +1
    const day = date.getDate().toString().padStart(2, "0");

    return `${year}-${month}-${day}`;
  };
  return (
    <div className='Sample'>
      <header>
        <h1>react-calendar sample page</h1>
      </header>
      <div className='Sample__container'>
        <main className='Sample__container__content'>
          <Calendar
            onChange={setDate}
            value={date}
            tileClassName={tileClassName}
            tileContent={tileContent}
            formatMonthYear={formatMonthYear}
            calendarType='hebrew'
          />
        </main>
      </div>
      <p className='text-center'>
        <span className='bold'>Selected Date:</span>{" "}
        {date ? formatDate(new Date(date.toString())) : "No date selected"}
      </p>
    </div>
  );
}

export default App;
