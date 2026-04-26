import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from './ui/card';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { ingestSource } from '@/lib/api';

export function SourceUploadForm({
  selectedDistrict,
  onDistrictChange
}: {
  selectedDistrict: string;
  onDistrictChange: (district: string) => void;
}) {
  const [sourceText, setSourceText] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  const handleIngest = async () => {
    if (!selectedDistrict || !sourceText) {
      setStatus({ type: 'error', message: 'Please provide both district and source text.' });
      return;
    }

    setLoading(true);
    setStatus(null);
    try {
      await ingestSource({ district: selectedDistrict, text: sourceText });
      setStatus({ type: 'success', message: 'Source successfully ingested!' });
      setSourceText('');
    } catch (error: any) {
      setStatus({ type: 'error', message: error.message || 'Failed to ingest source.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Data Ingestion</CardTitle>
        <CardDescription>Upload context data for a specific district.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="district">District</Label>
          <Select onValueChange={onDistrictChange} value={selectedDistrict}>
            <SelectTrigger id="district">
              <SelectValue placeholder="Select a district" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="district1">District 1</SelectItem>
              <SelectItem value="district2">District 2</SelectItem>
              <SelectItem value="district3">District 3</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="sourceText">Source Text</Label>
          <Textarea 
            id="sourceText" 
            placeholder="Paste election manuals or source context here..." 
            className="min-h-[150px]"
            value={sourceText}
            onChange={(e) => setSourceText(e.target.value)}
          />
        </div>

        {status && (
          <div className={`text-sm p-3 rounded-md ${status.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {status.message}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={handleIngest} disabled={loading || !selectedDistrict || !sourceText}>
          {loading ? 'Ingesting...' : 'Ingest Source Data'}
        </Button>
      </CardFooter>
    </Card>
  );
}

