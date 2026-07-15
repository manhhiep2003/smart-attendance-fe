import { useState, useEffect } from 'react';
import { format, startOfWeek, addDays } from 'date-fns';
import { vi } from 'date-fns/locale';
import { classApi } from '../../api/class.api';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';

const SLOTS = [
  { id: 1, name: 'Slot 1', time: '07:30 - 09:50' },
  { id: 2, name: 'Slot 2', time: '10:00 - 12:20' },
  { id: 3, name: 'Slot 3', time: '12:50 - 15:10' },
  { id: 4, name: 'Slot 4', time: '15:20 - 17:40' },
  { id: 5, name: 'Slot 5', time: '17:50 - 20:10' },
  { id: 6, name: 'Slot 6', time: '20:20 - 22:40' },
];


export default function Timetable() {
  const [classes, setClasses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const navigate = useNavigate();

  // Xử lý logic ngày tháng cho tuần hiện tại
  const [currentDate, setCurrentDate] = useState(new Date());
  const startOfCurrentWeek = startOfWeek(currentDate, { weekStartsOn: 1 });

  // Sinh mảng 7 ngày trong tuần
  const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(startOfCurrentWeek, i));

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const data = await classApi.getMyClasses();
        setClasses(Array.isArray(data) ? data : []);
      } catch (error: any) {
        toast.error('Không thể tải lịch học');
      } finally {
        setIsLoading(false);
      }
    };
    fetchSchedule();
  }, []);

  // Hàm helper để tìm môn học có trong Slot và Ngày tương ứng không
  const getScheduleForSlotAndDay = (slotTime: string, dayIndex: number) => {
    // dayIndex của date-fns: 0 (Sun), 1 (Mon), ..., 6 (Sat)
    // Cần map cẩn thận với dayOfWeek lưu trong DB của bạn
    for (const cls of classes) {
      for (const schedule of cls.schedules) {
        // Giả sử DB lưu startTime giống với Slot time hoặc bạn quy ước ngầm
        // Ở đây so sánh tạm bằng dayOfWeek (0: CN, 1: T2...)
        const dbDay = schedule.dayOfWeek;
        const currentDayIndex = weekDays[dayIndex].getDay();
        
        // Tạm mapping qua startTime để xác định Slot (Cần điều chỉnh theo dữ liệu thật của bạn)
        const isSameSlot = schedule.startTime === slotTime.split(' - ')[0]; 
        
        if (dbDay === currentDayIndex && isSameSlot) {
          return { ...schedule, courseCode: cls.course.code, className: cls.name };
        }
      }
    }
    return null;
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 text-indigo-500 animate-spin" /></div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-4 bg-white min-h-screen">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Lịch Giảng Dạy (Timetable)</h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-slate-600">NĂM</span>
            <Select defaultValue="2026">
              <SelectTrigger className="w-24 h-8 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="2026">2026</SelectItem></SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-slate-600">TUẦN</span>
            <Select defaultValue="current">
              <SelectTrigger className="w-45 h-8 text-xs">
                <SelectValue placeholder="Chọn tuần" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="current">
                  {format(weekDays[0], 'dd/MM')} To {format(weekDays[6], 'dd/MM')}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Bảng Thời Khóa Biểu (Mô phỏng FAP Portal) */}
      <div className="overflow-x-auto border rounded-sm border-slate-300">
        <table className="w-full text-sm text-left border-collapse">
          <thead className="text-xs text-white bg-[#5b7bc0]">
            <tr>
              <th className="px-3 py-2 border-r border-slate-300 w-24"></th>
              {weekDays.map((date, index) => (
                <th key={index} className="px-3 py-2 border-r border-slate-300 font-semibold min-w-30">
                  <div className="uppercase">{format(date, 'EEE', { locale: vi })}</div>
                  <div className="text-slate-200 font-normal">{format(date, 'dd/MM')}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {SLOTS.map((slot) => (
              <tr key={slot.id} className="border-b border-slate-200 hover:bg-slate-50">
                <td className="px-3 py-3 border-r border-slate-200 font-medium text-slate-600 bg-slate-50">
                  {slot.name}
                </td>
                {weekDays.map((_, dayIndex) => {
                  const schedule = getScheduleForSlotAndDay(slot.time, dayIndex);
                  
                  return (
                    <td key={dayIndex} className="px-3 py-3 border-r border-slate-200 text-center align-top relative group">
                      {schedule ? (
                        <div 
                          className="flex flex-col items-center justify-center cursor-pointer p-1 rounded hover:bg-indigo-50"
                          onClick={() => navigate(`/teacher/activity/${schedule.id}`)}
                        >
                          <span className="text-[#337ab7] font-semibold hover:underline">
                            {schedule.courseCode}
                          </span>
                          <span className="text-[11px] text-slate-500 bg-slate-200 px-1.5 py-0.5 rounded mt-1">
                            tại {schedule.roomName}
                          </span>
                          <span className="text-[10px] text-emerald-600 font-bold mt-1">
                            ({schedule.startTime}-{schedule.endTime})
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-300">-</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 text-xs text-slate-600 space-y-2">
        <p><strong>Chú thích thêm:</strong></p>
        <ul className="list-disc pl-5 space-y-1">
          {/* <li>(<span className="text-emerald-600 font-semibold">attended</span>): Giảng viên đã điểm danh thành công buổi này.</li>
          <li>(<span className="text-rose-600 font-semibold">absent</span>): Giảng viên chưa/vắng mặt buổi này.</li> */}
          <li>(-): Chưa có dữ liệu hoặc không có lịch.</li>
        </ul>
      </div>
    </div>
  );
}