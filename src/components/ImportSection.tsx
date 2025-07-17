'use client';

import { useState } from 'react';
import { SuperChatData, ImportData } from '@/types';
import { parseCSVFile, parseTextFile, exportToCSV } from '@/lib/data-import';
import { generateId } from '@/lib/utils';
import { Upload, FileText, Download, AlertCircle, CheckCircle, Type, Plus } from 'lucide-react';

interface ImportSectionProps {
  onImportData: (data: SuperChatData[]) => void;
  campaignCurrency: string;
}

export default function ImportSection({ onImportData, campaignCurrency }: ImportSectionProps) {
  const [isImporting, setIsImporting] = useState(false);
  const [importResult, setImportResult] = useState<ImportData | null>(null);
  const [dragActive, setDragActive] = useState(false);
  
  // Text input states
  const [showTextInput, setShowTextInput] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [isProcessingText, setIsProcessingText] = useState(false);

  const handleFileUpload = async (file: File) => {
    setIsImporting(true);
    setImportResult(null);

    try {
      let result: ImportData;

      if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
        result = await parseCSVFile(file);
      } else if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
        const content = await file.text();
        result = parseTextFile(content, campaignCurrency);
      } else {
        throw new Error('Unsupported file type. Please use CSV or TXT files.');
      }

      setImportResult(result);
      if (result.data.length > 0) {
        onImportData(result.data);
      }
    } catch (error) {
      setImportResult({
        format: 'csv',
        data: [],
        errors: [error instanceof Error ? error.message : 'Unknown error occurred']
      });
    } finally {
      setIsImporting(false);
    }
  };

  const handleTextImport = () => {
    if (!textInput.trim()) return;

    setIsProcessingText(true);
    setImportResult(null);

    try {
      const lines = textInput.trim().split('\n');
      const donations: SuperChatData[] = [];
      const errors: string[] = [];

      lines.forEach((line, index) => {
        const trimmed = line.trim();
        if (!trimmed) return;

        // Parse formats:
        // 1. "Name Amount" (e.g., "John Doe 25") - uses campaign currency
        // 2. "Name Amount Currency" (e.g., "John Doe 25 USD" or "Alice 50.75 INR")
        const parts = trimmed.split(/\s+/);
        if (parts.length < 2) {
          errors.push(`Line ${index + 1}: Invalid format. Expected "Name Amount" or "Name Amount Currency"`);
          return;
        }

        let amount: number;
        let currency: string = campaignCurrency;
        let name: string;

        // Check if last part is a currency code (3 letters, all caps)
        const lastPart = parts[parts.length - 1];
        const secondLastPart = parts[parts.length - 2];
        
        if (lastPart.length === 3 && lastPart === lastPart.toUpperCase() && isNaN(Number(lastPart))) {
          // Format: "Name Amount Currency"
          amount = parseFloat(secondLastPart);
          currency = lastPart;
          name = parts.slice(0, -2).join(' ');
        } else {
          // Format: "Name Amount"
          amount = parseFloat(lastPart);
          name = parts.slice(0, -1).join(' ');
        }

        if (isNaN(amount) || amount <= 0) {
          errors.push(`Line ${index + 1}: Invalid amount "${isNaN(amount) ? secondLastPart || lastPart : amount}"`);
          return;
        }

        if (!name.trim()) {
          errors.push(`Line ${index + 1}: Missing contributor name`);
          return;
        }

        donations.push({
          id: generateId(),
          contributor: name.trim(),
          amount: amount,
          currency: currency,
          message: '',
          timestamp: new Date(),
          platform: 'manual'
        });
      });

      const result: ImportData = {
        format: 'text',
        data: donations,
        errors: errors
      };

      setImportResult(result);
      if (donations.length > 0) {
        onImportData(donations);
        setTextInput('');
        setShowTextInput(false);
      }
    } catch (error) {
      setImportResult({
        format: 'text',
        data: [],
        errors: [error instanceof Error ? error.message : 'Unknown error occurred']
      });
    } finally {
      setIsProcessingText(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleExportSample = () => {
    const sampleData: SuperChatData[] = [
      {
        id: '1',
        contributor: 'John Doe',
        amount: 50,
        currency: 'USD',
        message: 'Great stream! Keep it up!',
        timestamp: new Date(),
        platform: 'manual'
      },
      {
        id: '2',
        contributor: 'Jane Smith',
        amount: 25,
        currency: 'USD',
        message: 'Love what you\'re doing for charity!',
        timestamp: new Date(),
        platform: 'manual'
      }
    ];

    exportToCSV(sampleData).then(csv => {
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'sample-superchats.csv';
      a.click();
      URL.revokeObjectURL(url);
    });
  };

  return (
    <div className="bg-white dark:bg-[#212121] rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-600">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <Upload className="w-5 h-5 text-blue-500" />
          Import Data
        </h2>
        <div className="flex gap-3">
          <button
            onClick={() => setShowTextInput(!showTextInput)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              showTextInput 
                ? 'bg-blue-500 text-white' 
                : 'border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            <Type className="w-4 h-4" />
            Text Input
          </button>
          <button
            onClick={handleExportSample}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
          >
            <Download className="w-4 h-4" />
            Sample CSV
          </button>
        </div>
      </div>

      {/* Text Input Area */}
      {showTextInput && (
        <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Quick Text Input</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            Enter one donation per line. Formats supported:
            <br />
            • <code className="bg-gray-200 dark:bg-gray-600 px-1 rounded">Name Amount</code> (uses {campaignCurrency})
            <br />
            • <code className="bg-gray-200 dark:bg-gray-600 px-1 rounded">Name Amount Currency</code> (custom currency)
          </p>
          <div className="space-y-3">
            <textarea
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder={`John Doe 25\nAlice Smith 50.75 EUR\nBob Johnson 100 INR`}
              className="w-full h-32 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[#212121] text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isProcessingText}
            />
            <div className="flex gap-2">
              <button
                onClick={handleTextImport}
                disabled={!textInput.trim() || isProcessingText}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white rounded-lg transition-colors"
              >
                {isProcessingText ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <Plus className="w-4 h-4" />
                )}
                {isProcessingText ? 'Processing...' : 'Add Donations'}
              </button>
              <button
                onClick={() => {
                  setTextInput('');
                  setShowTextInput(false);
                  setImportResult(null);
                }}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
          dragActive
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <div className="flex flex-col items-center gap-4">
          <div className={`p-3 rounded-full ${
            dragActive ? 'bg-blue-500' : 'bg-gray-100 dark:bg-gray-700'
          }`}>
            <Upload className={`w-8 h-8 ${
              dragActive ? 'text-white' : 'text-gray-400'
            }`} />
          </div>
          
          <div>
            <p className="text-lg font-medium text-gray-900 dark:text-white mb-1">
              {dragActive ? 'Drop your file here' : 'Drag & drop your file here'}
            </p>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Supports CSV and TXT files
            </p>
            
            <label className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg cursor-pointer transition-colors">
              <FileText className="w-4 h-4" />
              Choose File
              <input
                type="file"
                accept=".csv,.txt"
                onChange={handleFileInputChange}
                className="hidden"
                disabled={isImporting}
              />
            </label>
          </div>
        </div>
      </div>

      {/* Format Guide */}
      <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Supported Formats:</h3>
        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
          <div>
            <strong>CSV:</strong> contributor, amount, currency, message, timestamp
          </div>
          <div>
            <strong>Text Input:</strong> <code className="bg-gray-200 dark:bg-gray-600 px-1 rounded">Name Amount</code> or <code className="bg-gray-200 dark:bg-gray-600 px-1 rounded">Name Amount Currency</code>
          </div>
          <div>
            <strong>Examples:</strong> &quot;John Doe 25&quot;, &quot;Alice Smith 50.75 EUR&quot;, &quot;Bob Johnson 100 INR&quot;
          </div>
          <div>
            <strong>Text File:</strong> &quot;Name donated $50: Message&quot; or &quot;Name: $50 - Message&quot;
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isImporting && (
        <div className="mt-6 flex items-center justify-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
          <span className="text-blue-700 dark:text-blue-300">Processing file...</span>
        </div>
      )}

      {/* Import Results */}
      {importResult && (
        <div className="mt-6">
          {importResult.data.length > 0 ? (
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="font-semibold text-green-700 dark:text-green-300">
                  Import Successful
                </span>
              </div>
              <p className="text-green-600 dark:text-green-400">
                Imported {importResult.data.length} superchat{importResult.data.length !== 1 ? 's' : ''}
              </p>
              {importResult.errors && importResult.errors.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm text-yellow-600 dark:text-yellow-400">
                    {importResult.errors.length} row(s) had issues and were skipped
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <span className="font-semibold text-red-700 dark:text-red-300">
                  Import Failed
                </span>
              </div>
              {importResult.errors && (
                <div className="space-y-1">
                  {importResult.errors.map((error, index) => (
                    <p key={index} className="text-sm text-red-600 dark:text-red-400">
                      {error}
                    </p>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
