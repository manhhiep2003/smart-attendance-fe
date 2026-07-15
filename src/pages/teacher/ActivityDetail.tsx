import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Video } from 'lucide-react';
import { Button } from '../../components/ui/button';

export default function ActivityDetail() {
  const { scheduleId } = useParams();
  const navigate = useNavigate();

  const activityData = {
    date: 'Wednesday 15/07/2026',
    slot: '5',
    studentGroup: 'SE1856',
    instructor: 'YenVTK',
    course: 'Software Architecture and Design (SEP490)',
    courseSessionNumber: '19',
    attendance: 'Not yet',
    recordTime: '-',
    classId: '3243c787-3701-4179-87f7-acb5780f65c8',
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 bg-white min-h-screen font-sans">
      <Button 
        variant="ghost" 
        className="mb-6 text-slate-500 hover:text-slate-800 p-0"
        onClick={() => navigate('/teacher/timetable')}
      >
        <ArrowLeft className="h-4 w-4 mr-2" /> Quay lại Thời khóa biểu
      </Button>

      <h2 className="text-3xl font-normal text-slate-800 mb-8 border-b pb-4">Activity detail</h2>

      <div className="grid grid-cols-[200px_1fr] gap-y-4 text-sm text-slate-700">
        <div className="font-medium">Date:</div>
        <div>{activityData.date}</div>

        <div className="font-medium">Slot:</div>
        <div>{activityData.slot}</div>

        <div className="font-medium">Student group:</div>
        <div>
          {/* Link chuyển sang trang danh sách sinh viên / điểm danh thủ công */}
          <Link 
            to={`/teacher/student-group/${activityData.classId}`}
            className="text-blue-600 hover:underline font-medium"
          >
            {activityData.studentGroup}
          </Link>
        </div>

        <div className="font-medium pt-2">Instructor:</div>
        <div className="flex items-center gap-2 pt-2">
          <span className="text-blue-600 hover:underline cursor-pointer">{activityData.instructor}</span>
          <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white h-7 px-3 text-xs">
            <Video className="h-3 w-3 mr-1" /> MeetURL
          </Button>
        </div>

        <div className="font-medium border-t pt-4 mt-2">Course:</div>
        <div className="border-t pt-4 mt-2">{activityData.course}</div>

        <div className="font-medium">Course session number:</div>
        <div>{activityData.courseSessionNumber}</div>

        <div className="font-medium">Course session type:</div>
        <div></div>

        <div className="font-medium">Course session description:</div>
        <div></div>

        <div className="font-medium">Campus/Programme:</div>
        <div></div>

        <div className="font-medium">Attendance:</div>
        <div className={activityData.attendance === 'Not yet' ? 'text-rose-600 font-medium' : 'text-emerald-600 font-medium'}>
          {activityData.attendance}
        </div>

        <div className="font-medium">Record time:</div>
        <div>{activityData.recordTime}</div>
      </div>
    </div>
  );
}