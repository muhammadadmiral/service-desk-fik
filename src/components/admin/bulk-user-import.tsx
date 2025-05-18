// src/components/admin/bulk-user-import.tsx
"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiClient } from "@/lib/api";
import { Upload, FileText, CheckCircle, XCircle, AlertCircle } from "lucide-react";

// Sample API endpoint for bulk import
const importUsers = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  
  // This would be a real API endpoint in production
  return apiClient.users.bulkImport(formData);
};

export function BulkUserImport() {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<{
    success: number;
    errors: number;
    errorDetails?: string[];
  } | null>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
    setImportResult(null);
  };
  
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleImport = async () => {
    if (!selectedFile) {
      toast({
        title: "No file selected",
        description: "Please select a CSV file to import",
        variant: "destructive",
      });
      return;
    }
    
    setImporting(true);
    
    try {
      // In a real implementation, this would call the API
      // const result = await importUsers(selectedFile);
      
      // Simulate API response for demonstration
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate success with some errors
      const result = {
        success: 45,
        errors: 3,
        errorDetails: [
          "Row 12: Email already exists in the system",
          "Row 23: Invalid role specified",
          "Row 37: Missing required field 'department'",
        ],
      };
      
      setImportResult(result);
      
      toast({
        title: "Import completed",
        description: `Successfully imported ${result.success} users with ${result.errors} errors`,
        variant: result.errors ? "default" : "success",
      });
    } catch (error: any) {
      console.error("Error importing users:", error);
      
      toast({
        title: "Import failed",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setImporting(false);
    }
  };
  
  const handleReset = () => {
    setSelectedFile(null);
    setImportResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Bulk User Import</h2>
          <p className="text-muted-foreground mt-1">
            Import multiple users at once using a CSV file
          </p>
        </div>
        
        <a 
          href="/templates/bulk-user-import.csv" 
          download 
          className="text-primary hover:underline flex items-center text-sm"
        >
          <FileText className="h-4 w-4 mr-1" />
          Download Template
        </a>
      </div>
      
      <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="hidden"
        />
        
        {!selectedFile ? (
          <div className="py-4">
            <div className="mx-auto h-12 w-12 text-muted-foreground mb-4">
              <Upload className="h-12 w-12" />
            </div>
            <h3 className="text-lg font-medium mb-2">Upload CSV File</h3>
            <p className="text-muted-foreground mb-4 max-w-md mx-auto">
              Drag and drop your CSV file here, or click the button below to select a file from your computer.
            </p>
            <Button onClick={handleUploadClick}>
              Select File
            </Button>
          </div>
        ) : (
          <div className="py-4">
            <div className="flex items-center justify-center mb-4">
              <FileText className="h-8 w-8 text-primary mr-2" />
              <span className="font-medium">{selectedFile.name}</span>
              <span className="text-muted-foreground ml-2">
                ({Math.round(selectedFile.size / 1024)} KB)
              </span>
            </div>
            
            <div className="flex justify-center space-x-3">
              <Button
                variant="outline"
                onClick={handleReset}
                disabled={importing}
              >
                Change File
              </Button>
              <Button
                onClick={handleImport}
                isLoading={importing}
                disabled={importing}
              >
                {importing ? "Importing..." : "Import Users"}
              </Button>
            </div>
          </div>
        )}
      </div>
      
      {importResult && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="border rounded-lg p-6"
        >
          <h3 className="text-lg font-medium mb-4">Import Results</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <div className="bg-success/10 rounded-md p-4 flex items-center">
              <CheckCircle className="h-8 w-8 text-success mr-3" />
              <div>
                <p className="text-sm text-muted-foreground">Successfully Imported</p>
                <p className="text-2xl font-bold">{importResult.success} users</p>
              </div>
            </div>
            
            <div className={`${importResult.errors > 0 ? 'bg-error/10' : 'bg-muted'} rounded-md p-4 flex items-center`}>
              <XCircle className={`h-8 w-8 ${importResult.errors > 0 ? 'text-error' : 'text-muted-foreground'} mr-3`} />
              <div>
                <p className="text-sm text-muted-foreground">Errors</p>
                <p className="text-2xl font-bold">{importResult.errors} records</p>
              </div>
            </div>
          </div>
          
          {importResult.errors > 0 && importResult.errorDetails && (
            <div className="bg-warning/10 border border-warning/20 rounded-md p-4">
              <div className="flex items-start mb-2">
                <AlertCircle className="h-5 w-5 text-warning mr-2 mt-0.5" />
                <h4 className="font-medium">Error Details</h4>
              </div>
              <ul className="ml-7 list-disc space-y-1">
                {importResult.errorDetails.map((error, index) => (
                  <li key={index} className="text-sm text-muted-foreground">
                    {error}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          <div className="flex justify-end mt-4">
            <Button
              variant="outline"
              onClick={handleReset}
            >
              Import Another File
            </Button>
          </div>
        </motion.div>
      )}
      
      <div className="bg-muted p-4 rounded-md">
        <h3 className="text-sm font-medium mb-2">CSV Format Requirements</h3>
        <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
          <li>First row must contain column headers: name, email, role, department, etc.</li>
          <li>Role must be one of: mahasiswa, dosen, admin, executive</li>
          <li>For mahasiswa role, NIM field is required</li>
          <li>For dosen role, NIP field is required</li>
          <li>Password field is required for all users (temporary password)</li>
          <li>Maximum file size: 5MB</li>
        </ul>
      </div>
    </div>
  );
}