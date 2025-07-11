import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Download, 
  Share2, 
  Eye, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Loader,
  AlertCircle
} from 'lucide-react';
import { TryOnSession, tryOnApi } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

interface TryOnResultProps {
  session: TryOnSession;
  onSessionUpdate?: (session: TryOnSession) => void;
}

export const TryOnResult: React.FC<TryOnResultProps> = ({ session, onSessionUpdate }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const { toast } = useToast();

  const getStatusIcon = () => {
    switch (session.status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'processing':
        return <Loader className="h-4 w-4 animate-spin" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'failed':
        return <XCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getStatusColor = () => {
    switch (session.status) {
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'processing':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'completed':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'failed':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      default:
        return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  const handleDownload = async () => {
    if (session.status !== 'completed') {
      toast({
        title: "Download Not Available",
        description: "Result image is not ready yet.",
        variant: "destructive",
      });
      return;
    }

    setIsDownloading(true);
    try {
      // Use direct download URL instead of blob
      const downloadUrl = tryOnApi.getDownloadUrl(session.sessionId);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `tryon_result_${session.sessionId}.jpg`;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Download Complete",
        description: "Your try-on result has been downloaded successfully.",
      });
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: "Download Failed",
        description: "Failed to download the result image.",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShare = async () => {
    if (session.status !== 'completed') {
      toast({
        title: "Share Not Available",
        description: "Result image is not ready yet.",
        variant: "destructive",
      });
      return;
    }

    try {
      const resultUrl = tryOnApi.getResultImageUrl(session.sessionId);
      
      if (navigator.share) {
        await navigator.share({
          title: 'My Virtual Try-On Result',
          text: 'Check out my virtual try-on result!',
          url: resultUrl,
        });
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(resultUrl);
        toast({
          title: "Link Copied",
          description: "Result link has been copied to clipboard.",
        });
      }
    } catch (error) {
      console.error('Share error:', error);
      toast({
        title: "Share Failed",
        description: "Failed to share the result.",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getProcessingTime = () => {
    if (session.processingStartedAt && session.processingCompletedAt) {
      const start = new Date(session.processingStartedAt);
      const end = new Date(session.processingCompletedAt);
      const diff = Math.round((end.getTime() - start.getTime()) / 1000);
      return `${diff}s`;
    }
    return null;
  };

  return (
    <Card className="glass-card">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Try-On Result</CardTitle>
          <Badge className={getStatusColor()}>
            {getStatusIcon()}
            <span className="ml-2 capitalize">{session.status}</span>
          </Badge>
        </div>
        <div className="text-sm text-muted-foreground">
          Session ID: {session.sessionId}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Result Image */}
        {session.status === 'completed' && session.metadata.resultImageUrl && (
          <div className="relative">
            <img
              src={session.metadata.resultImageUrl}
              alt="Try-on result"
              className="w-full max-w-none h-auto object-contain rounded-lg border"
              style={{ maxHeight: '800px' }}
              crossOrigin="anonymous"
              referrerPolicy="no-referrer"
            />
            <div className="absolute top-2 right-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={handleDownload}
                disabled={isDownloading}
              >
                {isDownloading ? (
                  <Loader className="h-4 w-4 animate-spin" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        )}

        {/* Processing Status */}
        {session.status === 'processing' && (
          <div className="text-center py-8">
            <Loader className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-lg font-medium">Processing your try-on...</p>
            <p className="text-sm text-muted-foreground">This usually takes 15-30 seconds</p>
          </div>
        )}

        {/* Error Message */}
        {session.status === 'failed' && (
          <div className="text-center py-8">
            <XCircle className="h-12 w-12 mx-auto mb-4 text-red-500" />
            <p className="text-lg font-medium text-red-500">Processing Failed</p>
            <p className="text-sm text-muted-foreground">
              {session.errorMessage || "Something went wrong during processing"}
            </p>
          </div>
        )}

        {/* Session Info */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Created:</span>
            <div className="font-medium">{formatDate(session.createdAt)}</div>
          </div>
          {getProcessingTime() && (
            <div>
              <span className="text-muted-foreground">Processing Time:</span>
              <div className="font-medium">{getProcessingTime()}</div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        {session.status === 'completed' && (
          <div className="flex gap-2">
            <Button
              variant="default"
              onClick={handleDownload}
              disabled={isDownloading}
              className="flex-1"
            >
              {isDownloading ? (
                <Loader className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Download className="h-4 w-4 mr-2" />
              )}
              Download
            </Button>
            <Button
              variant="outline"
              onClick={handleShare}
              className="flex-1"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}; 