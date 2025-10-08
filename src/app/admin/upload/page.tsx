'use client';

import { useState } from 'react';

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<{ url: string; filename: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      setError('파일을 선택해주세요');
      return;
    }

    setUploading(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload-video', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setResult(data);
      } else {
        setError(data.error || '업로드 실패');
      }
    } catch (err) {
      setError('업로드 중 오류 발생');
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-foreground mb-8">
          비디오 업로드 (Vercel Blob)
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              비디오 파일 선택
            </label>
            <input
              type="file"
              accept="video/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="block w-full text-sm text-foreground
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-primary file:text-primary-foreground
                hover:file:bg-primary/90"
            />
          </div>

          <button
            type="submit"
            disabled={!file || uploading}
            className="w-full py-3 px-4 bg-primary text-primary-foreground rounded-md
              font-semibold disabled:opacity-50 disabled:cursor-not-allowed
              hover:bg-primary/90 transition-colors"
          >
            {uploading ? '업로드 중...' : '업로드'}
          </button>
        </form>

        {error && (
          <div className="mt-6 p-4 bg-destructive/10 border border-destructive rounded-md">
            <p className="text-destructive font-medium">오류: {error}</p>
          </div>
        )}

        {result && (
          <div className="mt-6 p-6 bg-card border border-border rounded-md space-y-4">
            <h2 className="text-xl font-semibold text-foreground">업로드 성공!</h2>
            
            <div>
              <p className="text-sm text-muted-foreground mb-2">파일명:</p>
              <p className="font-mono text-sm bg-muted p-2 rounded">{result.filename}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-2">Blob URL:</p>
              <div className="bg-muted p-3 rounded">
                <code className="text-xs break-all">{result.url}</code>
              </div>
            </div>

            <div className="pt-4 border-t border-border">
              <p className="text-sm text-muted-foreground mb-2">
                다음 단계:
              </p>
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li>위 URL을 복사하세요</li>
                <li>.env.local 파일에 추가: <code className="bg-muted px-2 py-1 rounded">HERO_VIDEO_URL=위_URL</code></li>
                <li>개발 서버 재시작</li>
              </ol>
            </div>

            <button
              onClick={() => {
                navigator.clipboard.writeText(result.url);
                alert('URL이 클립보드에 복사되었습니다!');
              }}
              className="w-full py-2 px-4 bg-secondary text-secondary-foreground rounded-md
                font-medium hover:bg-secondary/80 transition-colors"
            >
              URL 복사
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
