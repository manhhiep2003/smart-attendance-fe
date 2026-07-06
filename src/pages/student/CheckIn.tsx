import { useEffect, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { toast } from 'sonner';
import { MapPin, Camera, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { useGeolocation } from '../../hooks/useGeolocation';
import { attendanceApi } from '../../api/attendance.api';

export default function CheckIn() {
  const [isScanning, setIsScanning] = useState(true);
  const [checkInStatus, setCheckInStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [resultMessage, setResultMessage] = useState('');
  const [distanceInfo, setDistanceInfo] = useState('');

  const { lat, lng, error: gpsError, loading: gpsLoading } = useGeolocation(false);

  useEffect(() => {
    if (!isScanning) return;

    const scanner = new Html5QrcodeScanner(
      'qr-reader',
      { fps: 10, qrbox: { width: 250, height: 250 } },
      false
    );

    const onScanSuccess = async (decodedText: string) => {
      scanner.clear();
      setIsScanning(false);
      setCheckInStatus('loading');

      try {
        const qrData = JSON.parse(decodedText);
        if (!qrData.sessionId || !qrData.token) throw new Error('Mã QR không đúng định dạng.');
        if (!lat || !lng) throw new Error('Chưa lấy được tọa độ GPS.');

        const response = await attendanceApi.checkIn({
          sessionId: qrData.sessionId,
          qrCodeToken: qrData.token,
          studentLat: lat,
          studentLng: lng,
        });

        setCheckInStatus('success');
        setResultMessage(response.message);
        setDistanceInfo(response.distance);
        toast.success(`Thành công! Khoảng cách: ${response.distance}`);
      } catch (error: any) {
        setCheckInStatus('error');
        const errorMsg = error?.message || 'Có lỗi xảy ra.';
        setResultMessage(errorMsg);
        toast.error(errorMsg);
      }
    };

    scanner.render(onScanSuccess, (err) => {});

    return () => {
      scanner.clear().catch(console.error);
    };
  }, [isScanning, lat, lng]);

  return (
    <Card className="w-full shadow-md border-0 sm:border">
      <CardHeader className="bg-slate-900 text-white rounded-t-xl sm:rounded-t-lg">
        <CardTitle className="text-lg flex items-center gap-2">
          <Camera className="h-5 w-5" /> Quét Mã Điểm Danh
        </CardTitle>
        <CardDescription className="text-slate-300">
          Hướng camera về phía màn hình của giảng viên
        </CardDescription>
      </CardHeader>
      
      <div className="p-3 border-b bg-slate-50 flex items-center justify-between text-sm">
        <div className="flex items-center gap-1.5 text-slate-600 font-medium">
          <MapPin className="h-4 w-4 text-indigo-500" /> GPS:
        </div>
        <div>
          {gpsLoading ? (
            <span className="flex items-center gap-1.5 text-amber-600 text-xs font-medium">
              <Loader2 className="h-3 w-3 animate-spin" /> Đang lấy...
            </span>
          ) : gpsError ? (
            <span className="text-rose-500 text-xs font-medium">{gpsError}</span>
          ) : (
            <Badge variant="outline" className="text-emerald-600 bg-emerald-50 font-mono">
              {lat?.toFixed(4)}, {lng?.toFixed(4)}
            </Badge>
          )}
        </div>
      </div>

      <CardContent className="p-6">
        {isScanning ? (
          <div className="flex flex-col items-center">
            <div id="qr-reader" className="w-full mx-auto rounded-lg overflow-hidden border-2 border-indigo-100 shadow-inner"></div>
            <p className="text-xs text-slate-500 mt-4 text-center">
              Mã QR sẽ thay đổi liên tục. Không chụp ảnh màn hình.
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center py-6">
            {checkInStatus === 'loading' && (
              <>
                <Loader2 className="h-12 w-12 text-indigo-500 animate-spin mb-4" />
                <h3 className="text-lg font-semibold text-slate-700">Đang đối soát dữ liệu...</h3>
              </>
            )}

            {checkInStatus === 'success' && (
              <>
                <CheckCircle className="h-14 w-14 text-emerald-500 mb-3" />
                <h3 className="text-xl font-bold text-slate-800 mb-1">Hợp Lệ!</h3>
                <p className="text-slate-600 text-sm mb-3">{resultMessage}</p>
                <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 px-3 py-1 text-sm">
                  Khoảng cách: {distanceInfo}
                </Badge>
              </>
            )}

            {checkInStatus === 'error' && (
              <>
                <XCircle className="h-14 w-14 text-rose-500 mb-3" />
                <h3 className="text-xl font-bold text-slate-800 mb-1">Thất Bại</h3>
                <p className="text-rose-600 text-sm bg-rose-50 p-3 rounded-md border border-rose-100 w-full mb-5">
                  {resultMessage}
                </p>
                <Button 
                  onClick={() => {
                    setIsScanning(true);
                    setCheckInStatus('idle');
                  }}
                  className="w-full"
                >
                  Thử quét lại
                </Button>
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}