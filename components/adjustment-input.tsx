"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronUp, ChevronDown } from "lucide-react";

interface AdjustmentInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  id: string;
  min?: number;
  step?: number;
  unit?: string;
}

export function AdjustmentInput({
  label,
  value,
  onChange,
  id,
  min = 0,
  step = 1,
  unit,
}: AdjustmentInputProps) {
  const currentValue = value ? Number.parseFloat(value) : 0;

  const handleIncrement = () => {
    onChange((currentValue + step).toString());
  };

  const handleDecrement = () => {
    const newValue = Math.max(min, currentValue - step);
    onChange(newValue.toString());
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-sm">
        {label}
      </Label>
      {/* Vertical button stack on the right */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2">
          <Input
            id={id}
            type="number"
            min={min}
            step={step}
            placeholder="0"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="h-10 w-16 text-center flex-shrink-0 glass border-white/10 bg-white/5 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
          {unit && (
            <span className="text-xs text-muted-foreground ml-1">{unit}</span>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleIncrement}
            className="h-10 w-10 p-0 flex-shrink-0 glass-interactive border-white/10 hover:border-accent/50 bg-transparent"
          >
            <ChevronUp className="h-5 w-5" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleDecrement}
            className="h-10 w-10 p-0 flex-shrink-0 glass-interactive border-white/10 hover:border-accent/50 bg-transparent"
          >
            <ChevronDown className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
