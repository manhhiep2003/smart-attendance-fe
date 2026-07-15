import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { toast } from 'sonner';

// Mock data lấy cảm hứng từ ảnh của bạn
const MOCK_STUDENTS = [
  { id: '1', code: 'SA180186', surname: 'Võ', middleName: 'Hoàng Hạnh', givenName: 'Dung', image: 'https://i.pravatar.cc/150?u=1' },
  { id: '2', code: 'SA210012', surname: 'Hoàng', middleName: 'Xuân', givenName: 'Khang', image: 'https://i.pravatar.cc/150?u=2' },
  { id: '3', code: 'SA210016', surname: 'Mai', middleName: 'Ngọc Minh', givenName: 'Hiền', image: 'https://i.pravatar.cc/150?u=3' },
  { id: '4', code: 'SE150442', surname: 'Phạm', middleName: 'Trường', givenName: 'Nam', image: 'https://i.pravatar.cc/150?u=4' },
];

export default function StudentGroup() {
  const { classId } = useParams();
  const navigate = useNavigate();
  
  // State lưu trạng thái điểm danh: Record<studentId, 'PRESENT' | 'ABSENT' | 'LATE'>
  const [attendanceState, setAttendanceState] = useState<Record<string, string>>({});

  const handleRadioChange = (studentId: string, status: string) => {
    setAttendanceState(prev => ({ ...prev, [studentId]: status }));
  };

  const handleSaveAttendance = () => {
    // Kịch bản: Kiểm tra xem đã điểm danh hết chưa
    const checkedCount = Object.keys(attendanceState).length;
    if (checkedCount < MOCK_STUDENTS.length) {
      toast.warning(`Bạn mới điểm danh ${checkedCount}/${MOCK_STUDENTS.length} sinh viên.`);
      return;
    }

    // Ở đây sẽ gọi API lưu xuống database
    console.log('Dữ liệu lưu:', attendanceState);
    toast.success('Đã lưu dữ liệu điểm danh thủ công thành công!');
    navigate(-1); // Quay lại trang detail
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 bg-white min-h-screen font-sans">
      <div className="flex items-center justify-between mb-6">
        <Button 
          variant="ghost" 
          className="text-slate-500 hover:text-slate-800 p-0"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Quay lại
        </Button>
        <Button onClick={handleSaveAttendance} className="bg-indigo-600 hover:bg-indigo-700">
          <Save className="h-4 w-4 mr-2" /> Lưu Điểm Danh
        </Button>
      </div>

      <h2 className="text-2xl font-bold text-slate-800 mb-2">Student List & Manual Attendance</h2>
      <p className="text-slate-500 mb-6">Class Group: <strong className="text-slate-700">SE172486</strong></p>

      <div className="overflow-x-auto border rounded-sm border-slate-300">
        <table className="w-full text-sm text-left border-collapse">
          <thead className="text-xs text-white bg-[#5b7bc0]">
            <tr>
              <th className="px-4 py-3 border-r border-slate-300 w-16">INDEX</th>
              <th className="px-4 py-3 border-r border-slate-300 w-24">IMAGE</th>
              <th className="px-4 py-3 border-r border-slate-300 w-32">MEMBER CODE</th>
              <th className="px-4 py-3 border-r border-slate-300">SURNAME</th>
              <th className="px-4 py-3 border-r border-slate-300">MIDDLE NAME</th>
              <th className="px-4 py-3 border-r border-slate-300">GIVEN NAME</th>
              <th className="px-4 py-3 text-center min-w-50">ATTENDANCE</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_STUDENTS.map((student, index) => (
              <tr key={student.id} className="border-b border-slate-200 hover:bg-slate-50">
                <td className="px-4 py-4 border-r border-slate-200">{index + 1}</td>
                <td className="px-4 py-4 border-r border-slate-200">
                  <img src={student.image} alt={student.givenName} className="w-16 h-20 object-cover border border-slate-300 rounded-sm" />
                </td>
                <td className="px-4 py-4 border-r border-slate-200 font-medium text-slate-700">{student.code}</td>
                <td className="px-4 py-4 border-r border-slate-200">{student.surname}</td>
                <td className="px-4 py-4 border-r border-slate-200">{student.middleName}</td>
                <td className="px-4 py-4 border-r border-slate-200 font-semibold">{student.givenName}</td>
                <td className="px-4 py-4 align-middle">
                  <div className="flex justify-center items-center gap-4">
                    <label className="flex items-center gap-1 cursor-pointer">
                      <input 
                        type="radio" 
                        name={`attendance-${student.id}`} 
                        className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
                        onChange={() => handleRadioChange(student.id, 'PRESENT')}
                        checked={attendanceState[student.id] === 'PRESENT'}
                      />
                      <span className="text-emerald-700 font-medium">Attended</span>
                    </label>
                    <label className="flex items-center gap-1 cursor-pointer">
                      <input 
                        type="radio" 
                        name={`attendance-${student.id}`} 
                        className="w-4 h-4 text-rose-600 focus:ring-rose-500"
                        onChange={() => handleRadioChange(student.id, 'ABSENT')}
                        checked={attendanceState[student.id] === 'ABSENT'}
                      />
                      <span className="text-rose-700 font-medium">Absent</span>
                    </label>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}