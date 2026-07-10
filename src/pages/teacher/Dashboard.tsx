import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarDays, MapPin, Clock, BookOpen, ChevronRight, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { classApi } from '../../api/class.api';
import { toast } from 'sonner';

export default function Dashboard() {
  const [classes, setClasses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const data = await classApi.getMyClasses();
        setClasses(Array.isArray(data) ? data : []);
      } catch (error: any) {
        toast.error(error.message || 'Lỗi khi tải danh sách lớp học');
      } finally {
        setIsLoading(false);
      }
    };
    fetchClasses();
  }, []);

  const handleStartAttendance = (classId: string, scheduleId: string) => {
    // Điều hướng sang trang QR kèm theo ID qua query params
    navigate(`/teacher/session?classId=${classId}&scheduleId=${scheduleId}`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 text-indigo-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Lịch Trình Hôm Nay</h2>
          <p className="text-slate-500 text-sm mt-1">Quản lý và mở phiên điểm danh cho các lớp của bạn.</p>
        </div>
        <Badge variant="secondary" className="px-3 py-1 text-sm bg-indigo-50 text-indigo-700">
          <CalendarDays className="h-4 w-4 mr-2" />
          {new Date().toLocaleDateString('vi-VN')}
        </Badge>
      </div>

      {classes.length === 0 ? (
        <Card className="bg-slate-50 border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BookOpen className="h-12 w-12 text-slate-300 mb-4" />
            <p className="text-slate-500">Bạn không có lịch dạy nào trong hôm nay.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {classes.map((cls) => (
            cls.schedules.map((schedule: any) => (
              <Card key={schedule.id} className="flex flex-col hover:shadow-md transition-shadow">
                <CardHeader className="pb-3 border-b bg-slate-50/50">
                  <div className="flex justify-between items-start mb-2">
                    <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
                      {cls.course.code}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg leading-tight">{cls.course.name}</CardTitle>
                  <CardDescription className="font-medium text-slate-600">{cls.name}</CardDescription>
                </CardHeader>
                <CardContent className="pt-4 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2 text-sm text-slate-600">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-slate-400" />
                      <span>{schedule.startTime} - {schedule.endTime}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-slate-400" />
                      <span>Phòng: <strong className="text-slate-700">{schedule.roomName}</strong></span>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                    onClick={() => handleStartAttendance(cls.id, schedule.id)}
                  >
                    Mở Điểm Danh <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </CardContent>
              </Card>
            ))
          ))}
        </div>
      )}
    </div>
  );
}