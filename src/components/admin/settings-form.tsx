// src/components/admin/settings-form.tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useSettingsCategory, useUpdateSettings } from "@/hooks/api/settings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

type SettingType = "string" | "number" | "boolean" | "json" | "array";

interface SettingFormProps {
  category: string;
  title: string;
  description?: string;
}

interface Setting {
  key: string;
  value: any;
  label: string;
  type: SettingType;
  description?: string;
  options?: { label: string; value: string }[];
}

export function SettingsForm({ category, title, description }: SettingFormProps) {
  const { toast } = useToast();
  const { data: settings, isLoading, isError } = useSettingsCategory(category);
  const { mutateAsync: updateSettings, isPending: isUpdating } = useUpdateSettings();
  
  const [formValues, setFormValues] = useState<Record<string, any>>({});
  const [isDirty, setIsDirty] = useState(false);
  
  // Update form values when settings are loaded
  useState(() => {
    if (settings) {
      const initialValues: Record<string, any> = {};
      Object.keys(settings).forEach(key => {
        initialValues[key] = settings[key].value;
      });
      setFormValues(initialValues);
    }
  });
  
  const handleInputChange = (key: string, value: any) => {
    setFormValues(prev => ({
      ...prev,
      [key]: value,
    }));
    setIsDirty(true);
  };
  
  const handleSaveSettings = async () => {
    try {
      await updateSettings(formValues);
      
      toast({
        title: "Settings updated",
        description: "Your settings have been saved successfully",
        variant: "success",
      });
      
      setIsDirty(false);
    } catch (error) {
      toast({
        title: "Failed to update settings",
        description: "An error occurred while saving your settings",
        variant: "destructive",
      });
    }
  };
  
  // Render input based on setting type
  const renderInput = (setting: Setting) => {
    const { key, value, type, options } = setting;
    
    switch (type) {
      case "boolean":
        return (
          <Select
            options={[
              { label: "Yes", value: "true" },
              { label: "No", value: "false" },
            ]}
            value={formValues[key]?.toString() || "false"}
            onChange={(val) => handleInputChange(key, val === "true")}
          />
        );
      
      case "number":
        return (
          <Input
            type="number"
            value={formValues[key] || 0}
            onChange={(e) => handleInputChange(key, Number(e.target.value))}
          />
        );
      
      case "json":
        return (
          <textarea
            className="w-full h-32 rounded-md border border-input bg-background px-3 py-2 text-sm 
                       focus:outline-none focus:ring-2 focus:ring-primary"
            value={typeof formValues[key] === 'object' ? JSON.stringify(formValues[key], null, 2) : formValues[key] || ''}
            onChange={(e) => {
              try {
                handleInputChange(key, JSON.parse(e.target.value));
              } catch {
                // If not valid JSON, just store as string
                handleInputChange(key, e.target.value);
              }
            }}
          />
        );
      
      case "array":
        return (
          <textarea
            className="w-full h-32 rounded-md border border-input bg-background px-3 py-2 text-sm 
                       focus:outline-none focus:ring-2 focus:ring-primary"
            value={Array.isArray(formValues[key]) ? JSON.stringify(formValues[key], null, 2) : formValues[key] || '[]'}
            onChange={(e) => {
              try {
                handleInputChange(key, JSON.parse(e.target.value));
              } catch {
                // If not valid JSON, just store as string
                handleInputChange(key, e.target.value);
              }
            }}
          />
        );
      
      default:
        // String type or fallback
        if (options && options.length > 0) {
          return (
            <Select
              options={options}
              value={formValues[key]?.toString() || ""}
              onChange={(val) => handleInputChange(key, val)}
            />
          );
        }
        
        return (
          <Input
            type="text"
            value={formValues[key] || ""}
            onChange={(e) => handleInputChange(key, e.target.value)}
          />
        );
    }
  };
  
  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-muted rounded-md w-1/3" />
        <div className="h-4 bg-muted rounded-md w-2/3" />
        {[...Array(4)].map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-4 bg-muted rounded-md w-1/4" />
            <div className="h-10 bg-muted rounded-md" />
          </div>
        ))}
      </div>
    );
  }
  
  // Error state
  if (isError) {
    return (
      <div className="p-6 bg-muted rounded-lg text-center">
        <h3 className="text-lg font-medium mb-2">Failed to load settings</h3>
        <p className="text-muted-foreground mb-4">
          An error occurred while loading the settings.
        </p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }
  
  // Empty state
  if (!settings || Object.keys(settings).length === 0) {
    return (
      <div className="p-6 bg-muted/50 rounded-lg text-center">
        <h3 className="text-lg font-medium mb-2">No settings found</h3>
        <p className="text-muted-foreground mb-4">
          There are no settings available in this category.
        </p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-2xl font-bold">{title}</h2>
        {description && (
          <p className="mt-1 text-muted-foreground">{description}</p>
        )}
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        {Object.keys(settings).map((key) => {
          const setting = settings[key];
          return (
            <div key={key} className="space-y-2">
              <div className="flex justify-between">
                <label className="block text-sm font-medium">
                  {setting.label || key}
                </label>
                {setting.description && (
                  <span className="text-xs text-muted-foreground">
                    {setting.description}
                  </span>
                )}
              </div>
              {renderInput({
                key,
                ...setting,
              })}
            </div>
          );
        })}
      </div>
      
      <div className="flex justify-end">
        <Button
          onClick={handleSaveSettings}
          isLoading={isUpdating}
          disabled={!isDirty}
        >
          Save Settings
        </Button>
      </div>
    </motion.div>
  );
}