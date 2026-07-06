import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Play, Square, MapPin, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { sessionApi } from '../../api/session.api';
import { useSocket } from '../../hooks/useSocket';
import { toast } from 'sonner';

export default function SessionHost() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isStarting, setIsStarting] = useState(false);
  
  // Custom hook tự động lo việc kết nối Socket và lắng nghe mã QR mới
  const { isConnected, currentQrToken } = useSocket(sessionId);

  // Mock data (sau này lấy từ state/router)
  const classId = 'class-123';
  const scheduleId = 'schedule-456';
  const radiusLimit = 50;

  const handleStartSession = () => {
    setIsStarting(true);
    if (!navigator.geolocation) {
      toast.error('Trình duyệt không hỗ trợ GPS');
      setIsStarting(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const res = await sessionApi.startSession({
            classId,
            scheduleId,
            lat: latitude,
            lng: longitude,
            radius: radiusLimit,
          });
          
          setSessionId(res.id);
          toast.success('Đã mở phiên điểm danh thành công!');
        } catch (error: any) {
          toast.error(error.message || 'Lỗi khi mở phiên');
        } finally {
          setIsStarting(false);
        }
      },
      (error) => {
        toast.error('Không thể lấy vị trí: ' + error.message);
        setIsStarting(false);
      },
      { enableHighAccuracy: true }
    );
  };

  const handleStopSession = async () => {
    if (!sessionId) return;
    try {
      await sessionApi.stopSession(sessionId);
      setSessionId(null);
      toast.info('Đã đóng phiên điểm danh.');
    } catch (error: any) {
      toast.error(error.message || 'Lỗi khi đóng phiên');
    }
  };

  const isSessionActive = !!sessionId;

  return (
    <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-6">
      
      {/* Cột trái: Điều khiển */}
      <Card className="md:col-span-5 flex flex-col">
        <CardHeader>
          <CardTitle>Quản Lý Điểm Danh</CardTitle>
          <CardDescription>Môn: Cấu trúc dữ liệu và Giải thuật</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center bg-slate-50 p-3 rounded-lg border">
              <span className="text-sm font-medium text-slate-600 flex items-center gap-2">
                <MapPin className="h-4 w-4" /> Bán kính hợp lệ
              </span>
              <Badge variant="secondary">{radiusLimit} mét</Badge>
            </div>
            
            <div className="flex justify-between items-center bg-slate-50 p-3 rounded-lg border">
              <span className="text-sm font-medium text-slate-600 flex items-center gap-2">
                <Clock className="h-4 w-4" /> Thời gian đổi QR
              </span>
              <Badge variant="secondary">5 giây</Badge>
            </div>

            <div className="flex items-center gap-2 mt-4">
              <span className="text-sm font-medium text-slate-600">Trạng thái Socket:</span>
              {isSessionActive ? (
                isConnected ? (
                  <Badge className="bg-emerald-500 hover:bg-emerald-600">Đã kết nối (Live)</Badge>
                ) : (
                  <Badge variant="destructive">Đang kết nối lại...</Badge>
                )
              ) : (
                <Badge variant="outline">Chờ khởi động</Badge>
              )}
            </div>
          </div>

          {!isSessionActive ? (
            <Button 
              size="lg" 
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
              onClick={handleStartSession}
              disabled={isStarting}
            >
              {isStarting ? 'Đang khởi tạo...' : (
                <><Play className="h-4 w-4 mr-2" /> Bắt Đầu Điểm Danh</>
              )}
            </Button>
          ) : (
            <Button 
              size="lg" 
              variant="destructive"
              className="w-full"
              onClick={handleStopSession}
            >
              <Square className="h-4 w-4 mr-2" /> Kết Thúc Phiên
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Cột phải: Màn hình QR */}
      <Card className="md:col-span-7 flex flex-col items-center justify-center p-8 bg-slate-50/50">
        {isSessionActive && currentQrToken ? (
          <div className="flex flex-col items-center animate-in zoom-in duration-300">
            <h3 className="text-lg font-bold text-slate-800 mb-2">Sinh viên quét mã bên dưới</h3>
            <p className="text-sm text-slate-500 text-center mb-6">
              Mã QR tự động thay đổi sau mỗi 5 giây.<br/>
              Tuyệt đối không chụp ảnh màn hình gửi cho người khác.
            </p>
            
            <div className="bg-white p-4 rounded-2xl shadow-lg border-2 border-indigo-100">
              <QRCodeSVG 
                value={JSON.stringify({ sessionId, token: currentQrToken })} 
                size={280} 
                level="H" 
              />
            </div>
          </div>
        ) : (
          <div className="text-center opacity-40">
            <QRCodeSVG value="placeholder" size={200} fgColor="#cbd5e1" className="mb-4 blur-[2px] mx-auto" />
            <p className="text-slate-600 font-medium">Chưa có phiên điểm danh nào</p>
          </div>
        )}
      </Card>
    </div>
  );
}