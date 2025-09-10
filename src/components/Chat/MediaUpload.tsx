import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  Upload, 
  Image, 
  Video, 
  Mic, 
  DollarSign, 
  X,
  Play,
  Pause
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MediaUploadProps {
  onUpload: (file: File, price?: number, caption?: string) => void;
  onCancel: () => void;
  isCreator: boolean;
}

export default function MediaUpload({ onUpload, onCancel, isCreator }: MediaUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [price, setPrice] = useState<string>('');
  const [caption, setCaption] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file size (max 50MB)
    if (file.size > 50 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select a file smaller than 50MB",
        variant: "destructive",
      });
      return;
    }

    setSelectedFile(file);
    
    // Create preview for images and videos
    if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
      const url = URL.createObjectURL(file);
      setPreview(url);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: BlobPart[] = [];

      recorder.ondataavailable = (event) => {
        chunks.push(event.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        const file = new File([blob], `voice-message-${Date.now()}.webm`, { type: 'audio/webm' });
        setSelectedFile(file);
        stream.getTracks().forEach(track => track.stop());
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
    } catch (error) {
      toast({
        title: "Recording failed",
        description: "Could not access microphone",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      setIsRecording(false);
      setMediaRecorder(null);
    }
  };

  const handleUpload = () => {
    if (!selectedFile) return;

    const priceValue = isCreator && price ? parseFloat(price) : undefined;
    onUpload(selectedFile, priceValue, caption);
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return <Image className="w-5 h-5" />;
    if (file.type.startsWith('video/')) return <Video className="w-5 h-5" />;
    if (file.type.startsWith('audio/')) return <Mic className="w-5 h-5" />;
    return <Upload className="w-5 h-5" />;
  };

  return (
    <Card className="w-full">
      <CardContent className="p-4 space-y-4">
        {/* File Selection */}
        {!selectedFile && (
          <div className="space-y-3">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*,audio/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="h-12"
              >
                <Image className="w-4 h-4 mr-2" />
                Photo/Video
              </Button>
              
              <Button
                variant="outline"
                onClick={isRecording ? stopRecording : startRecording}
                className={`h-12 ${isRecording ? 'bg-destructive text-destructive-foreground' : ''}`}
              >
                {isRecording ? (
                  <>
                    <Pause className="w-4 h-4 mr-2" />
                    Stop
                  </>
                ) : (
                  <>
                    <Mic className="w-4 h-4 mr-2" />
                    Record
                  </>
                )}
              </Button>
            </div>

            {isRecording && (
              <div className="text-center">
                <Badge variant="destructive" className="animate-pulse">
                  Recording...
                </Badge>
              </div>
            )}
          </div>
        )}

        {/* File Preview */}
        {selectedFile && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getFileIcon(selectedFile)}
                <span className="text-sm font-medium truncate">
                  {selectedFile.name}
                </span>
                <Badge variant="secondary">
                  {(selectedFile.size / 1024 / 1024).toFixed(1)}MB
                </Badge>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedFile(null);
                  setPreview(null);
                  setPrice('');
                  setCaption('');
                }}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Media Preview */}
            {preview && (
              <div className="w-full max-h-48 overflow-hidden rounded-lg bg-muted">
                {selectedFile.type.startsWith('image/') ? (
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : selectedFile.type.startsWith('video/') ? (
                  <video
                    src={preview}
                    controls
                    className="w-full h-full object-cover"
                  />
                ) : null}
              </div>
            )}

            {/* Caption */}
            <Textarea
              placeholder="Add a caption..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="min-h-[60px]"
            />

            {/* Pricing (Creator only) */}
            {isCreator && (
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-success" />
                <Input
                  type="number"
                  placeholder="0.00"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-24"
                  min="0"
                  step="0.01"
                />
                <span className="text-sm text-muted-foreground">
                  Set price for this media (optional)
                </span>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2">
              <Button onClick={handleUpload} className="flex-1">
                <Upload className="w-4 h-4 mr-2" />
                Send
                {isCreator && price && ` ($${price})`}
              </Button>
              <Button variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}